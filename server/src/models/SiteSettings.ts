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

export const DEFAULT_OPENING_HOURS = [
  { days: "Mon – Thu", time: "5:00 PM – 10:00 PM" },
  { days: "Fri – Sat", time: "5:00 PM – 11:00 PM" },
  { days: "Sunday", time: "4:00 PM – 9:00 PM" },
];

export const DEFAULT_SOCIAL_LINKS = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
};

export interface SiteSettingsDocument extends Document {
  restaurantName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  maxCoversPerSlot: number;
  reservationTimeSlots: string[];
  openingHours: { days: string; time: string }[];
  heroImage: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  socialLinks: Record<string, string>;
}

const siteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    restaurantName: { type: String, default: "Epicurean Haven" },
    tagline: { type: String, default: "Where every dish tells a story" },
    description: {
      type: String,
      default:
        "An intimate fine-dining experience celebrating seasonal ingredients, bold flavors, and the art of hospitality.",
    },
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
    openingHours: { type: Schema.Types.Mixed, default: DEFAULT_OPENING_HOURS },
    heroImage: { type: String, default: "" },
    aboutTitle: { type: String, default: "A Passion for Culinary Art" },
    aboutBody: {
      type: String,
      default:
        "Founded on the belief that dining should be an experience, Epicurean Haven brings together classic techniques and modern creativity. Our chef-led kitchen sources locally and seasonally, transforming the finest ingredients into dishes that surprise and delight.\n\nWhether you're celebrating a special occasion or simply indulging in exceptional food, we invite you to savor every moment at our table.",
    },
    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1578477494108-274e1f5c2d86?w=700&h=800&fit=crop",
    },
    socialLinks: { type: Schema.Types.Mixed, default: DEFAULT_SOCIAL_LINKS },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.model<SiteSettingsDocument>(
  "SiteSettings",
  siteSettingsSchema,
);
