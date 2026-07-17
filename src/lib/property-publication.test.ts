import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  archiveProperty,
  publishProperty,
  unpublishProperty,
  validatePropertyForPublication,
} from "./properties";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: mocks.rpc,
  },
}));

const propertyRow = {
  id: "property-id",
  slug: "villa-test",
  title: "Villa test",
  status: "disponible",
  publication_status: "published",
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("property publication RPC wrappers", () => {
  beforeEach(() => {
    mocks.rpc.mockReset();
  });

  it("calls publish_property with the expected arguments", async () => {
    mocks.rpc.mockResolvedValue({ data: propertyRow, error: null });

    const result = await publishProperty("property-id");

    expect(mocks.rpc).toHaveBeenCalledWith("publish_property", { property_id: "property-id" });
    expect(result.error).toBeNull();
    expect(result.data?.publication_status).toBe("published");
  });

  it("calls unpublish_property with the expected arguments", async () => {
    mocks.rpc.mockResolvedValue({ data: { ...propertyRow, publication_status: "draft" }, error: null });

    const result = await unpublishProperty("property-id");

    expect(mocks.rpc).toHaveBeenCalledWith("unpublish_property", { property_id: "property-id" });
    expect(result.data?.publication_status).toBe("draft");
  });

  it("calls archive_property with the expected arguments", async () => {
    mocks.rpc.mockResolvedValue({ data: { ...propertyRow, publication_status: "archived" }, error: null });

    const result = await archiveProperty("property-id");

    expect(mocks.rpc).toHaveBeenCalledWith("archive_property", { property_id: "property-id" });
    expect(result.data?.publication_status).toBe("archived");
  });

  it("calls validate_property_for_publication with the expected arguments", async () => {
    mocks.rpc.mockResolvedValue({ data: ["La référence est obligatoire."], error: null });

    const result = await validatePropertyForPublication("property-id");

    expect(mocks.rpc).toHaveBeenCalledWith("validate_property_for_publication", { property_id: "property-id" });
    expect(result.data).toEqual(["La référence est obligatoire."]);
  });

  it("returns RPC errors without replacing their message", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { message: "Action impossible" } });

    const result = await publishProperty("property-id");

    expect(result).toEqual({ data: null, error: "Action impossible" });
  });
});
