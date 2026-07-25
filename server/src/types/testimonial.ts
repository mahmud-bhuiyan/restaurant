export enum TestimonialStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type CreateTestimonialInput = {
  name: string;
  message: string;
  rating: number;
};
