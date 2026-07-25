import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const SETTINGS = "/api/v1/settings";

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

describe("GET /api/v1/settings", () => {
  it("returns public site settings with defaults", async () => {
    const res = await request(app).get(SETTINGS);
    expect(res.status).toBe(200);
    expect(res.body.settings.restaurantName).toBe("Epicurean Haven");
    expect(res.body.settings.aboutTitle).toBeTruthy();
    expect(res.body.settings.openingHours.length).toBeGreaterThan(0);
  });
});

describe("PATCH /api/v1/settings", () => {
  it("allows admin to update about content", async () => {
    const admin = request.agent(app);
    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin.patch(SETTINGS).send({
      aboutTitle: "Our Journey",
      aboutBody: "Updated story for the about page.",
    });

    expect(res.status).toBe(200);
    expect(res.body.settings.aboutTitle).toBe("Our Journey");
  });
});
