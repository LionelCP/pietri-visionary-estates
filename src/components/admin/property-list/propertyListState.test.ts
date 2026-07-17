import { describe, expect, it } from "vitest";
import type { Property } from "@/lib/properties";
import { applyPropertyListState, filterProperties, getPropertyStatusCounts, sortProperties } from "./propertyListState";

const properties = [
  makeProperty({
    id: "1",
    slug: "villa-ajaccio",
    title_fr: "Villa Alba",
    title_en: "Alba villa",
    city: "Ajaccio",
    country: "France",
    sector: "Route des Sanguinaires",
    publication_status: "draft",
    price_amount: 900000,
    created_at: "2026-01-03T00:00:00.000Z",
  }),
  makeProperty({
    id: "2",
    slug: "maison-bastia",
    title_fr: "Maison Brava",
    title_en: "Brava house",
    city: "Bastia",
    country: "France",
    sector: "Citadelle",
    publication_status: "published",
    price_amount: 1200000,
    created_at: "2026-01-02T00:00:00.000Z",
  }),
  makeProperty({
    id: "3",
    slug: "penthouse-monaco",
    title_fr: "Penthouse Céleste",
    title_en: "Celestial penthouse",
    city: "Monaco",
    country: "Monaco",
    sector: "Carré d'Or",
    publication_status: "archived",
    price_amount: null,
    created_at: "2026-01-01T00:00:00.000Z",
  }),
];

describe("property list state", () => {
  it("searches case-insensitively across titles, city, country, address-like sector and slug", () => {
    expect(filterProperties(properties, "alba", "all").map((p) => p.id)).toEqual(["1"]);
    expect(filterProperties(properties, "BASTIA", "all").map((p) => p.id)).toEqual(["2"]);
    expect(filterProperties(properties, "monaco", "all").map((p) => p.id)).toEqual(["3"]);
    expect(filterProperties(properties, "sanguinaires", "all").map((p) => p.id)).toEqual(["1"]);
    expect(filterProperties(properties, "penthouse-monaco", "all").map((p) => p.id)).toEqual(["3"]);
  });

  it("filters by publication status", () => {
    expect(filterProperties(properties, "", "draft").map((p) => p.id)).toEqual(["1"]);
    expect(filterProperties(properties, "", "published").map((p) => p.id)).toEqual(["2"]);
    expect(filterProperties(properties, "", "archived").map((p) => p.id)).toEqual(["3"]);
  });

  it("sorts alphabetically without mutating the source", () => {
    const source = [properties[1], properties[2], properties[0]];

    expect(sortProperties(source, "title-asc").map((p) => p.id)).toEqual(["2", "3", "1"]);
    expect(sortProperties(source, "title-desc").map((p) => p.id)).toEqual(["1", "3", "2"]);
    expect(source.map((p) => p.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts by price with missing prices last", () => {
    expect(sortProperties(properties, "price-asc").map((p) => p.id)).toEqual(["1", "2", "3"]);
    expect(sortProperties(properties, "price-desc").map((p) => p.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts by date and combines filter/search/sort state", () => {
    expect(sortProperties(properties, "newest").map((p) => p.id)).toEqual(["1", "2", "3"]);
    expect(sortProperties(properties, "oldest").map((p) => p.id)).toEqual(["3", "2", "1"]);
    expect(applyPropertyListState(properties, { query: "france", status: "all", sort: "price-desc" }).map((p) => p.id)).toEqual(["2", "1"]);
  });

  it("counts properties by status", () => {
    expect(getPropertyStatusCounts(properties)).toEqual({ all: 3, draft: 1, published: 1, archived: 1 });
  });
});

function makeProperty(overrides: Partial<Property>): Property {
  return {
    id: "property-id",
    slug: "property-slug",
    title: "Legacy title",
    status: "disponible",
    publication_status: "draft",
    reference: null,
    title_fr: "Titre",
    title_en: null,
    description_fr: null,
    description_en: null,
    property_type: "villa",
    region: "corse",
    country: "France",
    transaction_type: "sale",
    city: "Ajaccio",
    sector: null,
    price_amount: null,
    price_display: null,
    price_on_request: false,
    currency: "EUR",
    area_m2: null,
    land_area_m2: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    floor: null,
    has_terrace: false,
    has_garden: false,
    has_balcony: false,
    has_sea_view: false,
    has_mountain_view: false,
    has_open_view: false,
    short_description: null,
    long_description: null,
    short_description_en: null,
    long_description_en: null,
    highlights: [],
    amenities: [],
    energy_class: null,
    main_image_url: null,
    gallery: [],
    plan_pdf_url: null,
    internal_ref: null,
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
    seo_title: null,
    seo_description: null,
    seo_title_fr: null,
    seo_title_en: null,
    seo_description_fr: null,
    seo_description_en: null,
    created_by: null,
    updated_by: null,
    published_at: null,
    archived_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
