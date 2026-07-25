import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { GalleryImage } from "../../src/models/GalleryImage.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const GALLERY = "/api/v1/gallery";

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

describe("GET /api/v1/gallery", () => {
  it("returns gallery images sorted", async () => {
    await GalleryImage.create([
      { imageUrl: "https://example.com/2.jpg", caption: "B", sortOrder: 1 },
      { imageUrl: "https://example.com/1.jpg", caption: "A", sortOrder: 0 },
    ]);

    const res = await request(app).get(GALLERY);
    expect(res.status).toBe(200);
    expect(res.body.images).toHaveLength(2);
    expect(res.body.images[0].caption).toBe("A");
  });
});

describe("POST /api/v1/gallery", () => {
  it("allows admin to add image", async () => {
    const admin = request.agent(app);
    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin.post(GALLERY).send({
      imageUrl: "https://example.com/new.jpg",
      caption: "New shot",
    });

    expect(res.status).toBe(201);
    expect(res.body.image.caption).toBe("New shot");
  });
});

describe("PATCH /api/v1/gallery/reorder", () => {
  it("reorders gallery images", async () => {
    const admin = request.agent(app);
    const a = await GalleryImage.create({
      imageUrl: "https://example.com/a.jpg",
      caption: "A",
      sortOrder: 0,
    });
    const b = await GalleryImage.create({
      imageUrl: "https://example.com/b.jpg",
      caption: "B",
      sortOrder: 1,
    });

    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin.patch(`${GALLERY}/reorder`).send({
      orderedIds: [b._id.toString(), a._id.toString()],
    });

    expect(res.status).toBe(200);
    expect(res.body.images[0].caption).toBe("B");
  });
});
