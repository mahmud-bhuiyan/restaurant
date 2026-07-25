import {
  Testimonial,
  type TestimonialDocument,
} from "../models/Testimonial.js";
import {
  TestimonialStatus,
  type CreateTestimonialInput,
} from "../types/testimonial.js";

export class TestimonialError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function formatTestimonial(testimonial: TestimonialDocument) {
  return {
    id: testimonial._id.toString(),
    userId: testimonial.userId?.toString(),
    name: testimonial.name,
    message: testimonial.message,
    rating: testimonial.rating,
    status: testimonial.status,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString(),
  };
}

export async function getApprovedTestimonials(limit?: number) {
  const query = Testimonial.find({ status: TestimonialStatus.APPROVED }).sort({
    createdAt: -1,
  });
  if (limit) query.limit(limit);
  return query;
}

export async function createTestimonial(
  input: CreateTestimonialInput,
  userId?: string,
) {
  if (!input.name?.trim() || !input.message?.trim()) {
    throw new TestimonialError("Name and message are required", 400);
  }

  if (
    !input.rating ||
    input.rating < 1 ||
    input.rating > 5 ||
    !Number.isInteger(input.rating)
  ) {
    throw new TestimonialError("Rating must be an integer from 1 to 5", 400);
  }

  if (input.message.trim().length < 10) {
    throw new TestimonialError("Message must be at least 10 characters", 400);
  }

  const testimonial = await Testimonial.create({
    userId: userId || undefined,
    name: input.name.trim(),
    message: input.message.trim(),
    rating: input.rating,
    status: TestimonialStatus.PENDING,
  });

  return testimonial;
}

export async function getAllTestimonials(status?: TestimonialStatus) {
  const filter = status ? { status } : {};
  return Testimonial.find(filter).sort({ createdAt: -1 });
}

export async function updateTestimonialStatus(
  id: string,
  status: TestimonialStatus,
) {
  if (!Object.values(TestimonialStatus).includes(status)) {
    throw new TestimonialError("Invalid testimonial status", 400);
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new TestimonialError("Testimonial not found", 404);
  }

  testimonial.status = status;
  await testimonial.save();
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    throw new TestimonialError("Testimonial not found", 404);
  }
  return testimonial;
}
