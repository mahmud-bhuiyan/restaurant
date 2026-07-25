import { api } from "./api";

export type DashboardStats = {
  ordersToday: number;
  pendingOrders: number;
  pendingReservations: number;
  pendingTestimonials: number;
  weekRevenue: number;
  weekOrderCount: number;
  totalMenuItems: number;
  galleryImages: number;
};

export function fetchDashboardStats() {
  return api<{ stats: DashboardStats }>("/admin/stats");
}
