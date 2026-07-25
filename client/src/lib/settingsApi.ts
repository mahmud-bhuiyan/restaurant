import { api } from "./api";
import type { AdminSiteSettings, SiteSettings } from "../types/settings";

export function fetchSettings() {
  return api<{ settings: SiteSettings }>("/settings");
}

export function fetchAdminSettings() {
  return api<{ settings: AdminSiteSettings }>("/settings/admin");
}

export function updateSettings(data: Partial<AdminSiteSettings>) {
  return api<{ settings: AdminSiteSettings }>("/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
