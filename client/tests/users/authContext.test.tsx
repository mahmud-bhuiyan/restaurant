import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

function AuthProbe() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>loading</div>;
  if (!user) return <div>guest</div>;
  return (
    <div>
      {user.name} ({user.role}){isAdmin ? " admin" : ""}
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves as guest when /me returns 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      }),
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("guest")).toBeInTheDocument());
  });

  it("sets user when /me succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "1",
              name: "Jane Doe",
              email: "jane@test.com",
              phone: "",
              address: "",
              role: "CUSTOMER",
              createdAt: new Date().toISOString(),
            },
          }),
      }),
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("Jane Doe (CUSTOMER)")).toBeInTheDocument(),
    );
  });

  it("identifies admin role", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "2",
              name: "Admin User",
              email: "admin@test.com",
              phone: "",
              address: "",
              role: "ADMIN",
              createdAt: new Date().toISOString(),
            },
          }),
      }),
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Admin User \(ADMIN\) admin/)).toBeInTheDocument(),
    );
  });
});
