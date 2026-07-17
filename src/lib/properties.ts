import { supabase } from "@/integrations/supabase/client";

export type PropertyStatus = "disponible" | "sous_offre" | "vendu" | "reserve" | "masque";
export type PublicationStatus = "draft" | "published" | "archived";
export type PropertyType = "appartement" | "maison" | "villa" | "terrain" | "local_commercial" | "programme" | "autre";
export type PropertyRegion = "corse" | "continent" | "monaco" | "bali" | "autre";
export type TransactionType = "sale" | "rent" | "seasonal_rent";
export type RpcResult<T = Property> = { data: T | null; error: string | null };

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  publication_status: PublicationStatus;
  reference: string | null;
  title_fr: string | null;
  title_en: string | null;
  description_fr: string | null;
  description_en: string | null;
  property_type: PropertyType | null;
  region: PropertyRegion | null;
  country: string | null;
  transaction_type: TransactionType | null;
  city: string | null;
  sector: string | null;
  price_amount: number | null;
  price_display: string | null;
  price_on_request: boolean;
  currency: string;
  area_m2: number | null;
  land_area_m2: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string | null;
  has_terrace: boolean;
  has_garden: boolean;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_mountain_view: boolean;
  has_open_view: boolean;
  short_description: string | null;
  long_description: string | null;
  short_description_en: string | null;
  long_description_en: string | null;
  highlights: string[];
  amenities: string[];
  energy_class: string | null;
  main_image_url: string | null;
  gallery: GalleryImage[];
  plan_pdf_url: string | null;
  internal_ref: string | null;
  featured: boolean;
  coup_de_coeur: boolean;
  display_order: number;
  matterport_id: string | null;
  video_url: string | null;
  video_url_2: string | null;
  video_file_url: string | null;
  hero_video_url: string | null;
  drone_video_url: string | null;
  virtual_tour_url: string | null;
  virtual_tour_iframe: string | null;
  show_video: boolean;
  show_virtual_tour: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_title_fr: string | null;
  seo_title_en: string | null;
  seo_description_fr: string | null;
  seo_description_en: string | null;
  created_by: string | null;
  updated_by: string | null;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormValues {
  slug: string;
  publication_status: PublicationStatus;
  reference: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  price_amount: string;
  price_on_request: boolean;
  currency: string;
  city: string;
  region: PropertyRegion | "";
  country: string;
  property_type: PropertyType | "";
  transaction_type: TransactionType | "";
  area_m2: string;
  land_area_m2: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string;
  seo_title_fr: string;
  seo_title_en: string;
  seo_description_fr: string;
  seo_description_en: string;
  featured: boolean;
  display_order: string;
}

export type PropertySaveValues = PropertyFormValues & {
  title: string;
  short_description: string;
  long_description: string;
  short_description_en: string;
  long_description_en: string;
  price_display: string;
  rooms: string;
  floor: string;
  sector: string;
  has_terrace: boolean;
  has_garden: boolean;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_mountain_view: boolean;
  has_open_view: boolean;
  energy_class: string;
  main_image_url: string;
  gallery: GalleryImage[];
  plan_pdf_url: string;
  internal_ref: string;
  coup_de_coeur: boolean;
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
};

export type PropertySavePayload = ReturnType<typeof buildPropertyUpdatePayload>;
export type PropertyCreatePayload = PropertySavePayload & { publication_status: "draft" };

export type PropertyPublicView = Pick<
  Property,
  | "id"
  | "slug"
  | "publication_status"
  | "property_type"
  | "region"
  | "country"
  | "city"
  | "price_amount"
  | "price_on_request"
  | "currency"
  | "area_m2"
  | "land_area_m2"
  | "bedrooms"
  | "bathrooms"
  | "featured"
  | "display_order"
  | "main_image_url"
  | "gallery"
>;

const PUBLICATION_RANK: Record<PublicationStatus, number> = {
  published: 0,
  draft: 8,
  archived: 9,
};

