import { describe, expect, it } from "vitest";
import { PROPERTY_IMAGE_MAX_SIZE_BYTES, validatePropertyImage, validatePropertyImages } from "./propertyMediaValidation";

describe("property media validation", () => {
  it.each([
    ["image/jpeg", "photo.jpg"],
    ["image/png", "photo.png"],
    ["image/webp", "photo.webp"],
  ])("accepts %s files", (type, name) => {
    expect(validatePropertyImage(file(name, type))).toBeNull();
  });

  it("rejects unsupported formats", () => {
    expect(validatePropertyImage(file("photo.gif", "image/gif"))).toMatchObject({ reason: "invalid-type" });
  });

  it("rejects oversized files", () => {
    expect(validatePropertyImage(file("large.jpg", "image/jpeg", PROPERTY_IMAGE_MAX_SIZE_BYTES + 1))).toMatchObject({ reason: "too-large" });
  });

  it("deduplicates files within one selection", () => {
    const first = file("same.jpg", "image/jpeg", 10, 123);
    const duplicate = file("same.jpg", "image/jpeg", 10, 123);

    const result = validatePropertyImages([first, duplicate]);

    expect(result.valid).toEqual([first]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].reason).toBe("duplicate");
  });
});

function file(name: string, type: string, size = 10, lastModified = 1) {
  return new File([new Uint8Array(size)], name, { type, lastModified });
}
