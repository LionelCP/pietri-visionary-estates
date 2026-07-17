import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminBiensList from "./AdminBiensList";
import type { Property } from "@/lib/properties";

const mocks = vi.hoisted(() => ({
  fetchAllProperties: vi.fn(),
  signOut: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/lib/properties", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/properties")>()),
  fetchAllProperties: mocks.fetchAllProperties,
}));

vi.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ signOut: mocks.signOut }),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: mocks.toast,
}));

describe("AdminBiensList", () => {
  beforeEach(() => {
    mocks.fetchAllProperties.mockReset();
    mocks.signOut.mockReset();
    mocks.toast.mockReset();
  });

  it("loads the initial list through fetchAllProperties", async () => {
    mocks.fetchAllProperties.mockResolvedValue([property()]);

    renderWithRouter(<AdminBiensList />);

    await waitFor(() => expect(mocks.fetchAllProperties).toHaveBeenCalledTimes(1));
    expect(screen.getAllByText("Villa test")).toHaveLength(2);
    expect(screen.getAllByText("Publié")[0]).toBeInTheDocument();
  });

  it("shows an empty state after filtering", async () => {
    mocks.fetchAllProperties.mockResolvedValue([property()]);

    renderWithRouter(<AdminBiensList />);
    await waitFor(() => expect(screen.getAllByText("Villa test")).toHaveLength(2));

    fireEvent.change(screen.getByPlaceholderText("Titre, ville, pays, adresse, slug..."), { target: { value: "introuvable" } });

    expect(screen.getByText("Aucun bien ne correspond")).toBeInTheDocument();
  });
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

function property(): Property {
  return {
    id: "property-id",
    slug: "villa-test",
    title: "Villa test",
    status: "disponible",
    publication_status: "published",
    reference: "PVE-001",
    title_fr: "Villa test",
    title_en: null,
    description_fr: null,
    description_en: null,
    property_type: "villa",
    region: "corse",
    country: "France",
    transaction_type: "sale",
    city: "Ajaccio",
    sector: null,
    price_amount: 900000,
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
  };
}
