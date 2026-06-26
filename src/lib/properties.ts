import { supabase } from "@/integrations/supabase/client";

export type PropertyStatus = "disponible" | "sous_offre" | "vendu" | "reserve" | "masque";
export type PropertyType = "appartement" | "maison" | "villa" | "terrain" | "local_commercial" | "programme" | "autre";
export type PropertyRegion = "corse" | "continent" | "monaco" | "bali" | "autre";

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  property_type: PropertyType | null;
  region: PropertyRegion | null;
  city: string | null;
  sector: string | null;
  price_amount: number | null;
  price_display: string | null;
  price_on_request: boolean;
  area_m2: number | null;
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
  created_at: string;
  updated_at: string;
}

const STATUS_RANK: Record<PropertyStatus, number> = {
  disponible: 0,
  sous_offre: 1,
  reserve: 2,
  vendu: 3,
  masque: 9,
};

function mapRow(row: Record<string, unknown>): Property {
  return {
    ...row,
    gallery: Array.isArray(row.gallery) ? (row.gallery as GalleryImage[]) : [],
    highlights: Array.isArray(row.highlights) ? (row.highlights as string[]) : [],
  } as Property;
}

export function sortForPublic(list: Property[]): Property[] {
  return [...list].sort((a, b) => {
    const sa = STATUS_RANK[a.status] ?? 99;
    const sb = STATUS_RANK[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return (a.created_at < b.created_at ? 1 : -1);
  });
}

export async function fetchPublicProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .neq("status", "masque");
  if (error) throw error;
  return sortForPublic((data ?? []).map(mapRow));
}

export async function fetchFeaturedProperties(limit = 4): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .neq("status", "masque")
    .order("display_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
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

export function formatPrice(p: Pick<Property, "price_display" | "price_amount" | "price_on_request">, lang: "fr" | "en"): string {
  if (p.price_on_request) return lang === "fr" ? "Prix sur demande" : "Price on request";
  if (p.price_display) return p.price_display;
  if (p.price_amount != null) {
    const fmt = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: "EUR",
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
