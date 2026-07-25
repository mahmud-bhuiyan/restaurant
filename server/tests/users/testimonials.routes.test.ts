import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { Testimonial } from "../../src/models/Testimonial.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import { TestimonialStatus } from "../../src/types/testimonial.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const TESTIMONIALS = "/api/v1/testimonials";

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

describe("POST /api/v1/testimonials", () => {
  it("creates a pending guest testimonial", async () => {
    const res = await request(app).post(TESTIMONIALS).send({
      name: "Sarah M",
      message: "An unforgettable evening with perfect service.",
      rating: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body.testimonial.status).toBe("PENDING");
    expect(res.body.message).toMatch(/moderation/i);
  });

  it("returns 400 for invalid rating", async () => {
    const res = await request(app).post(TESTIMONIALS).send({
      name: "Bad",
      message: "Too short rating test",
      rating: 6,
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/testimonials", () => {
  it("returns only approved testimonials", async () => {
    await Testimonial.create([
      {
        name: "Approved",
        message: "Great food and wonderful ambiance here.",
        rating: 5,
        status: TestimonialStatus.APPROVED,
      },
      {
        name: "Pending",
        message: "Still waiting for moderation approval.",
        rating: 4,
        status: TestimonialStatus.PENDING,
      },
    ]);

    const res = await request(app).get(TESTIMONIALS);
    expect(res.status).toBe(200);
    expect(res.body.testimonials).toHaveLength(1);
    expect(res.body.testimonials[0].name).toBe("Approved");
  });
});

describe("PATCH /api/v1/testimonials/:id/status", () => {
  it("allows admin to approve testimonial", async () => {
    const admin = request.agent(app);
    const testimonial = await Testimonial.create({
      name: "Review Me",
      message: "Please approve this lovely review.",
      rating: 5,
      status: TestimonialStatus.PENDING,
    });

    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin
      .patch(`${TESTIMONIALS}/${testimonial._id.toString()}/status`)
      .send({ status: "APPROVED" });

    expect(res.status).toBe(200);
    expect(res.body.testimonial.status).toBe("APPROVED");
  });
});

describe("DELETE /api/v1/testimonials/:id", () => {
  it("allows admin to delete testimonial", async () => {
    const admin = request.agent(app);
    const testimonial = await Testimonial.create({
      name: "Delete Me",
      message: "This review should be removed by admin.",
      rating: 2,
      status: TestimonialStatus.REJECTED,
    });

    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin.delete(
      `${TESTIMONIALS}/${testimonial._id.toString()}`,
    );

    expect(res.status).toBe(200);
    const count = await Testimonial.countDocuments();
    expect(count).toBe(0);
  });
});
