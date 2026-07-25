export type OpeningHours = {
  days: string;
  time: string;
};

export type SiteSettings = {
  restaurantName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours[];
  heroImage: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  socialLinks: Record<string, string>;
};

export type AdminSiteSettings = SiteSettings & {
  maxCoversPerSlot: number;
  reservationTimeSlots: string[];
};
