import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { MenuCategory } from "../../src/models/MenuCategory.js";
import { MenuItem } from "../../src/models/MenuItem.js";
import { User } from "../../src/models/User.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

const app = createApp();
const AUTH = "/api/v1/auth";
const ORDERS = "/api/v1/orders";

async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  return User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: UserRole.ADMIN,
  });
}

async function seedMenuItem() {
  const category = await MenuCategory.create({ name: "Mains", sortOrder: 1 });
  const item = await MenuItem.create({
    categoryId: category._id,
    name: "Steak",
    description: "Grilled",
    price: 32,
    isAvailable: true,
  });
  return item;
}

describe("POST /api/v1/orders", () => {
  it("creates an order for authenticated customer", async () => {
    const agent = request.agent(app);
    const menuItem = await seedMenuItem();

    await agent
      .post(`${AUTH}/register`)
      .send({ name: "Buyer", email: "buyer@test.com", password: "secret12" });

    const res = await agent.post(ORDERS).send({
      orderType: "DELIVERY",
      phone: "555-0000",
      deliveryAddress: "123 Main St",
      items: [{ menuItemId: menuItem._id.toString(), quantity: 2 }],
    });

    expect(res.status).toBe(201);
    expect(res.body.order.status).toBe("PENDING");
    expect(res.body.order.total).toBe(64);
    expect(res.body.order.items).toHaveLength(1);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post(ORDERS).send({ items: [] });
    expect(res.status).toBe(401);
  });

  it("returns 400 for empty cart", async () => {
    const agent = request.agent(app);

    await agent
      .post(`${AUTH}/register`)
      .send({ name: "Empty", email: "empty@test.com", password: "secret12" });

    const res = await agent.post(ORDERS).send({
      orderType: "PICKUP",
      phone: "555-1111",
      items: [],
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/orders/mine", () => {
  it("returns customer orders", async () => {
    const agent = request.agent(app);
    const menuItem = await seedMenuItem();

    await agent
      .post(`${AUTH}/register`)
      .send({ name: "History", email: "hist@test.com", password: "secret12" });

    await agent.post(ORDERS).send({
      orderType: "PICKUP",
      phone: "555-2222",
      items: [{ menuItemId: menuItem._id.toString(), quantity: 1 }],
    });

    const res = await agent.get(`${ORDERS}/mine`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(1);
  });
});

describe("PATCH /api/v1/orders/:id/status", () => {
  it("allows admin to update order status", async () => {
    const customer = request.agent(app);
    const admin = request.agent(app);
    const menuItem = await seedMenuItem();

    await customer
      .post(`${AUTH}/register`)
      .send({ name: "Cust", email: "cust@test.com", password: "secret12" });

    const createRes = await customer.post(ORDERS).send({
      orderType: "PICKUP",
      phone: "555-3333",
      items: [{ menuItemId: menuItem._id.toString(), quantity: 1 }],
    });

    await createAdmin();
    await admin
      .post(`${AUTH}/login`)
      .send({ email: "admin@test.com", password: "Admin123!" });

    const res = await admin
      .patch(`${ORDERS}/${createRes.body.order.id}/status`)
      .send({ status: "CONFIRMED" });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe("CONFIRMED");
  });
});
