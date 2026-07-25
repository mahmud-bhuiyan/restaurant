import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

const app = createApp();

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

describe("POST /api/auth/register", () => {
  it("registers a customer and sets cookie", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Jane Doe",
        email: "jane@routes.com",
        password: "secret12",
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("jane@routes.com");
    expect(res.body.user.role).toBe("CUSTOMER");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 400 when fields missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@b.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("returns 409 for duplicate email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "A", email: "dup@routes.com", password: "secret12" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "B", email: "dup@routes.com", password: "secret12" });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with valid credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Login", email: "login@routes.com", password: "secret12" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@routes.com", password: "secret12" });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("login@routes.com");
  });

  it("returns 401 for wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Login", email: "bad@routes.com", password: "secret12" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "bad@routes.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });

  it("allows admin login", async () => {
    await createAdmin();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "Admin123!" });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("ADMIN");
  });
});

describe("GET /api/auth/me", () => {
  it("returns user when authenticated", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({ name: "Me Test", email: "me@routes.com", password: "secret12" });

    const res = await agent.get("/api/auth/me");

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("me@routes.com");
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/auth/profile", () => {
  it("updates profile for authenticated user", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({ name: "Profile", email: "prof@routes.com", password: "secret12" });

    const res = await agent
      .patch("/api/auth/profile")
      .send({ name: "New Name", phone: "555-1234" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("New Name");
    expect(res.body.user.phone).toBe("555-1234");
  });
});

describe("POST /api/auth/logout", () => {
  it("clears session", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({ name: "Logout", email: "out@routes.com", password: "secret12" });

    await agent.post("/api/auth/logout");

    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
