import { Router } from "express";
import { authenticate, optionalAuth, requireAdmin } from "../middleware/auth.js";
import {
  TestimonialError,
  createTestimonial,
  deleteTestimonial,
  formatTestimonial,
  getAllTestimonials,
  getApprovedTestimonials,
  updateTestimonialStatus,
} from "../services/testimonialService.js";
import { TestimonialStatus } from "../types/testimonial.js";
import { getRouteParam } from "../utils/routeParams.js";

const router = Router();

function handleError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof TestimonialError) {
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
    const testimonials = await getApprovedTestimonials(limit);
    res.json({
      testimonials: testimonials.map((t) => formatTestimonial(t)),
    });
  } catch (err) {
    handleError(res, err, "Failed to fetch testimonials");
  }
});

router.post("/", optionalAuth, async (req, res) => {
  try {
    const testimonial = await createTestimonial(req.body, req.user?.id);
    res.status(201).json({
      testimonial: formatTestimonial(testimonial),
      message: "Thank you! Your review will appear after moderation.",
    });
  } catch (err) {
    handleError(res, err, "Failed to submit testimonial");
  }
});

router.get("/all", authenticate, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status as TestimonialStatus | undefined;
    if (status && !Object.values(TestimonialStatus).includes(status)) {
      res.status(400).json({ message: "Invalid status filter" });
      return;
    }
    const testimonials = await getAllTestimonials(status);
    res.json({
      testimonials: testimonials.map((t) => formatTestimonial(t)),
    });
  } catch (err) {
    handleError(res, err, "Failed to fetch testimonials");
  }
});

router.patch("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const testimonial = await updateTestimonialStatus(
      getRouteParam(req.params, "id"),
      req.body.status,
    );
    res.json({ testimonial: formatTestimonial(testimonial) });
  } catch (err) {
    handleError(res, err, "Failed to update testimonial status");
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await deleteTestimonial(getRouteParam(req.params, "id"));
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    handleError(res, err, "Failed to delete testimonial");
  }
});

export default router;
