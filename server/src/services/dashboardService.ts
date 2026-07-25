import { GalleryImage } from "../models/GalleryImage.js";
import { MenuItem } from "../models/MenuItem.js";
import { Order } from "../models/Order.js";
import { Reservation } from "../models/Reservation.js";
import { Testimonial } from "../models/Testimonial.js";
import { OrderStatus } from "../types/order.js";
import { ReservationStatus } from "../types/reservation.js";
import { TestimonialStatus } from "../types/testimonial.js";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardStats() {
  const today = startOfToday();
  const weekStart = startOfWeek();

  const [
    ordersToday,
    pendingOrders,
    pendingReservations,
    pendingTestimonials,
    weekOrders,
    totalMenuItems,
    galleryImages,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ status: OrderStatus.PENDING }),
    Reservation.countDocuments({ status: ReservationStatus.PENDING }),
    Testimonial.countDocuments({ status: TestimonialStatus.PENDING }),
    Order.find({
      createdAt: { $gte: weekStart },
      status: { $ne: OrderStatus.CANCELLED },
    }).select("total"),
    MenuItem.countDocuments(),
    GalleryImage.countDocuments(),
  ]);

  const weekRevenue = weekOrders.reduce((sum, order) => sum + order.total, 0);

  return {
    ordersToday,
    pendingOrders,
    pendingReservations,
    pendingTestimonials,
    weekRevenue: Math.round(weekRevenue * 100) / 100,
    weekOrderCount: weekOrders.length,
    totalMenuItems,
    galleryImages,
  };
}
