import { describe, expect, it } from "vitest";
import type { Property } from "@/lib/properties";
import { emptyPropertyFormState, propertyToFormState, slugifyProperty, syncFormAliases } from "./propertyFormState";

const baseProperty = {
  id: "property-id",
  slug: "villa-test",
  title: "Legacy title",
  status: "disponible",
  publication_status: "published",
  reference: "PVE-001",
  title_fr: "Titre FR",
  title_en: "Title EN",
  description_fr: "Description FR",
  description_en: "Description EN",
  property_type: "villa",
  region: "corse",
  country: "France",
  transaction_type: "sale",
  city: "Ajaccio",
  sector: "Centre",
  price_amount: 1200000,
  price_display: null,
  price_on_request: false,
  currency: "EUR",
  area_m2: 180,
  land_area_m2: 900,
  rooms: 6,
  bedrooms: 4,
  bathrooms: 3,
  floor: null,
  has_terrace: true,
  has_garden: true,
  has_balcony: false,
  has_sea_view: true,
  has_mountain_view: false,
  has_open_view: false,
  short_description: "Courte",
  long_description: "Legacy longue",
  short_description_en: "Short",
  long_description_en: "Legacy long",
  highlights: ["Vue mer"],
  amenities: ["Piscine", "Garage"],
  energy_class: "B",
  main_image_url: "https://example.test/main.jpg",
  gallery: [{ url: "https://example.test/gallery.jpg", alt: "Galerie" }],
  plan_pdf_url: null,
  internal_ref: "OLD-001",
  featured: true,
  coup_de_coeur: false,
  display_order: 10,
  matterport_id: null,
  video_url: null,
  video_url_2: null,
  video_file_url: null,
  hero_video_url: null,
  drone_video_url: null,
  virtual_tour_url: null,
  virtual_tour_iframe: null,
  show_video: true,
  show_virtual_tour: true,
  seo_title: "Legacy SEO",
  seo_description: "Legacy SEO description",
  seo_title_fr: "SEO FR",
  seo_title_en: "SEO EN",
  seo_description_fr: "SEO description FR",
  seo_description_en: "SEO description EN",
  created_by: null,
  updated_by: null,
  published_at: null,
  archived_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} satisfies Property;

describe("admin property form state", () => {
  it("maps V1 fields to the editor form without losing publication status", () => {
    const form = propertyToFormState(baseProperty);

    expect(form.publication_status).toBe("published");
    expect(form.title).toBe("Titre FR");
    expect(form.long_description).toBe("Description FR");
    expect(form.long_description_en).toBe("Description EN");
    expect(form.internal_ref).toBe("PVE-001");
    expect(form.highlights).toBe("Piscine\nGarage");
    expect(form.gallery).toEqual([{ url: "https://example.test/gallery.jpg", alt: "Galerie" }]);
  });

  it("keeps legacy fallbacks for older rows", () => {
    const form = propertyToFormState({
      ...baseProperty,
      publication_status: "draft",
      reference: null,
      title_fr: null,
      description_fr: null,
      description_en: null,
      amenities: [],
    });

    expect(form.publication_status).toBe("draft");
    expect(form.title).toBe("Legacy title");
    expect(form.long_description).toBe("Legacy longue");
    expect(form.long_description_en).toBe("Legacy long");
    expect(form.internal_ref).toBe("OLD-001");
    expect(form.highlights).toBe("Vue mer");
  });

  it("syncs editor aliases expected by payload builders before saving", () => {
    const form = syncFormAliases({
      ...emptyPropertyFormState,
      title: "Villa neuve",
      short_description: "Courte",
      long_description: "Longue",
      short_description_en: "Short",
      long_description_en: "Long",
      internal_ref: "PVE-002",
      highlights: "Piscine\nVue mer",
      seo_title: "SEO FR",
      seo_description: "Description SEO FR",
    });

    expect(form.reference).toBe("PVE-002");
    expect(form.title_fr).toBe("Villa neuve");
    expect(form.description_fr).toBe("Longue");
    expect(form.description_en).toBe("Long");
    expect(form.amenities).toBe("Piscine\nVue mer");
    expect(form.seo_title_fr).toBe("SEO FR");
    expect(form.seo_description_fr).toBe("Description SEO FR");
  });

  it("slugifies property titles consistently with the previous editor behaviour", () => {
    expect(slugifyProperty("Villa d'été à L'Île-Rousse")).toBe("villa-d-ete-a-l-ile-rousse");
  });
});
