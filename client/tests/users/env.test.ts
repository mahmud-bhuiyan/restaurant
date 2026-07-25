import { describe, expect, it, vi, afterEach } from "vitest";
import { getApiBaseUrl } from "../../src/lib/env";

describe("getApiBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns /api/v1 when VITE_API_URL is unset", () => {
    vi.stubEnv("VITE_API_URL", "");
    expect(getApiBaseUrl()).toBe("/api/v1");
  });

  it("builds full URL from VITE_API_URL", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com");
    expect(getApiBaseUrl()).toBe("https://api.example.com/api/v1");
  });

  it("strips trailing slash from VITE_API_URL", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/");
    expect(getApiBaseUrl()).toBe("https://api.example.com/api/v1");
  });
});
