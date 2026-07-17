import type { PropertySaveValues } from "@/types/property";

export type PropertySavePayload = ReturnType<typeof buildPropertyUpdatePayload>;
export type PropertyCreatePayload = PropertySavePayload & { publication_status: "draft" };

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
