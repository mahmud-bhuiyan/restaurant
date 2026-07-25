import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { SiteSettings } from "../../src/models/SiteSettings.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const RESERVATIONS = "/api/v1/reservations";

function futureDate(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

describe("GET /api/v1/reservations/availability", () => {
  it("returns slots for a valid date", async () => {
    const date = futureDate();
    const res = await request(app).get(
      `${RESERVATIONS}/availability?date=${date}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.date).toBe(date);
    expect(res.body.slots.length).toBeGreaterThan(0);
    expect(res.body.slots[0]).toHaveProperty("remainingCovers");
  });
});

describe("POST /api/v1/reservations", () => {
  it("creates a guest reservation", async () => {
    const date = futureDate();
    const res = await request(app).post(RESERVATIONS).send({
      name: "Guest User",
      email: "guest@test.com",
      phone: "555-0000",
      date,
      time: "18:00",
      partySize: 4,
    });

    expect(res.status).toBe(201);
    expect(res.body.reservation.status).toBe("PENDING");
    expect(res.body.reservation.partySize).toBe(4);
  });

  it("links reservation to logged-in user", async () => {
    const agent = request.agent(app);
    const date = futureDate(8);

    await agent
      .post(`${AUTH}/register`)
      .send({ name: "Member", email: "member@test.com", password: "secret12" });

    await agent.post(RESERVATIONS).send({
      name: "Member",
      email: "member@test.com",
      phone: "555-1111",
      date,
      time: "19:00",
      partySize: 2,
    });

    const res = await agent.get(`${RESERVATIONS}/mine`);
    expect(res.status).toBe(200);
    expect(res.body.reservations).toHaveLength(1);
  });

  it("returns 409 when slot is full", async () => {
    await SiteSettings.create({ maxCoversPerSlot: 4 });
    const date = futureDate(9);

    await request(app).post(RESERVATIONS).send({
      name: "First",
      email: "first@test.com",
      phone: "555-2222",
      date,
      time: "20:00",
      partySize: 4,
    });

    const res = await request(app).post(RESERVATIONS).send({
      name: "Second",
      email: "second@test.com",
      phone: "555-3333",
      date,
      time: "20:00",
      partySize: 1,
    });

    expect(res.status).toBe(409);
  });
});

describe("PATCH /api/v1/reservations/:id/status", () => {
  it("allows admin to confirm reservation", async () => {
    const admin = request.agent(app);
    const date = futureDate(10);

    const createRes = await request(app).post(RESERVATIONS).send({
      name: "Confirm Me",
      email: "confirm@test.com",
      phone: "555-4444",
      date,
      time: "17:00",
      partySize: 2,
    });

    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin
      .patch(`${RESERVATIONS}/${createRes.body.reservation.id}/status`)
      .send({ status: "CONFIRMED" });

    expect(res.status).toBe(200);
    expect(res.body.reservation.status).toBe("CONFIRMED");
  });
});
