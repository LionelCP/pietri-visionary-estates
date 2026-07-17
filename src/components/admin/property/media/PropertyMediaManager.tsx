import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2, Upload } from "lucide-react";
import type { GalleryImage } from "@/lib/properties";
import { toast } from "@/hooks/use-toast";
import { appendUniqueGalleryImages, moveGalleryImage, removeGalleryImage, removeMainImageWithFallback, setMainImageFromGallery } from "./propertyMediaOrdering";
import { PROPERTY_IMAGE_ACCEPTED_TYPES, validatePropertyImages } from "./propertyMediaValidation";

type UploadStatus = "local" | "uploading" | "done" | "error";

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  error?: string;
};

type PropertyMediaManagerProps = {
  mainImageUrl: string;
  gallery: GalleryImage[];
  onMainImageChange: (url: string) => void;
  onGalleryChange: (gallery: GalleryImage[]) => void;
  uploadImage: (file: File) => Promise<string | null>;
};

export function PropertyMediaManager({
  mainImageUrl,
  gallery,
  onMainImageChange,
  onGalleryChange,
  uploadImage,
}: PropertyMediaManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const uploading = pendingImages.some((image) => image.status === "uploading");

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => {
      mountedRef.current = false;
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      previewUrls.clear();
    };
  }, []);

  const handleFiles = async (files: File[]) => {
    const { valid, errors } = validatePropertyImages(files);
    errors.forEach((error) => toast({ title: "Image ignorée", description: error.message, variant: "destructive" }));
    if (valid.length === 0) return;

    const pending = valid.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      return {
        id: crypto.randomUUID(),
        file,
        previewUrl,
        status: "local" as const,
      };
    });

    if (!mountedRef.current) return;
    setPendingImages((current) => [...current, ...pending]);

    const uploaded: GalleryImage[] = [];
    for (const image of pending) {
      if (!mountedRef.current) return;
      setPendingImages((current) => updatePendingStatus(current, image.id, "uploading"));
      try {
        const url = await uploadImage(image.file);
        if (!url) throw new Error("Upload échoué");
        uploaded.push({ url, alt: "" });
        if (!mountedRef.current) return;
        setPendingImages((current) => updatePendingStatus(current, image.id, "done"));
      } catch (error) {
        if (!mountedRef.current) return;
        setPendingImages((current) => updatePendingStatus(current, image.id, "error", getErrorMessage(error)));
      }
    }

    if (!mountedRef.current) return;
    if (uploaded.length === 0) return;

    const [firstUploaded, ...remaining] = uploaded;
    if (!mainImageUrl && firstUploaded) {
      onMainImageChange(firstUploaded.url);
      onGalleryChange(appendUniqueGalleryImages(gallery, remaining, [firstUploaded.url]));
      return;
    }
    onGalleryChange(appendUniqueGalleryImages(gallery, uploaded, [mainImageUrl]));
  };

  const removePendingImage = (id: string) => {
    setPendingImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
        previewUrlsRef.current.delete(image.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const removeMainImage = () => {
    if (mainImageUrl && !window.confirm("Retirer l'image principale de ce bien ?")) return;
    const next = removeMainImageWithFallback(gallery);
    onMainImageChange(next.mainImageUrl);
    onGalleryChange(next.gallery);
  };

  const removeGalleryItem = (index: number) => {
    if (!window.confirm("Retirer cette image de la galerie ?")) return;
    onGalleryChange(removeGalleryImage(gallery, index));
  };

  const promoteGalleryItem = (index: number) => {
    const next = setMainImageFromGallery(mainImageUrl, gallery, index);
    onMainImageChange(next.mainImageUrl);
    onGalleryChange(next.gallery);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    onGalleryChange(moveGalleryImage(gallery, fromIndex, toIndex));
  };

  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-foreground border-b border-border pb-3">Photos</h2>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(Array.from(event.dataTransfer.files));
        }}
        className="border border-dashed border-border p-6 text-center bg-secondary/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          aria-label="Sélectionner des images"
          accept={PROPERTY_IMAGE_ACCEPTED_TYPES.join(",")}
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files?.length) void handleFiles(Array.from(event.target.files));
            event.currentTarget.value = "";
          }}
        />
        <ImagePlus size={24} className="mx-auto mb-3 text-primary" />
        <p className="font-display text-xl text-foreground">Ajouter des photos</p>
        <p className="font-body text-xs text-muted-foreground mt-2">Glissez-déposez des images ou sélectionnez plusieurs fichiers JPEG, PNG ou WebP. 10 Mo maximum par fichier.</p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase px-4 py-2.5 border border-border hover:border-primary mt-4 disabled:opacity-50"
        >
          <Upload size={14} /> {uploading ? "Envoi..." : "Sélectionner"}
        </button>
      </div>

      {pendingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pendingImages.map((image) => (
            <div key={image.id} className="border border-border p-2">
              <img src={image.previewUrl} alt="" className="w-full aspect-[4/3] object-cover bg-secondary" />
              <p className="font-body text-xs text-foreground mt-2 truncate">{image.file.name}</p>
              <p className="font-body text-[11px] text-muted-foreground">{getStatusLabel(image.status)}</p>
              {image.error && <p className="font-body text-[11px] text-destructive mt-1">{image.error}</p>}
              {(image.status === "done" || image.status === "error") && (
                <button type="button" onClick={() => removePendingImage(image.id)} className="font-body text-[11px] tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground mt-2">
                  Retirer l'aperçu
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Image principale</label>
          <span className="font-body text-xs text-muted-foreground">{gallery.length + (mainImageUrl ? 1 : 0)} image(s)</span>
        </div>
        {mainImageUrl ? (
          <div className="relative max-w-sm border border-primary/40 p-2">
            <img src={mainImageUrl} alt="Image principale" className="w-full aspect-[4/3] object-cover" />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-background/90 border border-primary/40 px-2 py-1 font-body text-[10px] uppercase tracking-[0.16em] text-primary">
              <Star size={12} className="fill-current" /> Image principale
            </span>
            <button type="button" onClick={removeMainImage} className="mt-3 inline-flex items-center gap-1 font-body text-[11px] tracking-[0.16em] uppercase text-destructive hover:underline">
              <Trash2 size={13} /> Retirer
            </button>
          </div>
        ) : (
          <div className="border border-border p-5 text-sm text-muted-foreground">Aucune image principale définie.</div>
        )}
        <input value={mainImageUrl} onChange={(event) => onMainImageChange(event.target.value)} placeholder="ou URL externe" className="w-full bg-background border border-border px-3 py-2.5 font-body text-sm text-foreground focus:border-primary outline-none mt-3" />
      </div>

      <div>
        <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-3">Galerie</label>
        {gallery.length === 0 ? (
          <div className="border border-border p-5 text-sm text-muted-foreground">Aucune image secondaire.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((galleryItem, index) => (
              <div
                key={`${galleryItem.url}-${index}`}
                draggable
                onDragStart={() => setDraggingIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingIndex !== null) moveImage(draggingIndex, index);
                  setDraggingIndex(null);
                }}
                className="relative group border border-border p-2 bg-background"
              >
                <img src={galleryItem.url} alt={galleryItem.alt ?? ""} className="w-full aspect-[4/3] object-cover border border-border" />
                <input
                  value={galleryItem.alt ?? ""}
                  onChange={(event) => {
                    const next = [...gallery];
                    next[index] = { ...next[index], alt: event.target.value };
                    onGalleryChange(next);
                  }}
                  placeholder="Texte alt SEO"
                  className="w-full mt-2 text-xs bg-background border border-border px-2 py-1"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  <button type="button" onClick={() => promoteGalleryItem(index)} className="font-body text-[10px] tracking-[0.12em] uppercase px-2 py-1 border border-border hover:border-primary">
                    Définir principale
                  </button>
                  <button type="button" disabled={index === 0} onClick={() => moveImage(index, index - 1)} className="p-1 border border-border disabled:opacity-40" aria-label="Monter l'image">
                    <ArrowUp size={13} />
                  </button>
                  <button type="button" disabled={index === gallery.length - 1} onClick={() => moveImage(index, index + 1)} className="p-1 border border-border disabled:opacity-40" aria-label="Descendre l'image">
                    <ArrowDown size={13} />
                  </button>
                  <button type="button" onClick={() => removeGalleryItem(index)} className="p-1 border border-border text-destructive" aria-label="Supprimer l'image">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function updatePendingStatus(images: PendingImage[], id: string, status: UploadStatus, error?: string) {
  return images.map((image) => image.id === id ? { ...image, status, error } : image);
}

function getStatusLabel(status: UploadStatus) {
  if (status === "uploading") return "En cours";
  if (status === "done") return "Terminé";
  if (status === "error") return "Erreur";
  return "Local";
}

function getErrorMessage(error: unknown) {
  return error && typeof error === "object" && "message" in error ? String(error.message) : "Upload échoué";
}
