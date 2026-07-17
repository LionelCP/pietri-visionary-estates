import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createProperty,
  fetchPropertyBySlug,
  fetchPublicProperties,
  updateProperty,
  type PropertySaveValues,
} from "./properties";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: mocks.from,
  },
}));

const propertyRow = {
  id: "property-id",
  slug: "villa-test",
  title: "Villa test",
  status: "disponible",
  publication_status: "published",
  property_type: "villa",
  region: "corse",
  city: "Ajaccio",
  sector: null,
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
  long_description: "Longue",
  short_description_en: null,
  long_description_en: null,
  highlights: ["Vue mer"],
  amenities: ["Piscine"],
  energy_class: null,
  main_image_url: null,
  gallery: [],
  plan_pdf_url: null,
  internal_ref: "PVE-001",
  reference: "PVE-001",
  featured: true,
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
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

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

function createListReadQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    neq: vi.fn(() => Promise.resolve(result)),
  };
  return query;
}

function createSingleReadQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    neq: vi.fn(() => query),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
  };
  return query;
}

function createWriteQuery(result: unknown) {
  const query = {
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
    select: vi.fn(() => query),
    single: vi.fn(() => Promise.resolve(result)),
  };
  return query;
}

describe("property services", () => {
  beforeEach(() => {
    mocks.from.mockReset();
  });

  it("keeps public reads filtered to published properties", async () => {
    const query = createListReadQuery({ data: [propertyRow], error: null });
    mocks.from.mockReturnValue(query);

    const result = await fetchPublicProperties();

    expect(mocks.from).toHaveBeenCalledWith("properties");
    expect(query.select).toHaveBeenCalledWith("*");
    expect(query.eq).toHaveBeenCalledWith("publication_status", "published");
    expect(query.neq).toHaveBeenCalledWith("status", "masque");
    expect(result).toHaveLength(1);
    expect(result[0].publication_status).toBe("published");
  });

  it("keeps slug reads filtered to published properties", async () => {
    const query = createSingleReadQuery({ data: propertyRow, error: null });
    mocks.from.mockReturnValue(query);

    const result = await fetchPropertyBySlug("villa-test");

    expect(query.eq).toHaveBeenCalledWith("slug", "villa-test");
    expect(query.eq).toHaveBeenCalledWith("publication_status", "published");
    expect(query.neq).toHaveBeenCalledWith("status", "masque");
    expect(result?.slug).toBe("villa-test");
  });

  it("throws Supabase read errors unchanged", async () => {
    const error = { message: "Read failed" };
    const query = createListReadQuery({ data: null, error });
    mocks.from.mockReturnValue(query);

    await expect(fetchPublicProperties()).rejects.toBe(error);
  });

  it("creates properties with a draft payload", async () => {
    const query = createWriteQuery({ data: { id: "new-id" }, error: null });
    mocks.from.mockReturnValue(query);

    await expect(createProperty(formValues, "villa-test")).resolves.toEqual({ id: "new-id" });

    const payload = query.insert.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.publication_status).toBe("draft");
    expect(payload).not.toHaveProperty("published_at");
    expect(payload).not.toHaveProperty("archived_at");
  });

  it("updates properties without editorial system fields", async () => {
    const query = createWriteQuery({ data: { id: "property-id" }, error: null });
    mocks.from.mockReturnValue(query);

    await expect(updateProperty("property-id", formValues, "villa-test")).resolves.toEqual({ id: "property-id" });

    expect(query.eq).toHaveBeenCalledWith("id", "property-id");
    const payload = query.update.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).not.toHaveProperty("publication_status");
    expect(payload).not.toHaveProperty("published_at");
    expect(payload).not.toHaveProperty("archived_at");
  });
});
