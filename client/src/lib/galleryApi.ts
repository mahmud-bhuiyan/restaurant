import { api } from "./api";
import type { GalleryImage, GalleryImageInput } from "../types/gallery";

export function fetchGallery(limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return api<{ images: GalleryImage[] }>(`/gallery${query}`);
}

export function createGalleryImage(data: GalleryImageInput) {
  return api<{ image: GalleryImage }>("/gallery", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateGalleryImage(
  id: string,
  data: Partial<GalleryImageInput>,
) {
  return api<{ image: GalleryImage }>(`/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteGalleryImage(id: string) {
  return api<{ message: string }>(`/gallery/${id}`, { method: "DELETE" });
}

export function reorderGallery(orderedIds: string[]) {
  return api<{ images: GalleryImage[] }>("/gallery/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
}
