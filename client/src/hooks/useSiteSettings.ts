import { useEffect, useState } from "react";
import { fetchSettings } from "../lib/settingsApi";
import { siteInfo } from "../lib/mockData";
import type { SiteSettings } from "../types/settings";

const fallback: SiteSettings = {
  restaurantName: siteInfo.name,
  tagline: siteInfo.tagline,
  description: siteInfo.description,
  address: siteInfo.address,
  phone: siteInfo.phone,
  email: siteInfo.email,
  openingHours: siteInfo.hours,
  heroImage: "",
  aboutTitle: "A Passion for Culinary Art",
  aboutBody:
    "Founded on the belief that dining should be an experience, Epicurean Haven brings together classic techniques and modern creativity.",
  aboutImage:
    "https://images.unsplash.com/photo-1578477494108-274e1f5c2d86?w=700&h=800&fit=crop",
  socialLinks: siteInfo.social,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((data) => setSettings(data.settings))
      .catch(() => setSettings(fallback))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
