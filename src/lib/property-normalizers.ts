import type { Property, PropertyRegion, PropertyStatus, PublicationStatus, GalleryImage } from "@/types/property";

const PUBLICATION_RANK: Record<PublicationStatus, number> = {
  published: 0,
  draft: 8,
  archived: 9,
};

export function mapPropertyRow(row: Record<string, unknown>): Property {
  const status = (row.status as PropertyStatus | undefined) ?? "masque";
  const publicationStatus = (row.publication_status as PublicationStatus | undefined) ?? legacyStatusToPublicationStatus(status);
  const title = stringOrNull(row.title);
  const titleFr = stringOrNull(row.title_fr) ?? title;
  const titleEn = stringOrNull(row.title_en) ?? titleFr;
  const descriptionFr = stringOrNull(row.description_fr) ?? stringOrNull(row.long_description) ?? stringOrNull(row.short_description);
  const descriptionEn = stringOrNull(row.description_en) ?? stringOrNull(row.long_description_en) ?? stringOrNull(row.short_description_en);

  return {
    ...row,
    status,
    publication_status: publicationStatus,
    reference: stringOrNull(row.reference) ?? stringOrNull(row.internal_ref),
    title: titleFr ?? "",
    title_fr: titleFr,
    title_en: titleEn,
    description_fr: descriptionFr,
    description_en: descriptionEn,
    country: stringOrNull(row.country) ?? "France",
    currency: stringOrNull(row.currency) ?? "EUR",
    land_area_m2: numberOrNull(row.land_area_m2),
    amenities: textArray(row.amenities, row.highlights),
    seo_title_fr: stringOrNull(row.seo_title_fr) ?? stringOrNull(row.seo_title),
    seo_title_en: stringOrNull(row.seo_title_en) ?? stringOrNull(row.seo_title),
    seo_description_fr: stringOrNull(row.seo_description_fr) ?? stringOrNull(row.seo_description),
    seo_description_en: stringOrNull(row.seo_description_en) ?? stringOrNull(row.seo_description),
    created_by: stringOrNull(row.created_by),
    updated_by: stringOrNull(row.updated_by),
    published_at: stringOrNull(row.published_at),
    archived_at: stringOrNull(row.archived_at),
    gallery: Array.isArray(row.gallery) ? (row.gallery as GalleryImage[]) : [],
    highlights: textArray(row.highlights),
  } as Property;
}

export function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function numberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

export function textArray(value: unknown, fallback?: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (Array.isArray(fallback)) return fallback.filter((item): item is string => typeof item === "string");
  return [];
}

export function legacyStatusToPublicationStatus(status: PropertyStatus): PublicationStatus {
  return status === "masque" ? "draft" : "published";
}

export function isPublicProperty(property: Pick<Property, "publication_status" | "status">): boolean {
  return property.publication_status === "published" && property.status !== "masque";
}

export function sortForPublic(list: Property[]): Property[] {
  return [...list].sort((a, b) => {
    const sa = PUBLICATION_RANK[a.publication_status] ?? 99;
    const sb = PUBLICATION_RANK[b.publication_status] ?? 99;
    if (sa !== sb) return sa - sb;
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return (a.created_at < b.created_at ? 1 : -1);
  });
}

export function getPropertyTitle(p: Property, lang: "fr" | "en"): string {
  return (lang === "fr" ? p.title_fr : p.title_en) || p.title_fr || p.title;
}

export function getPropertyDescription(p: Property, lang: "fr" | "en"): string | null {
  return (lang === "fr" ? p.description_fr : p.description_en) || p.description_fr || p.long_description || p.short_description;
}

export function getPropertySeoTitle(p: Property, lang: "fr" | "en"): string | null {
  return (lang === "fr" ? p.seo_title_fr : p.seo_title_en) || p.seo_title_fr || p.seo_title;
}

export function getPropertySeoDescription(p: Property, lang: "fr" | "en"): string | null {
  return (lang === "fr" ? p.seo_description_fr : p.seo_description_en) || p.seo_description_fr || p.seo_description;
}

export function getPropertyReference(p: Property): string | null {
  return p.reference || p.internal_ref;
}

export function getPropertyAmenities(p: Property): string[] {
  return p.amenities.length > 0 ? p.amenities : p.highlights;
}

export function formatPrice(p: Pick<Property, "price_display" | "price_amount" | "price_on_request"> & Partial<Pick<Property, "currency">>, lang: "fr" | "en"): string {
  if (p.price_on_request) return lang === "fr" ? "Prix sur demande" : "Price on request";
  if (p.price_display) return p.price_display;
  if (p.price_amount != null) {
    const fmt = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: p.currency || "EUR",
      maximumFractionDigits: 0,
    });
    return fmt.format(p.price_amount);
  }
  return lang === "fr" ? "Prix sur demande" : "Price on request";
}

export function formatLocation(p: Pick<Property, "city" | "sector" | "region">): string {
  const parts = [p.sector, p.city].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (p.region) {
    const labels: Record<PropertyRegion, string> = {
      corse: "Corse",
      continent: "France continentale",
      monaco: "Monaco",
      bali: "Bali",
      autre: "",
    };
    return labels[p.region];
  }
  return "";
}
