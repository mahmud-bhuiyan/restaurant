import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_EXPIRES_IN = "7d";

export type JwtPayload = {
  userId: string;
  role: string;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.adminJwtSecret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.adminJwtSecret) as JwtPayload;
}

export const COOKIE_NAME = "token";

export function cookieOptions(forClear = false) {
  const base = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? ("none" as const) : ("lax" as const),
  };
  if (forClear) return base;
  return { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 };
}
