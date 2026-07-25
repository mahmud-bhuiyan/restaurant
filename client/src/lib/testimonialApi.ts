import { api } from "./api";
import type {
  CreateTestimonialInput,
  Testimonial,
  TestimonialStatus,
} from "../types/testimonial";

export function fetchTestimonials(limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return api<{ testimonials: Testimonial[] }>(`/testimonials${query}`);
}

export function submitTestimonial(data: CreateTestimonialInput) {
  return api<{ testimonial: Testimonial; message: string }>("/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchAllTestimonials(status?: TestimonialStatus) {
  const query = status ? `?status=${status}` : "";
  return api<{ testimonials: Testimonial[] }>(`/testimonials/all${query}`);
}

export function updateTestimonialStatus(id: string, status: TestimonialStatus) {
  return api<{ testimonial: Testimonial }>(`/testimonials/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteTestimonial(id: string) {
  return api<{ message: string }>(`/testimonials/${id}`, {
    method: "DELETE",
  });
}