function mapRow(row: Record<string, unknown>): Property {
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

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function textArray(value: unknown, fallback?: unknown): string[] {
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

export async function fetchPublicProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("publication_status", "published")
    .neq("status", "masque");
  if (error) throw error;
  return sortForPublic((data ?? []).map(mapRow).filter(isPublicProperty));
}

export async function fetchFeaturedProperties(limit = 4): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .eq("publication_status", "published")
    .neq("status", "masque")
    .order("display_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapRow).filter(isPublicProperty);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("publication_status", "published")
    .neq("status", "masque")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function fetchAllProperties(): Promise<Property[]> {
  // Admin only — RLS lets admins read everything (including 'masque')
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function publishProperty(id: string): Promise<RpcResult> {
  return propertyRpc("publish_property", id);
}

export async function unpublishProperty(id: string): Promise<RpcResult> {
  return propertyRpc("unpublish_property", id);
}

export async function archiveProperty(id: string): Promise<RpcResult> {
  return propertyRpc("archive_property", id);
}

async function propertyRpc(fn: "publish_property" | "unpublish_property" | "archive_property", id: string): Promise<RpcResult> {
  const { data, error } = await supabase.rpc(fn, { property_id: id } as never);
  return { data: data ? mapRow(data as Record<string, unknown>) : null, error: error?.message ?? null };
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

export function validatePublicationFields(p: Pick<Property, "reference" | "internal_ref" | "slug" | "title_fr" | "title" | "description_fr" | "long_description" | "short_description" | "city" | "region" | "country" | "property_type" | "transaction_type" | "price_amount" | "price_on_request" | "currency">): string[] {
  const errors: string[] = [];
  if (!(p.reference || p.internal_ref)) errors.push("La référence est obligatoire.");
  if (!p.slug) errors.push("Le slug est obligatoire.");
  if (!(p.title_fr || p.title)) errors.push("Le titre FR est obligatoire.");
  if (!(p.description_fr || p.long_description || p.short_description)) errors.push("La description FR est obligatoire.");
  if (!p.city) errors.push("La ville est obligatoire.");
  if (!p.region) errors.push("La région est obligatoire.");
  if (!p.country) errors.push("Le pays est obligatoire.");
  if (!p.property_type) errors.push("Le type de bien est obligatoire.");
  if (!p.transaction_type) errors.push("Le type de transaction est obligatoire.");
  if (!p.currency) errors.push("La devise est obligatoire.");
  if (!p.price_on_request && p.price_amount == null) errors.push("Le prix est obligatoire, sauf si prix sur demande.");
  return errors;
}

export function buildPropertyUpdatePayload(f: PropertySaveValues, slug: string) {
  const amenities = f.amenities.split("\n").map((h) => h.trim()).filter(Boolean);
  return {
    slug,
    title: f.title.trim(),
    reference: f.internal_ref.trim() || null,
    title_fr: f.title.trim(),
    title_en: f.title_en.trim() || null,
    property_type: f.property_type || null,
    region: f.region || null,
    country: f.country.trim() || "France",
    transaction_type: f.transaction_type || null,
    city: f.city.trim() || null,
    sector: f.sector.trim() || null,
    price_amount: f.price_amount ? Number(f.price_amount) : null,
    price_display: f.price_display.trim() || null,
    price_on_request: f.price_on_request,
    currency: f.currency.trim() || "EUR",
    area_m2: f.area_m2 ? Number(f.area_m2) : null,
    land_area_m2: f.land_area_m2 ? Number(f.land_area_m2) : null,
    rooms: f.rooms ? Number(f.rooms) : null,
    bedrooms: f.bedrooms ? Number(f.bedrooms) : null,
    bathrooms: f.bathrooms ? Number(f.bathrooms) : null,
    floor: f.floor.trim() || null,
    has_terrace: f.has_terrace,
    has_garden: f.has_garden,
    has_balcony: f.has_balcony,
    has_sea_view: f.has_sea_view,
    has_mountain_view: f.has_mountain_view,
    has_open_view: f.has_open_view,
    short_description: f.short_description.trim() || null,
    long_description: f.long_description.trim() || null,
    description_fr: f.long_description.trim() || f.short_description.trim() || null,
    short_description_en: f.short_description_en.trim() || null,
    long_description_en: f.long_description_en.trim() || null,
    description_en: f.long_description_en.trim() || f.short_description_en.trim() || null,
    highlights: amenities,
    amenities,
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
    seo_title_fr: f.seo_title.trim() || null,
    seo_title_en: f.seo_title_en.trim() || null,
    seo_description_fr: f.seo_description.trim() || null,
    seo_description_en: f.seo_description_en.trim() || null,
  };
}

export function buildPropertyCreatePayload(f: PropertySaveValues, slug: string): PropertyCreatePayload {
  return { ...buildPropertyUpdatePayload(f, slug), publication_status: "draft" };
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
