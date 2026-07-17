import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PropertyMediaManager } from "./PropertyMediaManager";

const objectUrls: string[] = [];

describe("PropertyMediaManager", () => {
  beforeEach(() => {
    objectUrls.length = 0;
    URL.createObjectURL = vi.fn();
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
      const url = `blob:preview-${objectUrls.length + 1}`;
      objectUrls.push(url);
      return url;
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads multiple images, creates previews and keeps successful uploads after a partial failure", async () => {
    const uploadImage = vi
      .fn()
      .mockResolvedValueOnce("https://cdn.test/one.jpg")
      .mockRejectedValueOnce(new Error("Upload refused"));
    const onMainImageChange = vi.fn();
    const onGalleryChange = vi.fn();

    render(
      <PropertyMediaManager
        mainImageUrl=""
        gallery={[]}
        onMainImageChange={onMainImageChange}
        onGalleryChange={onGalleryChange}
        uploadImage={uploadImage}
      />,
    );

    fireEvent.change(screen.getByLabelText("Sélectionner des images"), {
      target: { files: [file("one.jpg", "image/jpeg"), file("two.png", "image/png")] },
    });

    expect(await screen.findByText("one.jpg")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();
    await waitFor(() => expect(uploadImage).toHaveBeenCalledTimes(2));
    expect(onMainImageChange).toHaveBeenCalledWith("https://cdn.test/one.jpg");
    expect(onGalleryChange).toHaveBeenCalledWith([]);
    expect(await screen.findByText("Upload refused")).toBeInTheDocument();
  });

  it("rejects invalid files and keeps the existing media state", async () => {
    const uploadImage = vi.fn();

    render(
      <PropertyMediaManager
        mainImageUrl="main.jpg"
        gallery={[]}
        onMainImageChange={vi.fn()}
        onGalleryChange={vi.fn()}
        uploadImage={uploadImage}
      />,
    );

    fireEvent.change(screen.getByLabelText("Sélectionner des images"), {
      target: { files: [file("bad.gif", "image/gif")] },
    });

    expect(uploadImage).not.toHaveBeenCalled();
  });

  it("promotes, reorders and removes remote gallery images", () => {
    const onMainImageChange = vi.fn();
    const onGalleryChange = vi.fn();

    render(
      <PropertyMediaManager
        mainImageUrl="main.jpg"
        gallery={[{ url: "one.jpg" }, { url: "two.jpg" }]}
        onMainImageChange={onMainImageChange}
        onGalleryChange={onGalleryChange}
        uploadImage={vi.fn()}
      />,
    );

    fireEvent.click(screen.getAllByText("Définir principale")[0]);
    expect(onMainImageChange).toHaveBeenCalledWith("one.jpg");
    expect(onGalleryChange).toHaveBeenCalledWith([{ url: "main.jpg", alt: undefined }, { url: "two.jpg" }]);

    fireEvent.click(screen.getAllByLabelText("Descendre l'image")[0]);
    expect(onGalleryChange).toHaveBeenCalledWith([{ url: "two.jpg" }, { url: "one.jpg" }]);

    fireEvent.click(screen.getAllByLabelText("Supprimer l'image")[0]);
    expect(window.confirm).toHaveBeenCalledWith("Retirer cette image de la galerie ?");
    expect(onGalleryChange).toHaveBeenCalledWith([{ url: "two.jpg" }]);
  });

  it("uses the first gallery image as fallback when removing the main image", () => {
    const onMainImageChange = vi.fn();
    const onGalleryChange = vi.fn();

    render(
      <PropertyMediaManager
        mainImageUrl="main.jpg"
        gallery={[{ url: "one.jpg" }, { url: "two.jpg" }]}
        onMainImageChange={onMainImageChange}
        onGalleryChange={onGalleryChange}
        uploadImage={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Retirer"));
    expect(window.confirm).toHaveBeenCalledWith("Retirer l'image principale de ce bien ?");
    expect(onMainImageChange).toHaveBeenCalledWith("one.jpg");
    expect(onGalleryChange).toHaveBeenCalledWith([{ url: "two.jpg" }]);
  });

  it("cleans local preview URLs when an uploaded preview is removed and on unmount", async () => {
    const uploadImage = vi.fn().mockResolvedValue("https://cdn.test/one.jpg");

    const { unmount } = render(
      <PropertyMediaManager
        mainImageUrl="main.jpg"
        gallery={[]}
        onMainImageChange={vi.fn()}
        onGalleryChange={vi.fn()}
        uploadImage={uploadImage}
      />,
    );

    fireEvent.change(screen.getByLabelText("Sélectionner des images"), {
      target: { files: [file("one.webp", "image/webp")] },
    });

    await screen.findByText("Retirer l'aperçu");
    fireEvent.click(screen.getByText("Retirer l'aperçu"));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-1");

    fireEvent.change(screen.getByLabelText("Sélectionner des images"), {
      target: { files: [file("two.jpg", "image/jpeg")] },
    });
    await screen.findByText("two.jpg");
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-2");
  });
});

function file(name: string, type: string, size = 10) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}
