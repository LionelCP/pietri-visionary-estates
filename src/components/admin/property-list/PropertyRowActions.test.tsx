import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Property } from "@/lib/properties";
import { PropertyRowActions } from "./PropertyRowActions";

const mocks = vi.hoisted(() => ({
  archiveProperty: vi.fn(),
  publishProperty: vi.fn(),
  toast: vi.fn(),
  unpublishProperty: vi.fn(),
}));

vi.mock("@/lib/properties", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/properties")>()),
  archiveProperty: mocks.archiveProperty,
  publishProperty: mocks.publishProperty,
  unpublishProperty: mocks.unpublishProperty,
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: mocks.toast,
}));

describe("PropertyRowActions", () => {
  beforeEach(() => {
    mocks.archiveProperty.mockReset();
    mocks.publishProperty.mockReset();
    mocks.toast.mockReset();
    mocks.unpublishProperty.mockReset();
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("shows the correct actions by publication status", () => {
    const { rerender } = renderWithRouter(<PropertyRowActions property={property("draft")} onChanged={vi.fn()} />);
    expect(screen.getByRole("link", { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archiver/i })).toBeInTheDocument();

    rerender(<MemoryRouter><PropertyRowActions property={property("published")} onChanged={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /dépublier/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir/i })).toBeInTheDocument();

    rerender(<MemoryRouter><PropertyRowActions property={property("archived")} onChanged={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /modifier/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /publier/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /archiver/i })).not.toBeInTheDocument();
  });

  it("calls the expected RPC wrappers", async () => {
    mocks.publishProperty.mockResolvedValue({ data: property("published"), error: null });
    mocks.unpublishProperty.mockResolvedValue({ data: property("draft"), error: null });
    mocks.archiveProperty.mockResolvedValue({ data: property("archived"), error: null });

    const { rerender } = renderWithRouter(<PropertyRowActions property={property("draft")} onChanged={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /publier/i }));
    await waitFor(() => expect(mocks.publishProperty).toHaveBeenCalledWith("property-id"));

    rerender(<MemoryRouter><PropertyRowActions property={property("published")} onChanged={vi.fn()} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /dépublier/i }));
    await waitFor(() => expect(mocks.unpublishProperty).toHaveBeenCalledWith("property-id"));

    fireEvent.click(screen.getByRole("button", { name: /archiver/i }));
    await waitFor(() => expect(mocks.archiveProperty).toHaveBeenCalledWith("property-id"));
  });

  it("disables actions during mutation and stops row navigation propagation", async () => {
    const parentClick = vi.fn();
    const onChanged = vi.fn();
    mocks.publishProperty.mockResolvedValue({ data: property("published"), error: null });

    renderWithRouter(
      <div onClick={parentClick}>
        <PropertyRowActions property={property("draft")} disabled onChanged={onChanged} />
      </div>,
    );

    expect(screen.getByRole("button", { name: /publier/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("link", { name: /modifier/i }));
    expect(parentClick).not.toHaveBeenCalled();
  });
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

function property(publicationStatus: Property["publication_status"]): Property {
  return {
    id: "property-id",
    slug: "villa-test",
    title: "Villa test",
    status: "disponible",
    publication_status: publicationStatus,
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
