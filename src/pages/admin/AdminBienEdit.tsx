import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createProperty, fetchPropertyById, updateProperty, type Property } from "@/lib/properties";
import { toast } from "@/hooks/use-toast";
import { PropertyFormContent } from "@/components/admin/property/PropertyFormContent";
import { PropertyFormDetails } from "@/components/admin/property/PropertyFormDetails";
import { PropertyFormIdentity } from "@/components/admin/property/PropertyFormIdentity";
import { PropertyFormMedia } from "@/components/admin/property/PropertyFormMedia";
import { PropertyFormSeo } from "@/components/admin/property/PropertyFormSeo";
import { PropertyPublicationActions } from "@/components/admin/property/PropertyPublicationActions";
import {
  emptyPropertyFormState,
  propertyToFormState,
  slugifyProperty,
  syncFormAliases,
  type PropertyFormSet,
  type PropertyFormState,
} from "@/components/admin/property/propertyFormState";
import { uploadPropertyFile } from "@/components/admin/property/propertyMediaUpload";

const AdminBienEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const nav = useNavigate();
  const [form, setForm] = useState<PropertyFormState>(emptyPropertyFormState);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const heroVideoFileRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState<"main" | "hero" | null>(null);

  useEffect(() => {
    if (isNew || !id) return;

    let active = true;

    fetchPropertyById(id)
      .then((property) => {
        if (!active) return;
        if (!property) {
          toast({ title: "Bien introuvable", variant: "destructive" });
          nav("/admin/biens");
          return;
        }
        setForm(propertyToFormState(property));
        setLoading(false);
      })
      .catch((error: { message?: string }) => {
        if (!active) return;
        toast({ title: "Bien introuvable", description: error.message, variant: "destructive" });
        nav("/admin/biens");
      });

    return () => {
      active = false;
    };
  }, [id, isNew, nav]);

  const set: PropertyFormSet = (key, value) => setForm((state) => ({ ...state, [key]: value }));

  const handleVideoUpload = async (file: File, kind: "main" | "hero") => {
    if (file.size > 80 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Limite indicative : 50 Mo. Compressez la vidéo (HandBrake, export web).",
        variant: "destructive",
      });
      return;
    }
    setVideoUploading(kind);
    const url = await uploadFile(file, "videos");
    setVideoUploading(null);
    if (!url) return;
    if (kind === "main") set("video_file_url", url);
    else set("hero_video_url", url);
  };

  const handleStatusChanged = (property: Property) => {
    setForm(propertyToFormState(property));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const values = syncFormAliases(form);
    const slug = values.slug.trim() || slugifyProperty(`${values.title}-${values.city}`);

    try {
      if (isNew) await createProperty(values, slug);
      else await updateProperty(id!, values, slug);

      toast({ title: isNew ? "Bien créé" : "Bien mis à jour" });
      nav("/admin/biens");
    } catch (error) {
      toast({ title: "Erreur", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File, folder = "uploads"): Promise<string | null> => {
    try {
      return await uploadPropertyFile(file, folder);
    } catch (error) {
      toast({ title: "Upload échoué", description: getErrorMessage(error), variant: "destructive" });
      return null;
    }
  };

  if (loading) return <main className="min-h-screen pt-32 px-6"><p className="text-muted-foreground">Chargement...</p></main>;

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => nav("/admin/biens")} className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="font-display text-4xl text-foreground mb-10">{isNew ? "Ajouter un bien" : "Modifier le bien"}</h1>

        <form onSubmit={submit} className="space-y-10">
          <PropertyFormIdentity form={form} onChange={set} />
          <PropertyFormDetails form={form} onChange={set} />
          <PropertyFormContent form={form} onChange={set} />
          <PropertyFormMedia
            form={form}
            onChange={set}
            videoFileRef={videoFileRef}
            heroVideoFileRef={heroVideoFileRef}
            videoUploading={videoUploading}
            onImageUpload={(file) => uploadFile(file, "gallery")}
            onVideoUpload={(file, kind) => void handleVideoUpload(file, kind)}
          />
          <PropertyFormSeo form={form} onChange={set} />
          <PropertyPublicationActions propertyId={id} status={form.publication_status} disabled={saving} onStatusChanged={handleStatusChanged} />

          <div className="flex gap-4 pt-4 border-t border-border">
            <button disabled={saving} type="submit" className="font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-gold-light transition-colors disabled:opacity-50">
              {saving ? "Enregistrement..." : isNew ? "Créer le bien" : "Enregistrer"}
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

function getErrorMessage(error: unknown) {
  return error && typeof error === "object" && "message" in error ? String(error.message) : "Une erreur est survenue.";
}

export default AdminBienEdit;
