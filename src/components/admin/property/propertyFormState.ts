import type {
  GalleryImage,
  Property,
  PropertyRegion,
  PropertySaveValues,
  PropertyType,
  PublicationStatus,
  TransactionType,
} from "@/lib/properties";

export type PropertyFormState = PropertySaveValues & {
  highlights: string;
  property_type: PropertyType | "";
  region: PropertyRegion | "";
  transaction_type: TransactionType | "";
};

export type PropertyFormSet = <K extends keyof PropertyFormState>(key: K, value: PropertyFormState[K]) => void;

export const emptyPropertyFormState: PropertyFormState = {
  slug: "",
  publication_status: "draft",
  reference: "",
  title: "",
  title_fr: "",
  title_en: "",
  description_fr: "",
  description_en: "",
  short_description: "",
  long_description: "",
  short_description_en: "",
  long_description_en: "",
  price_amount: "",
  price_display: "",
  price_on_request: false,
  currency: "EUR",
  city: "",
  region: "",
  country: "France",
  sector: "",
  property_type: "",
  transaction_type: "sale",
  area_m2: "",
  land_area_m2: "",
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
  amenities: "",
  highlights: "",
  has_terrace: false,
  has_garden: false,
  has_balcony: false,
  has_sea_view: false,
  has_mountain_view: false,
  has_open_view: false,
  energy_class: "",
  main_image_url: "",
  gallery: [],
  plan_pdf_url: "",
  internal_ref: "",
  featured: false,
  coup_de_coeur: false,
  display_order: "0",
  matterport_id: "",
  video_url: "",
  video_url_2: "",
  video_file_url: "",
  hero_video_url: "",
  drone_video_url: "",
  virtual_tour_url: "",
  virtual_tour_iframe: "",
  show_video: true,
  show_virtual_tour: true,
  seo_title: "",
  seo_description: "",
  seo_title_fr: "",
  seo_title_en: "",
  seo_description_fr: "",
  seo_description_en: "",
};

export function slugifyProperty(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPublicationStatus(status: PublicationStatus) {
  if (status === "published") return "Publié";
  if (status === "archived") return "Archivé";
  return "Brouillon";
}

export function propertyToFormState(property: Property): PropertyFormState {
  const amenities = listToText(property.amenities.length > 0 ? property.amenities : property.highlights);
  const title = property.title_fr ?? property.title;
  const descriptionFr = property.description_fr ?? property.long_description ?? "";
  const descriptionEn = property.description_en ?? property.long_description_en ?? "";
  const reference = property.reference ?? property.internal_ref ?? "";

  return {
    slug: property.slug,
    publication_status: property.publication_status ?? "draft",
    reference,
    title,
    title_fr: title,
    title_en: property.title_en ?? "",
    description_fr: descriptionFr,
    description_en: descriptionEn,
    property_type: property.property_type ?? "",
    region: property.region ?? "",
    country: property.country ?? "France",
    transaction_type: property.transaction_type ?? "",
    city: property.city ?? "",
    sector: property.sector ?? "",
    price_amount: property.price_amount?.toString() ?? "",
    price_display: property.price_display ?? "",
    price_on_request: property.price_on_request,
    currency: property.currency ?? "EUR",
    area_m2: property.area_m2?.toString() ?? "",
    land_area_m2: property.land_area_m2?.toString() ?? "",
    rooms: property.rooms?.toString() ?? "",
    bedrooms: property.bedrooms?.toString() ?? "",
    bathrooms: property.bathrooms?.toString() ?? "",
    floor: property.floor ?? "",
    has_terrace: property.has_terrace,
    has_garden: property.has_garden,
    has_balcony: property.has_balcony,
    has_sea_view: property.has_sea_view,
    has_mountain_view: property.has_mountain_view,
    has_open_view: property.has_open_view,
    short_description: property.short_description ?? "",
    long_description: descriptionFr,
    short_description_en: property.short_description_en ?? "",
    long_description_en: descriptionEn,
    amenities,
    highlights: amenities,
    energy_class: property.energy_class ?? "",
    main_image_url: property.main_image_url ?? "",
    gallery: normalizeGallery(property.gallery),
    plan_pdf_url: property.plan_pdf_url ?? "",
    internal_ref: reference,
    featured: property.featured,
    coup_de_coeur: property.coup_de_coeur,
    display_order: property.display_order.toString(),
    matterport_id: property.matterport_id ?? "",
    video_url: property.video_url ?? "",
    video_url_2: property.video_url_2 ?? "",
    video_file_url: property.video_file_url ?? "",
    hero_video_url: property.hero_video_url ?? "",
    drone_video_url: property.drone_video_url ?? "",
    virtual_tour_url: property.virtual_tour_url ?? "",
    virtual_tour_iframe: property.virtual_tour_iframe ?? "",
    show_video: property.show_video ?? true,
    show_virtual_tour: property.show_virtual_tour ?? true,
    seo_title: property.seo_title_fr ?? property.seo_title ?? "",
    seo_description: property.seo_description_fr ?? property.seo_description ?? "",
    seo_title_fr: property.seo_title_fr ?? property.seo_title ?? "",
    seo_title_en: property.seo_title_en ?? "",
    seo_description_fr: property.seo_description_fr ?? property.seo_description ?? "",
    seo_description_en: property.seo_description_en ?? "",
  };
}

export function syncFormAliases(form: PropertyFormState): PropertyFormState {
  return {
    ...form,
    reference: form.internal_ref,
    title_fr: form.title,
    description_fr: form.long_description || form.short_description,
    description_en: form.long_description_en || form.short_description_en,
    amenities: form.highlights,
    seo_title_fr: form.seo_title,
    seo_description_fr: form.seo_description,
  };
}

function listToText(values: string[]) {
  return values.join("\n");
}

function normalizeGallery(gallery: GalleryImage[] | null | undefined) {
  return Array.isArray(gallery) ? gallery : [];
}
