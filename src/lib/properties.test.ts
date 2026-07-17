import { describe, expect, it } from "vitest";
import {
  buildPropertyCreatePayload,
  buildPropertyUpdatePayload,
  formatPrice,
  getPropertyAmenities,
  getPropertyDescription,
  getPropertyTitle,
  isPublicProperty,
  legacyStatusToPublicationStatus,
  mapPropertyRow,
  validatePublicationFields,
  type Property,
  type PropertySaveValues,
} from "./properties";

const formValues: PropertySaveValues = {
  slug: "villa-test",
  publication_status: "published",
  reference: "PVE-001",
  title: "Villa test",
  title_fr: "Villa test",
  title_en: "Test villa",
  description_fr: "Description FR",
  description_en: "Description EN",
  short_description: "Courte",
  long_description: "Longue",
  short_description_en: "Short",
  long_description_en: "Long",
  price_amount: "1200000",
  price_display: "",
  price_on_request: false,
  currency: "EUR",
  city: "Ajaccio",
  region: "corse",
  country: "France",
  sector: "",
  property_type: "villa",
  transaction_type: "sale",
  area_m2: "180",
  land_area_m2: "900",
  rooms: "6",
  bedrooms: "4",
  bathrooms: "3",
  floor: "",
  amenities: "Piscine\nVue mer",
  has_terrace: true,
  has_garden: true,
  has_balcony: false,
  has_sea_view: true,
  has_mountain_view: false,
  has_open_view: false,
  energy_class: "B",
  main_image_url: "",
  gallery: [],
  plan_pdf_url: "",
  internal_ref: "PVE-001",
  featured: true,
  coup_de_coeur: false,
  display_order: "10",
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
  seo_title_fr: "SEO FR",
  seo_title_en: "SEO EN",
  seo_description_fr: "SEO description FR",
  seo_description_en: "SEO description EN",
  seo_title: "SEO FR",
  seo_description: "SEO description FR",
};

describe("property core V1 helpers", () => {
  it("maps legacy statuses without exposing hidden properties", () => {
    expect(legacyStatusToPublicationStatus("masque")).toBe("draft");
    expect(legacyStatusToPublicationStatus("disponible")).toBe("published");
    expect(legacyStatusToPublicationStatus("sous_offre")).toBe("published");
    expect(legacyStatusToPublicationStatus("reserve")).toBe("published");
    expect(legacyStatusToPublicationStatus("vendu")).toBe("published");
  });

  it("keeps draft and archived properties out of public views", () => {
    expect(isPublicProperty({ publication_status: "published", status: "disponible" })).toBe(true);
    expect(isPublicProperty({ publication_status: "draft", status: "disponible" })).toBe(false);
    expect(isPublicProperty({ publication_status: "archived", status: "disponible" })).toBe(false);
    expect(isPublicProperty({ publication_status: "published", status: "masque" })).toBe(false);
  });

  it("uses V1 fields before legacy fallbacks", () => {
    const property = {
      title: "Legacy title",
      title_fr: "Titre V1",
      title_en: null,
      description_fr: "Description V1",
      description_en: null,
      long_description: "Legacy description",
      short_description: null,
    } as Property;

    expect(getPropertyTitle(property, "fr")).toBe("Titre V1");
    expect(getPropertyTitle(property, "en")).toBe("Titre V1");
    expect(getPropertyDescription(property, "fr")).toBe("Description V1");
    expect(getPropertyDescription(property, "en")).toBe("Description V1");
  });

  it("normalizes FR/EN fields from legacy rows", () => {
    const property = mapPropertyRow({
      id: "property-id",
      slug: "villa-test",
      title: "Legacy title",
      status: "disponible",
      property_type: "villa",
      region: "corse",
      city: "Ajaccio",
      sector: null,
      price_amount: 1200000,
      price_display: null,
      price_on_request: false,
      area_m2: 180,
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
      short_description: "Legacy short",
      long_description: "Legacy long",
      short_description_en: null,
      long_description_en: null,
      highlights: ["Vue mer"],
      energy_class: null,
      main_image_url: null,
      gallery: null,
      plan_pdf_url: null,
      internal_ref: "PVE-001",
      featured: false,
      coup_de_coeur: false,
      display_order: 0,
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
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(property.publication_status).toBe("published");
    expect(property.title_fr).toBe("Legacy title");
    expect(property.title_en).toBe("Legacy title");
    expect(property.description_fr).toBe("Legacy long");
    expect(property.description_en).toBeNull();
    expect(property.reference).toBe("PVE-001");
    expect(property.country).toBe("France");
    expect(property.currency).toBe("EUR");
    expect(getPropertyAmenities(property)).toEqual(["Vue mer"]);
  });

  it("formats price on request and explicit currencies", () => {
    expect(formatPrice({ price_display: null, price_amount: 1200000, price_on_request: false, currency: "USD" }, "en")).toBe("$1,200,000");
    expect(formatPrice({ price_display: null, price_amount: 1200000, price_on_request: true, currency: "EUR" }, "fr")).toBe("Prix sur demande");
  });

  it("validates publication-required fields", () => {
    const valid = {
      reference: "PVE-001",
      internal_ref: null,
      slug: "villa-test",
      title_fr: "Villa test",
      title: "Villa test",
      description_fr: "Description",
      long_description: null,
      short_description: null,
      city: "Ajaccio",
      region: "corse",
      country: "France",
      property_type: "villa",
      transaction_type: "sale",
      price_amount: null,
      price_on_request: true,
      currency: "EUR",
    } as const;

    expect(validatePublicationFields(valid)).toEqual([]);
    expect(validatePublicationFields({ ...valid, reference: null, internal_ref: null, price_on_request: false })).toEqual([
      "La référence est obligatoire.",
      "Le prix est obligatoire, sauf si prix sur demande.",
    ]);
  });

  it("sets draft only when creating a property", () => {
    expect(buildPropertyCreatePayload(formValues, "villa-test").publication_status).toBe("draft");
  });

  it("builds create payloads with normalized V1 fields", () => {
    const payload = buildPropertyCreatePayload(formValues, "villa-test");

    expect(payload).toMatchObject({
      slug: "villa-test",
      publication_status: "draft",
      title_fr: "Villa test",
      title_en: "Test villa",
      description_fr: "Longue",
      description_en: "Long",
      currency: "EUR",
      country: "France",
      transaction_type: "sale",
      land_area_m2: 900,
      amenities: ["Piscine", "Vue mer"],
    });
  });

  it.each(["draft", "published", "archived"] as const)("does not send editorial status fields when updating a %s property", (status) => {
    const payload = buildPropertyUpdatePayload({ ...formValues, publication_status: status }, "villa-test");

    expect(payload).not.toHaveProperty("publication_status");
    expect(payload).not.toHaveProperty("published_at");
    expect(payload).not.toHaveProperty("archived_at");
  });

  it("builds update payloads without editorial status fields", () => {
    const payload = buildPropertyUpdatePayload(formValues, "villa-test");

    expect(payload).toMatchObject({
      slug: "villa-test",
      title_fr: "Villa test",
      title_en: "Test villa",
      seo_title_fr: "SEO FR",
      seo_title_en: "SEO EN",
      seo_description_fr: "SEO description FR",
      seo_description_en: "SEO description EN",
    });
    expect(payload).not.toHaveProperty("publication_status");
    expect(payload).not.toHaveProperty("published_at");
    expect(payload).not.toHaveProperty("archived_at");
  });
});
