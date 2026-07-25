import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { UserRole, type SafeUser } from "../types/user.js";
import { COOKIE_NAME, verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser & { id: string };
    }
  }
}

function formatUser(user: InstanceType<typeof User>) {
  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = formatUser(user);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token =
    req.cookies?.[COOKIE_NAME] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    next();
    return;
  }

  void (async () => {
    try {
      const payload = verifyToken(token);
      const user = await User.findById(payload.userId);
      if (user) req.user = formatUser(user);
    } catch {
      // ignore invalid token
    }
    next();
  })();
}
