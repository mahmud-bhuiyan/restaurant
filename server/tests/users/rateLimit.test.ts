import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { resetRateLimitStore } from "../../src/middleware/rateLimit.js";
import "../setup/db.js";

const app = createApp();
const TESTIMONIALS = "/api/v1/testimonials";

describe("rateLimit on POST /api/v1/testimonials", () => {
  afterEach(() => {
    resetRateLimitStore();
  });

  it("returns 429 after exceeding limit", async () => {
    const body = {
      name: "Spammer",
      message: "This is a test review message for rate limit.",
      rating: 3,
    };

    for (let i = 0; i < 5; i++) {
      const res = await request(app).post(TESTIMONIALS).send(body);
      expect(res.status).toBe(201);
    }

    const blocked = await request(app).post(TESTIMONIALS).send(body);
    expect(blocked.status).toBe(429);
  });
});
