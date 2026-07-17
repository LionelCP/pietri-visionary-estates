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
