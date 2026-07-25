import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "../../src/lib/api";

describe("ApiError", () => {
  it("stores message and status", () => {
    const err = new ApiError("Unauthorized", 401);
    expect(err.message).toBe("Unauthorized");
    expect(err.status).toBe(401);
    expect(err).toBeInstanceOf(Error);
  });
});

describe("auth API client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("register sends POST with credentials", async () => {
    const mockUser = {
      id: "1",
      name: "Jane",
      email: "jane@test.com",
      phone: "",
      address: "",
      role: "CUSTOMER" as const,
      createdAt: new Date().toISOString(),
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      }),
    );

    const result = await api<{ user: typeof mockUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Jane",
        email: "jane@test.com",
        password: "secret12",
      }),
    });

    expect(result.user.email).toBe("jane@test.com");
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
  });

  it("throws ApiError on failed response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Invalid email or password" }),
      }),
    );

    await expect(
      api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "wrong" }),
      }),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      status: 401,
    });
  });
});
