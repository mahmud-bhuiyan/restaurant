import mongoose, { Schema, type Document, type Types } from "mongoose";
import { TestimonialStatus } from "../types/testimonial.js";

export interface TestimonialDocument extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  message: string;
  rating: number;
  status: TestimonialStatus;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<TestimonialDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    status: {
      type: String,
      enum: Object.values(TestimonialStatus),
      default: TestimonialStatus.PENDING,
    },
  },
  { timestamps: true },
);

export const Testimonial = mongoose.model<TestimonialDocument>(
  "Testimonial",
  testimonialSchema,
);
