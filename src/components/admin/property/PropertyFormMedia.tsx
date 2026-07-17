import { Upload, Trash2, Star, StarOff } from "lucide-react";
import type { RefObject } from "react";
import { checkCls, inputCls, labelCls } from "./formStyles";
import type { PropertyFormSet, PropertyFormState } from "./propertyFormState";

type PropertyFormMediaProps = {
  form: PropertyFormState;
  onChange: PropertyFormSet;
  mainFileRef: RefObject<HTMLInputElement>;
  galleryFileRef: RefObject<HTMLInputElement>;
  videoFileRef: RefObject<HTMLInputElement>;
  heroVideoFileRef: RefObject<HTMLInputElement>;
  videoUploading: "main" | "hero" | null;
  onMainUpload: (file: File) => void;
  onGalleryUpload: (files: FileList) => void;
  onVideoUpload: (file: File, kind: "main" | "hero") => void;
  onRemoveGalleryItem: (index: number) => void;
  onPromoteToMain: (index: number) => void;
};

export function PropertyFormMedia({
  form,
  onChange,
  mainFileRef,
  galleryFileRef,
  videoFileRef,
  heroVideoFileRef,
  videoUploading,
  onMainUpload,
  onGalleryUpload,
  onVideoUpload,
  onRemoveGalleryItem,
  onPromoteToMain,
}: PropertyFormMediaProps) {
  return (
    <>
      <section className="space-y-5">
        <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Photos</h2>
        <div>
          <label className={labelCls}>Photo principale</label>
          {form.main_image_url && (
            <img src={form.main_image_url} alt="Principale" className="w-48 h-36 object-cover mb-3 border border-border" />
          )}
          <input ref={mainFileRef} type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) onMainUpload(file); }} />
          <button type="button" onClick={() => mainFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary">
            <Upload size={14} /> {form.main_image_url ? "Remplacer" : "Téléverser"}
          </button>
          <input value={form.main_image_url} onChange={(e) => onChange("main_image_url", e.target.value)} placeholder="ou URL externe" className={`${inputCls} mt-3`} />
        </div>

        <div>
          <label className={labelCls}>Galerie</label>
          <input ref={galleryFileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) onGalleryUpload(e.target.files); }} />
          <button type="button" onClick={() => galleryFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary mb-4">
            <Upload size={14} /> Ajouter des photos
          </button>
          {form.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.gallery.map((galleryItem, index) => (
                <div key={`${galleryItem.url}-${index}`} className="relative group">
                  <img src={galleryItem.url} alt={galleryItem.alt ?? ""} className="w-full aspect-[4/3] object-cover border border-border" />
                  <input
                    value={galleryItem.alt ?? ""}
                    onChange={(e) => {
                      const next = [...form.gallery];
                      next[index] = { ...next[index], alt: e.target.value };
                      onChange("gallery", next);
                    }}
                    placeholder="Texte alt SEO"
                    className="w-full mt-1 text-xs bg-background border border-border px-2 py-1"
                  />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button type="button" onClick={() => onPromoteToMain(index)} title="Définir comme principale" className="bg-background/90 p-1 border border-border">
                      {form.main_image_url === galleryItem.url ? <Star size={14} className="text-primary fill-current" /> : <StarOff size={14} />}
                    </button>
                    <button type="button" onClick={() => onRemoveGalleryItem(index)} title="Supprimer" className="bg-background/90 p-1 border border-border text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Vidéos</h2>
        <p className="font-body text-xs text-muted-foreground -mt-2">
          Trois supports vidéo complémentaires : lien YouTube/Vimeo (lecteur dans la galerie), fichier MP4 hébergé, et vidéo de fond (drone) en haut de la fiche.
        </p>

        <div>
          <label className={labelCls}>Lien YouTube ou Vimeo</label>
          <input value={form.video_url} onChange={(e) => onChange("video_url", e.target.value)} placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..." className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Affichée comme vignette « Vidéo » dans la galerie de la fiche.</p>
        </div>

        <div>
          <label className={labelCls}>Vidéo MP4 (upload direct)</label>
          {form.video_file_url && (
            <video src={form.video_file_url} controls className="w-72 mb-3 border border-border" />
          )}
          <input ref={videoFileRef} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) onVideoUpload(file, "main"); }} />
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={videoUploading === "main"} onClick={() => videoFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary disabled:opacity-50">
              <Upload size={14} /> {videoUploading === "main" ? "Envoi..." : form.video_file_url ? "Remplacer" : "Téléverser"}
            </button>
            {form.video_file_url && (
              <button type="button" onClick={() => onChange("video_file_url", "")} className="font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border text-destructive hover:border-destructive">
                Retirer
              </button>
            )}
          </div>
          <input value={form.video_file_url} onChange={(e) => onChange("video_file_url", e.target.value)} placeholder="ou URL externe MP4" className={`${inputCls} mt-3`} />
          <p className="text-xs text-muted-foreground mt-1">Format conseillé : MP4 H.264, &lt; 50 Mo. Compressez avec HandBrake si besoin.</p>
        </div>

        <div>
          <label className={labelCls}>Vidéo de fond (drone / aérienne)</label>
          {form.hero_video_url && (
            <video src={form.hero_video_url} muted loop autoPlay playsInline className="w-72 mb-3 border border-border" />
          )}
          <input ref={heroVideoFileRef} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) onVideoUpload(file, "hero"); }} />
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={videoUploading === "hero"} onClick={() => heroVideoFileRef.current?.click()} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary disabled:opacity-50">
              <Upload size={14} /> {videoUploading === "hero" ? "Envoi..." : form.hero_video_url ? "Remplacer" : "Téléverser"}
            </button>
            {form.hero_video_url && (
              <button type="button" onClick={() => onChange("hero_video_url", "")} className="font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border text-destructive hover:border-destructive">
                Retirer
              </button>
            )}
          </div>
          <input value={form.hero_video_url} onChange={(e) => onChange("hero_video_url", e.target.value)} placeholder="ou URL externe MP4" className={`${inputCls} mt-3`} />
          <p className="text-xs text-muted-foreground mt-1">Diffusée en boucle, muette, au-dessus de la galerie. Format conseillé : MP4 16:9, 8-15 s, &lt; 15 Mo.</p>
        </div>

        <div>
          <label className={labelCls}>Vidéo secondaire (YouTube / Vimeo / MP4)</label>
          <input value={form.video_url_2} onChange={(e) => onChange("video_url_2", e.target.value)} placeholder="https://..." className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Deuxième vidéo (ex. intérieur + extérieur). Affichée dans la section « Découvrir le bien autrement ».</p>
        </div>

        <div>
          <label className={labelCls}>Vidéo drone / aérienne (lecteur)</label>
          <input value={form.drone_video_url} onChange={(e) => onChange("drone_video_url", e.target.value)} placeholder="https://... ou URL MP4" className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Affichée comme carte dédiée « Vue aérienne ». Distincte de la vidéo de fond.</p>
        </div>

        <label className={`${checkCls} pt-2`}>
          <input type="checkbox" checked={form.show_video} onChange={(e) => onChange("show_video", e.target.checked)} className="accent-primary" />
          Afficher la section vidéo sur la fiche publique
        </label>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Visite virtuelle</h2>
        <p className="font-body text-xs text-muted-foreground -mt-2">
          Trois options possibles. Renseignez celle qui correspond à votre prestataire — la fiche utilisera la première disponible.
        </p>

        <div>
          <label className={labelCls}>ID Matterport</label>
          <input value={form.matterport_id} onChange={(e) => onChange("matterport_id", e.target.value)} placeholder="SxQL3iGnMqk" className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Identifiant trouvé dans l'URL Matterport : <code>my.matterport.com/show/?m=<strong>ID</strong></code></p>
        </div>

        <div>
          <label className={labelCls}>Lien visite virtuelle (Kuula, 360°, autre)</label>
          <input value={form.virtual_tour_url} onChange={(e) => onChange("virtual_tour_url", e.target.value)} placeholder="https://kuula.co/share/..." className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Pour ouvrir la visite dans un nouvel onglet si l'intégration iframe n'est pas possible.</p>
        </div>

        <div>
          <label className={labelCls}>Code iframe brut (avancé)</label>
          <textarea
            rows={3}
            value={form.virtual_tour_iframe}
            onChange={(e) => onChange("virtual_tour_iframe", e.target.value)}
            placeholder='<iframe src="..." allowfullscreen></iframe>'
            className={`${inputCls} font-mono text-xs`}
          />
          <p className="text-xs text-muted-foreground mt-1">A utiliser uniquement avec un prestataire de confiance. L'iframe sera intégré tel quel (sandbox sécurisée).</p>
        </div>

        <label className={`${checkCls} pt-2`}>
          <input type="checkbox" checked={form.show_virtual_tour} onChange={(e) => onChange("show_virtual_tour", e.target.checked)} className="accent-primary" />
          Afficher la visite virtuelle sur la fiche publique
        </label>
      </section>
    </>
  );
}
