import {
  SiteSettings,
  type SiteSettingsDocument,
} from "../models/SiteSettings.js";

export class SettingsError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getSiteSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

export function formatPublicSettings(settings: SiteSettingsDocument) {
  return {
    restaurantName: settings.restaurantName,
    tagline: settings.tagline,
    description: settings.description,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    openingHours: settings.openingHours ?? [],
    heroImage: settings.heroImage,
    aboutTitle: settings.aboutTitle,
    aboutBody: settings.aboutBody,
    aboutImage: settings.aboutImage,
    socialLinks: settings.socialLinks ?? {},
  };
}

export function formatAdminSettings(settings: SiteSettingsDocument) {
  return {
    ...formatPublicSettings(settings),
    maxCoversPerSlot: settings.maxCoversPerSlot,
    reservationTimeSlots: settings.reservationTimeSlots,
  };
}

export type SettingsUpdateInput = Partial<{
  restaurantName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: { days: string; time: string }[];
  heroImage: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  socialLinks: Record<string, string>;
  maxCoversPerSlot: number;
  reservationTimeSlots: string[];
}>;

export async function updateSiteSettings(input: SettingsUpdateInput) {
  const settings = await getSiteSettings();

  if (input.restaurantName !== undefined) {
    settings.restaurantName = input.restaurantName.trim();
  }
  if (input.tagline !== undefined) settings.tagline = input.tagline.trim();
  if (input.description !== undefined) {
    settings.description = input.description.trim();
  }
  if (input.address !== undefined) settings.address = input.address.trim();
  if (input.phone !== undefined) settings.phone = input.phone.trim();
  if (input.email !== undefined) settings.email = input.email.trim();
  if (input.openingHours !== undefined) {
    settings.openingHours = input.openingHours;
  }
  if (input.heroImage !== undefined) settings.heroImage = input.heroImage.trim();
  if (input.aboutTitle !== undefined) {
    settings.aboutTitle = input.aboutTitle.trim();
  }
  if (input.aboutBody !== undefined) settings.aboutBody = input.aboutBody.trim();
  if (input.aboutImage !== undefined) {
    settings.aboutImage = input.aboutImage.trim();
  }
  if (input.socialLinks !== undefined) settings.socialLinks = input.socialLinks;
  if (input.maxCoversPerSlot !== undefined) {
    if (input.maxCoversPerSlot < 1) {
      throw new SettingsError("maxCoversPerSlot must be at least 1", 400);
    }
    settings.maxCoversPerSlot = input.maxCoversPerSlot;
  }
  if (input.reservationTimeSlots !== undefined) {
    settings.reservationTimeSlots = input.reservationTimeSlots;
  }

  await settings.save();
  return settings;
}
