import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Star, StarOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Property, PropertyRegion, PropertyStatus, PropertyType, GalleryImage } from "@/lib/properties";
import { toast } from "@/hooks/use-toast";

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

interface FormState {
  slug: string;
  title: string;
  status: PropertyStatus;
  property_type: PropertyType | "";
  region: PropertyRegion | "";
  city: string;
  sector: string;
  price_amount: string;
  price_display: string;
  price_on_request: boolean;
  area_m2: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  has_terrace: boolean;
  has_garden: boolean;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_mountain_view: boolean;
  has_open_view: boolean;
  short_description: string;
  long_description: string;
  short_description_en: string;
  long_description_en: string;
  highlights: string;
  energy_class: string;
  main_image_url: string;
  gallery: GalleryImage[];
  plan_pdf_url: string;
  internal_ref: string;
  featured: boolean;
  coup_de_coeur: boolean;
  display_order: string;
  matterport_id: string;
  video_url: string;
  video_url_2: string;
  video_file_url: string;
  hero_video_url: string;
  drone_video_url: string;
  virtual_tour_url: string;
  virtual_tour_iframe: string;
  show_video: boolean;
  show_virtual_tour: boolean;
  seo_title: string;
  seo_description: string;
}

const empty: FormState = {
  slug: "", title: "", status: "disponible", property_type: "", region: "",
  city: "", sector: "", price_amount: "", price_display: "", price_on_request: false,
  area_m2: "", rooms: "", bedrooms: "", bathrooms: "", floor: "",
  has_terrace: false, has_garden: false, has_balcony: false,
  has_sea_view: false, has_mountain_view: false, has_open_view: false,
  short_description: "", long_description: "", short_description_en: "", long_description_en: "",
  highlights: "", energy_class: "", main_image_url: "", gallery: [],
  plan_pdf_url: "", internal_ref: "", featured: false, coup_de_coeur: false,
  display_order: "0", matterport_id: "",
  video_url: "", video_url_2: "", video_file_url: "", hero_video_url: "", drone_video_url: "",
  virtual_tour_url: "", virtual_tour_iframe: "",
  show_video: true, show_virtual_tour: true,
  seo_title: "", seo_description: "",
};

const AdminBienEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const nav = useNavigate();
  const [f, setF] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const heroVideoFileRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState<"main" | "hero" | null>(null);

  useEffect(() => {
    if (isNew) return;
    supabase.from("properties").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error || !data) { toast({ title: "Bien introuvable", variant: "destructive" }); nav("/admin/biens"); return; }
      const p = data as unknown as Property;
      setF({
        slug: p.slug, title: p.title, status: p.status,
        property_type: p.property_type ?? "", region: p.region ?? "",
        city: p.city ?? "", sector: p.sector ?? "",
        price_amount: p.price_amount?.toString() ?? "", price_display: p.price_display ?? "", price_on_request: p.price_on_request,
        area_m2: p.area_m2?.toString() ?? "", rooms: p.rooms?.toString() ?? "",
        bedrooms: p.bedrooms?.toString() ?? "", bathrooms: p.bathrooms?.toString() ?? "", floor: p.floor ?? "",
        has_terrace: p.has_terrace, has_garden: p.has_garden, has_balcony: p.has_balcony,
        has_sea_view: p.has_sea_view, has_mountain_view: p.has_mountain_view, has_open_view: p.has_open_view,
        short_description: p.short_description ?? "", long_description: p.long_description ?? "",
        short_description_en: p.short_description_en ?? "", long_description_en: p.long_description_en ?? "",
        highlights: p.highlights.join("\n"),
        energy_class: p.energy_class ?? "",
        main_image_url: p.main_image_url ?? "",
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
        plan_pdf_url: p.plan_pdf_url ?? "", internal_ref: p.internal_ref ?? "",
        featured: p.featured, coup_de_coeur: p.coup_de_coeur,
        display_order: p.display_order.toString(),
        matterport_id: p.matterport_id ?? "",
        video_url: p.video_url ?? "",
        video_url_2: p.video_url_2 ?? "",
        video_file_url: p.video_file_url ?? "",
        hero_video_url: p.hero_video_url ?? "",
        drone_video_url: p.drone_video_url ?? "",
        virtual_tour_url: p.virtual_tour_url ?? "",
        virtual_tour_iframe: p.virtual_tour_iframe ?? "",
        show_video: p.show_video ?? true,
        show_virtual_tour: p.show_virtual_tour ?? true,
        seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "",
      });
      setLoading(false);
    });
  }, [id, isNew, nav]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const uploadFile = async (file: File, folder = "uploads"): Promise<string | null> => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: false });
    if (error) { toast({ title: "Upload échoué", description: error.message, variant: "destructive" }); return null; }
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleMainUpload = async (file: File) => {
    const url = await uploadFile(file, "main");
    if (url) set("main_image_url", url);
  };

  const handleGalleryUpload = async (files: FileList) => {
    const uploaded: GalleryImage[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "gallery");
      if (url) uploaded.push({ url, alt: "" });
    }
    set("gallery", [...f.gallery, ...uploaded]);
  };

  const removeGalleryItem = (i: number) => {
    set("gallery", f.gallery.filter((_, idx) => idx !== i));
  };

  const promoteToMain = (i: number) => {
    const item = f.gallery[i];
    if (!item) return;
    const newGallery = [...f.gallery];
    if (f.main_image_url) newGallery[i] = { url: f.main_image_url, alt: item.alt };
    else newGallery.splice(i, 1);
    set("main_image_url", item.url);
    set("gallery", newGallery);
  };

  const handleVideoUpload = async (file: File, kind: "main" | "hero") => {
    if (file.size > 80 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Limite indicative : 50 Mo. Compressez la vidéo (HandBrake, export web).", variant: "destructive" });
      return;
    }
    setVideoUploading(kind);
    const url = await uploadFile(file, "videos");
    setVideoUploading(null);
    if (!url) return;
    if (kind === "main") set("video_file_url", url);
    else set("hero_video_url", url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = f.slug.trim() || slugify(`${f.title}-${f.city}`);
    const payload = {
      slug,
      title: f.title.trim(),
      status: f.status,
      property_type: f.property_type || null,
      region: f.region || null,
      city: f.city.trim() || null,
      sector: f.sector.trim() || null,
      price_amount: f.price_amount ? Number(f.price_amount) : null,
      price_display: f.price_display.trim() || null,
      price_on_request: f.price_on_request,
      area_m2: f.area_m2 ? Number(f.area_m2) : null,
      rooms: f.rooms ? Number(f.rooms) : null,
      bedrooms: f.bedrooms ? Number(f.bedrooms) : null,
      bathrooms: f.bathrooms ? Number(f.bathrooms) : null,
      floor: f.floor.trim() || null,
      has_terrace: f.has_terrace, has_garden: f.has_garden, has_balcony: f.has_balcony,
      has_sea_view: f.has_sea_view, has_mountain_view: f.has_mountain_view, has_open_view: f.has_open_view,
      short_description: f.short_description.trim() || null,
      long_description: f.long_description.trim() || null,
      short_description_en: f.short_description_en.trim() || null,
      long_description_en: f.long_description_en.trim() || null,
      highlights: f.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      energy_class: f.energy_class.trim() || null,
      main_image_url: f.main_image_url.trim() || null,
      gallery: f.gallery,
      plan_pdf_url: f.plan_pdf_url.trim() || null,
      internal_ref: f.internal_ref.trim() || null,
      featured: f.featured,
      coup_de_coeur: f.coup_de_coeur,
      display_order: Number(f.display_order) || 0,
      matterport_id: f.matterport_id.trim() || null,
      video_url: f.video_url.trim() || null,
      video_url_2: f.video_url_2.trim() || null,
      video_file_url: f.video_file_url.trim() || null,
      hero_video_url: f.hero_video_url.trim() || null,
      drone_video_url: f.drone_video_url.trim() || null,
      virtual_tour_url: f.virtual_tour_url.trim() || null,
      virtual_tour_iframe: f.virtual_tour_iframe.trim() || null,
      show_video: f.show_video,
      show_virtual_tour: f.show_virtual_tour,
      seo_title: f.seo_title.trim() || null,
      seo_description: f.seo_description.trim() || null,
    };

    // gallery is JSONB → cast to satisfy generated Json type
    const dbPayload = { ...payload, gallery: payload.gallery as unknown as never };

    const res = isNew
      ? await supabase.from("properties").insert(dbPayload).select("id").single()
      : await supabase.from("properties").update(dbPayload).eq("id", id!).select("id").single();

    setSaving(false);
    if (res.error) {
      toast({ title: "Erreur", description: res.error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Bien créé" : "Bien mis à jour" });
      nav("/admin/biens");
    }
  };

  if (loading) return <main className="min-h-screen pt-32 px-6"><p className="text-muted-foreground">Chargement…</p></main>;

  const inputCls = "w-full bg-background border border-border px-3 py-2.5 font-body text-sm text-foreground focus:border-primary outline-none";
  const labelCls = "font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2";
  const checkCls = "flex items-center gap-2 font-body text-xs uppercase tracking-wider text-foreground cursor-pointer";

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => nav("/admin/biens")} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="font-display text-4xl text-foreground mb-10">{isNew ? "Ajouter un bien" : "Modifier le bien"}</h1>

        <form onSubmit={submit} className="space-y-10">
          {/* Section: identité */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Identité</h2>
            <div>
              <label className={labelCls}>Titre *</label>
              <input required value={f.title} onChange={(e) => set("title", e.target.value)} onBlur={() => { if (!f.slug) set("slug", slugify(`${f.title}-${f.city}`)); }} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug URL (auto si vide)</label>
              <input value={f.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="villa-vue-mer-monticello" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">/biens/{f.slug || "…"}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Statut</label>
                <select value={f.status} onChange={(e) => set("status", e.target.value as PropertyStatus)} className={inputCls}>
                  <option value="disponible">Disponible</option>
                  <option value="sous_offre">Sous offre</option>
                  <option value="reserve">Réservé</option>
                  <option value="vendu">Vendu</option>
                  <option value="masque">Masqué (hors site public)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Type de bien</label>
                <select value={f.property_type} onChange={(e) => set("property_type", e.target.value as PropertyType)} className={inputCls}>
                  <option value="">—</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="terrain">Terrain</option>
                  <option value="local_commercial">Local commercial</option>
                  <option value="programme">Programme immobilier</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Référence interne</label>
                <input value={f.internal_ref} onChange={(e) => set("internal_ref", e.target.value)} className={inputCls} />
              </div>
            </div>
          </section>

          {/* Section: localisation */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Localisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Région</label>
                <select value={f.region} onChange={(e) => set("region", e.target.value as PropertyRegion)} className={inputCls}>
                  <option value="">—</option>
                  <option value="corse">Corse</option>
                  <option value="continent">Continent</option>
                  <option value="monaco">Monaco</option>
                  <option value="bali">Bali</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Ville</label>
                <input value={f.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Secteur / quartier</label>
                <input value={f.sector} onChange={(e) => set("sector", e.target.value)} className={inputCls} />
              </div>
            </div>
          </section>

          {/* Section: prix */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Prix</h2>
            <label className={checkCls}>
              <input type="checkbox" checked={f.price_on_request} onChange={(e) => set("price_on_request", e.target.checked)} className="accent-primary" />
              Prix sur demande
            </label>
            {!f.price_on_request && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Prix (€) — chiffre</label>
                  <input type="number" value={f.price_amount} onChange={(e) => set("price_amount", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Affichage personnalisé (optionnel)</label>
                  <input value={f.price_display} onChange={(e) => set("price_display", e.target.value)} placeholder="€ 1 250 000" className={inputCls} />
                </div>
              </div>
            )}
          </section>

          {/* Section: caractéristiques */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Caractéristiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div><label className={labelCls}>Surface (m²)</label><input type="number" value={f.area_m2} onChange={(e) => set("area_m2", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Pièces</label><input type="number" value={f.rooms} onChange={(e) => set("rooms", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Chambres</label><input type="number" value={f.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Salles de bain</label><input type="number" value={f.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Étage</label><input value={f.floor} onChange={(e) => set("floor", e.target.value)} className={inputCls} /></div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                ["has_terrace", "Terrasse"], ["has_garden", "Jardin"], ["has_balcony", "Balcon"],
                ["has_sea_view", "Vue mer"], ["has_mountain_view", "Vue montagne"], ["has_open_view", "Vue dégagée"],
              ].map(([k, label]) => (
                <label key={k} className={checkCls}>
                  <input type="checkbox" checked={f[k as keyof FormState] as boolean} onChange={(e) => set(k as keyof FormState, e.target.checked as never)} className="accent-primary" />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <label className={labelCls}>Classe énergie</label>
              <input value={f.energy_class} onChange={(e) => set("energy_class", e.target.value)} placeholder="A, B, C…" className={`${inputCls} max-w-[120px]`} />
            </div>
          </section>

          {/* Section: descriptions */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Descriptions</h2>
            <div><label className={labelCls}>Description courte (FR)</label><textarea rows={2} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Description longue (FR)</label><textarea rows={6} value={f.long_description} onChange={(e) => set("long_description", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Short description (EN)</label><textarea rows={2} value={f.short_description_en} onChange={(e) => set("short_description_en", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Long description (EN)</label><textarea rows={6} value={f.long_description_en} onChange={(e) => set("long_description_en", e.target.value)} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Points forts (un par ligne)</label>
              <textarea rows={4} value={f.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Vue panoramique\nProche commerces\nÉtat impeccable"} className={inputCls} />
            </div>
          </section>

          {/* Section: photos */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Photos</h2>
            <div>
              <label className={labelCls}>Photo principale</label>
              {f.main_image_url && (
                <img src={f.main_image_url} alt="Principale" className="w-48 h-36 object-cover mb-3 border border-border" />
              )}
              <input ref={mainFileRef} type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) handleMainUpload(file); }} />
              <button type="button" onClick={() => mainFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary">
                <Upload size={14} /> {f.main_image_url ? "Remplacer" : "Téléverser"}
              </button>
              <input value={f.main_image_url} onChange={(e) => set("main_image_url", e.target.value)} placeholder="ou URL externe" className={`${inputCls} mt-3`} />
            </div>

            <div>
              <label className={labelCls}>Galerie</label>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) handleGalleryUpload(e.target.files); }} />
              <button type="button" onClick={() => galleryFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary mb-4">
                <Upload size={14} /> Ajouter des photos
              </button>
              {f.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {f.gallery.map((g, i) => (
                    <div key={i} className="relative group">
                      <img src={g.url} alt={g.alt ?? ""} className="w-full aspect-[4/3] object-cover border border-border" />
                      <input
                        value={g.alt ?? ""}
                        onChange={(e) => {
                          const next = [...f.gallery];
                          next[i] = { ...next[i], alt: e.target.value };
                          set("gallery", next);
                        }}
                        placeholder="Texte alt SEO"
                        className="w-full mt-1 text-xs bg-background border border-border px-2 py-1"
                      />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button type="button" onClick={() => promoteToMain(i)} title="Définir comme principale" className="bg-background/90 p-1 border border-border">
                          {f.main_image_url === g.url ? <Star size={14} className="text-primary fill-current" /> : <StarOff size={14} />}
                        </button>
                        <button type="button" onClick={() => removeGalleryItem(i)} title="Supprimer" className="bg-background/90 p-1 border border-border text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section: vidéos */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Vidéos</h2>
            <p className="font-body text-xs text-muted-foreground -mt-2">
              Trois supports vidéo complémentaires : lien YouTube/Vimeo (lecteur dans la galerie), fichier MP4 hébergé, et vidéo de fond (drone) en haut de la fiche.
            </p>

            <div>
              <label className={labelCls}>Lien YouTube ou Vimeo</label>
              <input value={f.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="https://www.youtube.com/watch?v=… ou https://vimeo.com/…" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">Affichée comme vignette « Vidéo » dans la galerie de la fiche.</p>
            </div>

            <div>
              <label className={labelCls}>Vidéo MP4 (upload direct)</label>
              {f.video_file_url && (
                <video src={f.video_file_url} controls className="w-72 mb-3 border border-border" />
              )}
              <input ref={videoFileRef} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) handleVideoUpload(file, "main"); }} />
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={videoUploading === "main"} onClick={() => videoFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary disabled:opacity-50">
                  <Upload size={14} /> {videoUploading === "main" ? "Envoi…" : f.video_file_url ? "Remplacer" : "Téléverser"}
                </button>
                {f.video_file_url && (
                  <button type="button" onClick={() => set("video_file_url", "")} className="font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border text-destructive hover:border-destructive">
                    Retirer
                  </button>
                )}
              </div>
              <input value={f.video_file_url} onChange={(e) => set("video_file_url", e.target.value)} placeholder="ou URL externe MP4" className={`${inputCls} mt-3`} />
              <p className="text-xs text-muted-foreground mt-1">Format conseillé : MP4 H.264, &lt; 50 Mo. Compressez avec HandBrake si besoin.</p>
            </div>

            <div>
              <label className={labelCls}>Vidéo de fond (drone / aérienne)</label>
              {f.hero_video_url && (
                <video src={f.hero_video_url} muted loop autoPlay playsInline className="w-72 mb-3 border border-border" />
              )}
              <input ref={heroVideoFileRef} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) handleVideoUpload(file, "hero"); }} />
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={videoUploading === "hero"} onClick={() => heroVideoFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary disabled:opacity-50">
                  <Upload size={14} /> {videoUploading === "hero" ? "Envoi…" : f.hero_video_url ? "Remplacer" : "Téléverser"}
                </button>
                {f.hero_video_url && (
                  <button type="button" onClick={() => set("hero_video_url", "")} className="font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border text-destructive hover:border-destructive">
                    Retirer
                  </button>
                )}
              </div>
              <input value={f.hero_video_url} onChange={(e) => set("hero_video_url", e.target.value)} placeholder="ou URL externe MP4" className={`${inputCls} mt-3`} />
              <p className="text-xs text-muted-foreground mt-1">Diffusée en boucle, muette, au-dessus de la galerie. Format conseillé : MP4 16:9, 8–15 s, &lt; 15 Mo.</p>
            </div>

            <div>
              <label className={labelCls}>Vidéo secondaire (YouTube / Vimeo / MP4)</label>
              <input value={f.video_url_2} onChange={(e) => set("video_url_2", e.target.value)} placeholder="https://…" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">Deuxième vidéo (ex. intérieur + extérieur). Affichée dans la section « Découvrir le bien autrement ».</p>
            </div>

            <div>
              <label className={labelCls}>Vidéo drone / aérienne (lecteur)</label>
              <input value={f.drone_video_url} onChange={(e) => set("drone_video_url", e.target.value)} placeholder="https://… ou URL MP4" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">Affichée comme carte dédiée « Vue aérienne ». Distincte de la vidéo de fond.</p>
            </div>

            <label className={`${checkCls} pt-2`}>
              <input type="checkbox" checked={f.show_video} onChange={(e) => set("show_video", e.target.checked)} className="accent-primary" />
              Afficher la section vidéo sur la fiche publique
            </label>
          </section>

          {/* Section: visite virtuelle */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Visite virtuelle</h2>
            <p className="font-body text-xs text-muted-foreground -mt-2">
              Trois options possibles. Renseignez celle qui correspond à votre prestataire — la fiche utilisera la première disponible.
            </p>

            <div>
              <label className={labelCls}>ID Matterport</label>
              <input value={f.matterport_id} onChange={(e) => set("matterport_id", e.target.value)} placeholder="SxQL3iGnMqk" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">Identifiant trouvé dans l'URL Matterport : <code>my.matterport.com/show/?m=<strong>ID</strong></code></p>
            </div>

            <div>
              <label className={labelCls}>Lien visite virtuelle (Kuula, 360°, autre)</label>
              <input value={f.virtual_tour_url} onChange={(e) => set("virtual_tour_url", e.target.value)} placeholder="https://kuula.co/share/…" className={inputCls} />
              <p className="text-xs text-muted-foreground mt-1">Pour ouvrir la visite dans un nouvel onglet si l'intégration iframe n'est pas possible.</p>
            </div>

            <div>
              <label className={labelCls}>Code iframe brut (avancé)</label>
              <textarea
                rows={3}
                value={f.virtual_tour_iframe}
                onChange={(e) => set("virtual_tour_iframe", e.target.value)}
                placeholder='<iframe src="..." allowfullscreen></iframe>'
                className={`${inputCls} font-mono text-xs`}
              />
              <p className="text-xs text-muted-foreground mt-1">⚠️ À utiliser uniquement avec un prestataire de confiance. L'iframe sera intégré tel quel (sandbox sécurisée).</p>
            </div>

            <label className={`${checkCls} pt-2`}>
              <input type="checkbox" checked={f.show_virtual_tour} onChange={(e) => set("show_virtual_tour", e.target.checked)} className="accent-primary" />
              Afficher la visite virtuelle sur la fiche publique
            </label>
          </section>





          {/* Section: extras */}
          <section className="space-y-5">
            <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Extras & SEO</h2>
            <div>
              <label className={labelCls}>URL du plan PDF</label>
              <input value={f.plan_pdf_url} onChange={(e) => set("plan_pdf_url", e.target.value)} className={inputCls} />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className={checkCls}>
                <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-primary" />
                Afficher en page d'accueil
              </label>
              <label className={checkCls}>
                <input type="checkbox" checked={f.coup_de_coeur} onChange={(e) => set("coup_de_coeur", e.target.checked)} className="accent-primary" />
                Coup de cœur
              </label>
              <div className="flex items-center gap-2">
                <label className="font-body text-xs uppercase tracking-wider text-foreground">Ordre d'affichage</label>
                <input type="number" value={f.display_order} onChange={(e) => set("display_order", e.target.value)} className="w-20 bg-background border border-border px-2 py-1 text-sm" />
              </div>
            </div>
            <div><label className={labelCls}>SEO title (optionnel)</label><input value={f.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>SEO description (optionnel)</label><textarea rows={2} value={f.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={inputCls} /></div>
          </section>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button disabled={saving} type="submit" className="font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50">
              {saving ? "Enregistrement…" : isNew ? "Créer le bien" : "Enregistrer"}
            </button>
            <button type="button" onClick={() => nav("/admin/biens")} className="font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-border text-foreground hover:border-primary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminBienEdit;
