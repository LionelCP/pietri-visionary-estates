import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminBienEdit from "./AdminBienEdit";
import type { Property } from "@/lib/properties";

const mocks = vi.hoisted(() => ({
  createProperty: vi.fn(),
  fetchPropertyById: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  updateProperty: vi.fn(),
  params: {} as { id?: string },
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => mocks.navigate,
  useParams: () => mocks.params,
}));

vi.mock("@/lib/properties", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/properties")>()),
  createProperty: mocks.createProperty,
  fetchPropertyById: mocks.fetchPropertyById,
  updateProperty: mocks.updateProperty,
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: mocks.toast,
}));

vi.mock("@/components/admin/property/propertyMediaUpload", () => ({
  uploadPropertyFile: vi.fn(),
}));

const property = {
  id: "property-id",
  slug: "villa-test",
  title: "Legacy title",
  status: "disponible",
  publication_status: "published",
  reference: "PVE-001",
  title_fr: "Villa test",
  title_en: "Test villa",
  description_fr: "Description FR",
  description_en: "Description EN",
  property_type: "villa",
  region: "corse",
  country: "France",
  transaction_type: "sale",
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
  long_description: "Legacy longue",
  short_description_en: "Short",
  long_description_en: "Legacy long",
  highlights: ["Vue mer"],
  amenities: ["Piscine"],
  energy_class: null,
  main_image_url: null,
  gallery: [],
  plan_pdf_url: null,
  internal_ref: null,
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
  created_by: null,
  updated_by: null,
  published_at: "2026-01-01T00:00:00.000Z",
  archived_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} satisfies Property;

describe("AdminBienEdit", () => {
  beforeEach(() => {
    mocks.createProperty.mockReset();
    mocks.fetchPropertyById.mockReset();
    mocks.navigate.mockReset();
    mocks.toast.mockReset();
    mocks.updateProperty.mockReset();
    mocks.params = {};
  });

  it("uses createProperty in creation mode", async () => {
    mocks.createProperty.mockResolvedValue({ id: "new-id" });
    render(<AdminBienEdit />);

    fillRequiredTitle("Villa neuve");
    fireEvent.click(screen.getByRole("button", { name: "Créer le bien" }));

    await waitFor(() => expect(mocks.createProperty).toHaveBeenCalled());
    expect(mocks.fetchPropertyById).not.toHaveBeenCalled();
    expect(mocks.createProperty.mock.calls[0][1]).toBe("villa-neuve");
    expect(mocks.navigate).toHaveBeenCalledWith("/admin/biens");
  });

  it("loads the existing property in edit mode with fetchPropertyById", async () => {
    mocks.params = { id: "property-id" };
    mocks.fetchPropertyById.mockResolvedValue(property);
    render(<AdminBienEdit />);

    await screen.findByDisplayValue("Villa test");

    expect(mocks.fetchPropertyById).toHaveBeenCalledWith("property-id");
    expect(screen.getByDisplayValue("PVE-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Publié")).toBeInTheDocument();
  });

  it("uses updateProperty in edit mode without calling createProperty", async () => {
    mocks.params = { id: "property-id" };
    mocks.fetchPropertyById.mockResolvedValue(property);
    mocks.updateProperty.mockResolvedValue({ id: "property-id" });
    render(<AdminBienEdit />);

    await screen.findByDisplayValue("Villa test");
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(mocks.updateProperty).toHaveBeenCalledWith("property-id", expect.any(Object), "villa-test"));
    expect(mocks.createProperty).not.toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith("/admin/biens");
  });

  it("disables compatible publication actions while a save is running", async () => {
    mocks.params = { id: "property-id" };
    mocks.fetchPropertyById.mockResolvedValue(property);
    mocks.updateProperty.mockReturnValue(new Promise(() => {}));
    render(<AdminBienEdit />);

    await screen.findByDisplayValue("Villa test");
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Dépublier" })).toBeDisabled());
    expect(screen.getByRole("button", { name: "Archiver" })).toBeDisabled();
  });
});

function fillRequiredTitle(value: string) {
  const titleInput = document.querySelector("input[required]");
  if (!(titleInput instanceof HTMLInputElement)) throw new Error("Title input not found");
  fireEvent.change(titleInput, { target: { value } });
}
