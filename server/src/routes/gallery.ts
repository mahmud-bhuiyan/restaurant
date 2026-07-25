import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  GalleryError,
  createGalleryImage,
  deleteGalleryImage,
  formatGalleryImage,
  getGalleryImages,
  reorderGalleryImages,
  updateGalleryImage,
} from "../services/galleryService.js";

const router = Router();

function handleError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof GalleryError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(fallback, err);
  res.status(500).json({ message: fallback });
}

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit
      ? Number.parseInt(req.query.limit as string, 10)
      : undefined;
    const images = await getGalleryImages(limit);
    res.json({ images: images.map((i) => formatGalleryImage(i)) });
  } catch (err) {
    handleError(res, err, "Failed to fetch gallery");
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const image = await createGalleryImage(req.body);
    res.status(201).json({ image: formatGalleryImage(image) });
  } catch (err) {
    handleError(res, err, "Failed to create gallery image");
  }
});

router.patch("/reorder", authenticate, requireAdmin, async (req, res) => {
  try {
    const images = await reorderGalleryImages(req.body.orderedIds);
    res.json({ images: images.map((i) => formatGalleryImage(i)) });
  } catch (err) {
    handleError(res, err, "Failed to reorder gallery");
  }
});

router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const image = await updateGalleryImage(req.params.id, req.body);
    res.json({ image: formatGalleryImage(image) });
  } catch (err) {
    handleError(res, err, "Failed to update gallery image");
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await deleteGalleryImage(req.params.id);
    res.json({ message: "Gallery image deleted" });
  } catch (err) {
    handleError(res, err, "Failed to delete gallery image");
  }
});

export default router;
