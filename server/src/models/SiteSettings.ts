import mongoose, { Schema, type Document } from "mongoose";

export const DEFAULT_TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export const DEFAULT_MAX_COVERS_PER_SLOT = 24;

export interface SiteSettingsDocument extends Document {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  maxCoversPerSlot: number;
  reservationTimeSlots: string[];
  openingHours: Record<string, string>;
  heroImage: string;
  socialLinks: Record<string, string>;
}

const siteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    restaurantName: { type: String, default: "Epicurean Haven" },
    address: { type: String, default: "42 Culinary Lane, Downtown" },
    phone: { type: String, default: "+1 (555) 123-4567" },
    email: { type: String, default: "hello@epicureanhaven.com" },
    maxCoversPerSlot: {
      type: Number,
      default: DEFAULT_MAX_COVERS_PER_SLOT,
      min: 1,
    },
    reservationTimeSlots: {
      type: [String],
      default: DEFAULT_TIME_SLOTS,
    },
    openingHours: { type: Schema.Types.Mixed, default: {} },
    heroImage: { type: String, default: "" },
    socialLinks: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.model<SiteSettingsDocument>(
  "SiteSettings",
  siteSettingsSchema,
);
