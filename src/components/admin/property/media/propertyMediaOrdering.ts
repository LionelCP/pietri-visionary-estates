import type { GalleryImage } from "@/lib/properties";

export function moveGalleryImage(gallery: GalleryImage[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || !gallery[fromIndex] || toIndex < 0 || toIndex >= gallery.length) return [...gallery];

  const next = [...gallery];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function removeGalleryImage(gallery: GalleryImage[], index: number) {
  return gallery.filter((_, currentIndex) => currentIndex !== index);
}

export function appendGalleryImages(gallery: GalleryImage[], images: GalleryImage[]) {
  return [...gallery, ...images];
}

export function appendUniqueGalleryImages(gallery: GalleryImage[], images: GalleryImage[], excludedUrls: string[] = []) {
  const seen = new Set([...gallery.map((image) => image.url), ...excludedUrls].filter(Boolean));
  const uniqueImages = images.filter((image) => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
  return appendGalleryImages(gallery, uniqueImages);
}

export function setMainImageFromGallery(mainImageUrl: string, gallery: GalleryImage[], index: number) {
  const selected = gallery[index];
  if (!selected) return { mainImageUrl, gallery: [...gallery] };

  const nextGallery = [...gallery];
  if (mainImageUrl) nextGallery[index] = { url: mainImageUrl, alt: selected.alt };
  else nextGallery.splice(index, 1);

  return {
    mainImageUrl: selected.url,
    gallery: nextGallery,
  };
}

export function removeMainImageWithFallback(gallery: GalleryImage[]) {
  const [fallback, ...remaining] = gallery;
  return {
    mainImageUrl: fallback?.url ?? "",
    gallery: remaining,
  };
}
