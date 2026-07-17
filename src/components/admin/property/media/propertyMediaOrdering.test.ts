import { describe, expect, it } from "vitest";
import type { GalleryImage } from "@/lib/properties";
import { appendUniqueGalleryImages, moveGalleryImage, removeGalleryImage, removeMainImageWithFallback, setMainImageFromGallery } from "./propertyMediaOrdering";

const gallery: GalleryImage[] = [
  { url: "one.jpg", alt: "One" },
  { url: "two.jpg", alt: "Two" },
  { url: "three.jpg", alt: "Three" },
];

describe("property media ordering", () => {
  it("reorders images without mutating the source", () => {
    expect(moveGalleryImage(gallery, 0, 2)).toEqual([gallery[1], gallery[2], gallery[0]]);
    expect(gallery.map((image) => image.url)).toEqual(["one.jpg", "two.jpg", "three.jpg"]);
  });

  it("removes images without mutating the source", () => {
    expect(removeGalleryImage(gallery, 1)).toEqual([gallery[0], gallery[2]]);
    expect(gallery).toHaveLength(3);
  });

  it("sets a gallery image as main and swaps the previous main into gallery", () => {
    expect(setMainImageFromGallery("main.jpg", gallery, 1)).toEqual({
      mainImageUrl: "two.jpg",
      gallery: [gallery[0], { url: "main.jpg", alt: "Two" }, gallery[2]],
    });
  });

  it("removes the promoted image from gallery when no main image exists", () => {
    expect(setMainImageFromGallery("", gallery, 0)).toEqual({
      mainImageUrl: "one.jpg",
      gallery: [gallery[1], gallery[2]],
    });
  });

  it("appends uploaded images without mutating the source", () => {
    expect(appendUniqueGalleryImages(gallery, [{ url: "four.jpg" }])).toEqual([...gallery, { url: "four.jpg" }]);
    expect(gallery).toHaveLength(3);
  });

  it("does not append duplicate URLs", () => {
    expect(appendUniqueGalleryImages(gallery, [{ url: "one.jpg" }, { url: "four.jpg" }], ["main.jpg"])).toEqual([...gallery, { url: "four.jpg" }]);
  });

  it("promotes the first gallery image as fallback when removing the main image", () => {
    expect(removeMainImageWithFallback(gallery)).toEqual({
      mainImageUrl: "one.jpg",
      gallery: [gallery[1], gallery[2]],
    });
  });
});
