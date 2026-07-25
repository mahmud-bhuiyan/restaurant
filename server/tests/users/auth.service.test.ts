import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";
import { User } from "../../src/models/User.js";
import {
  AuthError,
  loginUser,
  registerUser,
  updateUserProfile,
  validateLoginInput,
  validateRegisterInput,
} from "../../src/services/authService.js";
import { UserRole } from "../../src/types/user.js";
import "../setup/db.js";

describe("authService — validation", () => {
  it("rejects register when required fields missing", () => {
    expect(() =>
      validateRegisterInput({ name: "", email: "a@b.com", password: "123456" }),
    ).toThrow(AuthError);
  });

  it("rejects short passwords", () => {
    expect(() =>
      validateRegisterInput({ name: "Test", email: "a@b.com", password: "123" }),
    ).toThrow("Password must be at least 6 characters");
  });

  it("rejects login when email or password missing", () => {
    expect(() => validateLoginInput("", "pass")).toThrow(AuthError);
    expect(() => validateLoginInput("a@b.com", "")).toThrow(AuthError);
  });
});

describe("authService — registerUser", () => {
  it("creates a customer with hashed password", async () => {
    const user = await registerUser({
      name: "Jane Doe",
      email: "jane@test.com",
      password: "secret12",
    });

    expect(user.name).toBe("Jane Doe");
    expect(user.email).toBe("jane@test.com");
    expect(user.role).toBe(UserRole.CUSTOMER);
    expect(user.passwordHash).not.toBe("secret12");

    const valid = await bcrypt.compare("secret12", user.passwordHash);
    expect(valid).toBe(true);
  });

  it("normalizes email to lowercase", async () => {
    const user = await registerUser({
      name: "Test User",
      email: "Mixed@Test.COM",
      password: "secret12",
    });
    expect(user.email).toBe("mixed@test.com");
  });

  it("throws 409 when email already exists", async () => {
    await registerUser({
      name: "First",
      email: "dup@test.com",
      password: "secret12",
    });

    await expect(
      registerUser({ name: "Second", email: "dup@test.com", password: "secret12" }),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("authService — loginUser", () => {
  it("returns user on valid credentials", async () => {
    await registerUser({
      name: "Login Test",
      email: "login@test.com",
      password: "secret12",
    });

    const user = await loginUser("login@test.com", "secret12");
    expect(user.email).toBe("login@test.com");
  });

  it("throws 401 on wrong password", async () => {
    await registerUser({
      name: "Login Test",
      email: "wrongpass@test.com",
      password: "secret12",
    });

    await expect(loginUser("wrongpass@test.com", "badpass")).rejects.toMatchObject({
      status: 401,
    });
  });

  it("throws 401 when user not found", async () => {
    await expect(loginUser("nobody@test.com", "secret12")).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe("authService — updateUserProfile", () => {
  it("updates name, phone, and address", async () => {
    const created = await registerUser({
      name: "Profile User",
      email: "profile@test.com",
      password: "secret12",
    });

    const updated = await updateUserProfile(created._id.toString(), {
      name: "Updated Name",
      phone: "555-0100",
      address: "1 Test Lane",
    });

    expect(updated.name).toBe("Updated Name");
    expect(updated.phone).toBe("555-0100");
    expect(updated.address).toBe("1 Test Lane");
  });

  it("throws 404 when user id invalid", async () => {
    await expect(
      updateUserProfile("507f1f77bcf86cd799439011", { name: "X" }),
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe("authService — admin role", () => {
  it("register always assigns CUSTOMER role", async () => {
    const user = await registerUser({
      name: "Customer",
      email: "customer@test.com",
      password: "secret12",
    });
    expect(user.role).toBe(UserRole.CUSTOMER);

    const inDb = await User.findById(user._id);
    expect(inDb?.role).toBe(UserRole.CUSTOMER);
  });
});
