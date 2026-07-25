import {
  GalleryImage,
  type GalleryImageDocument,
} from "../models/GalleryImage.js";

export class GalleryError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function formatGalleryImage(image: GalleryImageDocument) {
  return {
    id: image._id.toString(),
    imageUrl: image.imageUrl,
    caption: image.caption,
    sortOrder: image.sortOrder,
    createdAt: image.createdAt.toISOString(),
  };
}

export async function getGalleryImages(limit?: number) {
  const query = GalleryImage.find().sort({ sortOrder: 1, createdAt: 1 });
  if (limit) query.limit(limit);
  return query;
}

export async function createGalleryImage(input: {
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
}) {
  if (!input.imageUrl?.trim()) {
    throw new GalleryError("Image URL is required", 400);
  }

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined) {
    const last = await GalleryImage.findOne().sort({ sortOrder: -1 });
    sortOrder = last ? last.sortOrder + 1 : 0;
  }

  return GalleryImage.create({
    imageUrl: input.imageUrl.trim(),
    caption: input.caption?.trim() || "",
    sortOrder,
  });
}

export async function updateGalleryImage(
  id: string,
  input: { imageUrl?: string; caption?: string; sortOrder?: number },
) {
  const image = await GalleryImage.findById(id);
  if (!image) throw new GalleryError("Gallery image not found", 404);

  if (input.imageUrl !== undefined) {
    if (!input.imageUrl.trim()) throw new GalleryError("Image URL is required", 400);
    image.imageUrl = input.imageUrl.trim();
  }
  if (input.caption !== undefined) image.caption = input.caption.trim();
  if (input.sortOrder !== undefined) image.sortOrder = input.sortOrder;

  await image.save();
  return image;
}

export async function deleteGalleryImage(id: string) {
  const image = await GalleryImage.findByIdAndDelete(id);
  if (!image) throw new GalleryError("Gallery image not found", 404);
  return image;
}

export async function reorderGalleryImages(orderedIds: string[]) {
  if (!orderedIds?.length) {
    throw new GalleryError("orderedIds is required", 400);
  }

  const updates = orderedIds.map((id, index) =>
    GalleryImage.findByIdAndUpdate(id, { sortOrder: index }),
  );
  await Promise.all(updates);
  return getGalleryImages();
}
