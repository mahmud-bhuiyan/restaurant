import type { Response } from "express";
import type { UserDocument } from "../models/User.js";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: Date;
};

export function formatPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function sendAuthResponse(
  res: Response,
  user: UserDocument,
  setCookie: (token: string) => void,
  signToken: (payload: { userId: string; role: string }) => string,
  status = 200,
) {
  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
  });
  setCookie(token);
  res.status(status).json({ user: formatPublicUser(user) });
}
