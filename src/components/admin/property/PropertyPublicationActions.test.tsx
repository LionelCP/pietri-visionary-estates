import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { PropertyPublicationActions } from "./PropertyPublicationActions";
import type { Property } from "@/lib/properties";

const mocks = vi.hoisted(() => ({
  archiveProperty: vi.fn(),
  publishProperty: vi.fn(),
  toast: vi.fn(),
  unpublishProperty: vi.fn(),
  validatePropertyForPublication: vi.fn(),
}));

vi.mock("@/lib/properties", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/properties")>()),
  archiveProperty: mocks.archiveProperty,
  publishProperty: mocks.publishProperty,
  unpublishProperty: mocks.unpublishProperty,
  validatePropertyForPublication: mocks.validatePropertyForPublication,
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: mocks.toast,
}));

const property = {
  id: "property-id",
  slug: "villa-test",
  title: "Villa test",
  status: "disponible",
  publication_status: "published",
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} as Property;

describe("PropertyPublicationActions", () => {
  beforeEach(() => {
    mocks.archiveProperty.mockReset();
    mocks.publishProperty.mockReset();
    mocks.toast.mockReset();
    mocks.unpublishProperty.mockReset();
    mocks.validatePropertyForPublication.mockReset();
  });

  it("validates before publishing and then calls the publish RPC wrapper", async () => {
    const onStatusChanged = vi.fn();
    mocks.validatePropertyForPublication.mockResolvedValue({ data: [], error: null });
    mocks.publishProperty.mockResolvedValue({ data: property, error: null });

    render(<PropertyPublicationActions propertyId="property-id" status="draft" onStatusChanged={onStatusChanged} />);
    fireEvent.click(screen.getByRole("button", { name: "Publier" }));

    await waitFor(() => expect(mocks.publishProperty).toHaveBeenCalledWith("property-id"));
    expect(mocks.validatePropertyForPublication).toHaveBeenCalledWith("property-id");
    expect(onStatusChanged).toHaveBeenCalledWith(property);
  });

  it("does not publish when validation returns blocking errors", async () => {
    mocks.validatePropertyForPublication.mockResolvedValue({ data: ["La référence est obligatoire."], error: null });

    render(<PropertyPublicationActions propertyId="property-id" status="draft" onStatusChanged={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Publier" }));

    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Publication impossible" })));
    expect(mocks.publishProperty).not.toHaveBeenCalled();
  });

  it("keeps unpublish and archive as distinct actions", async () => {
    const onStatusChanged = vi.fn();
    mocks.unpublishProperty.mockResolvedValue({ data: { ...property, publication_status: "draft" }, error: null });
    mocks.archiveProperty.mockResolvedValue({ data: { ...property, publication_status: "archived" }, error: null });

    render(<PropertyPublicationActions propertyId="property-id" status="published" onStatusChanged={onStatusChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "Dépublier" }));
    await waitFor(() => expect(mocks.unpublishProperty).toHaveBeenCalledWith("property-id"));

    fireEvent.click(screen.getByRole("button", { name: "Archiver" }));
    await waitFor(() => expect(mocks.archiveProperty).toHaveBeenCalledWith("property-id"));
  });

  it("does not offer publication actions for archived properties", () => {
    render(<PropertyPublicationActions propertyId="property-id" status="archived" onStatusChanged={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Publier" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Archiver" })).not.toBeInTheDocument();
    expect(screen.getByText("Archivé")).toBeInTheDocument();
  });
});
