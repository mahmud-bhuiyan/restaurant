import mongoose, { Schema, type Document, type Types } from "mongoose";
import { ReservationStatus } from "../types/reservation.js";

export interface ReservationDocument extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<ReservationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

reservationSchema.index({ date: 1, time: 1, status: 1 });

export const Reservation = mongoose.model<ReservationDocument>(
  "Reservation",
  reservationSchema,
);
