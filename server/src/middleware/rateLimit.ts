import type { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message?: string;
};

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

function clientKey(req: Request, prefix: string) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip) ||
    "unknown";
  return `${prefix}:${ip.trim()}`;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests, please try again later" } =
    options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = clientKey(req, `${req.method}:${req.baseUrl}${req.path}`);
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= max) {
      res.status(429).json({ message });
      return;
    }

    entry.count += 1;
    next();
  };
}

/** Test helper */
export function resetRateLimitStore() {
  store.clear();
}
