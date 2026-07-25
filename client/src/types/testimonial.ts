export type TestimonialStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Testimonial = {
  id: string;
  userId?: string;
  name: string;
  message: string;
  rating: number;
  status: TestimonialStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateTestimonialInput = {
  name: string;
  message: string;
  rating: number;
};

export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
