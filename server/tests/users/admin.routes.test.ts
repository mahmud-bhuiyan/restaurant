import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { Order } from "../../src/models/Order.js";
import { Reservation } from "../../src/models/Reservation.js";
import { Testimonial } from "../../src/models/Testimonial.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import { OrderStatus } from "../../src/types/order.js";
import { ReservationStatus } from "../../src/types/reservation.js";
import { TestimonialStatus } from "../../src/types/testimonial.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const ADMIN = "/api/v1/admin";

async function loginAdmin(agent: ReturnType<typeof request.agent>) {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  await User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
  await agent
    .post(`${AUTH}/login`)
    .send({ email: "admin@test.com", password: "Admin123!" });
}

describe("GET /api/v1/admin/stats", () => {
  it("returns dashboard stats for admin", async () => {
    const agent = request.agent(app);
    await loginAdmin(agent);

    const customer = await User.create({
      name: "C",
      email: "c@test.com",
      passwordHash: await bcrypt.hash("secret12", 12),
      role: UserRole.CUSTOMER,
    });

    await Order.create({
      userId: customer._id,
      status: OrderStatus.PENDING,
      orderType: "PICKUP",
      phone: "555",
      subtotal: 50,
      total: 50,
      items: [
        {
          menuItemId: new mongoose.Types.ObjectId(),
          name: "Steak",
          quantity: 1,
          priceAtOrder: 50,
        },
      ],
    });

    await Reservation.create({
      name: "Guest",
      email: "g@test.com",
      phone: "555",
      date: "2099-01-01",
      time: "18:00",
      partySize: 2,
      status: ReservationStatus.PENDING,
    });

    await Testimonial.create({
      name: "Reviewer",
      message: "Great food and wonderful service overall.",
      rating: 5,
      status: TestimonialStatus.PENDING,
    });

    const res = await agent.get(`${ADMIN}/stats`);
    expect(res.status).toBe(200);
    expect(res.body.stats.pendingOrders).toBeGreaterThanOrEqual(1);
    expect(res.body.stats.pendingReservations).toBeGreaterThanOrEqual(1);
    expect(res.body.stats.pendingTestimonials).toBeGreaterThanOrEqual(1);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get(`${ADMIN}/stats`);
    expect(res.status).toBe(401);
  });
});
