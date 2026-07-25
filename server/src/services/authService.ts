import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { UserRole } from "../types/user.js";
import { formatPublicUser } from "../utils/userFormatter.js";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
};

export type ProfileInput = {
  name?: string;
  phone?: string;
  address?: string;
};

export function validateRegisterInput(input: RegisterInput) {
  if (!input.name?.trim() || !input.email?.trim() || !input.password) {
    throw new AuthError("Name, email, and password are required", 400);
  }
  if (input.password.length < 6) {
    throw new AuthError("Password must be at least 6 characters", 400);
  }
}

export function validateLoginInput(email?: string, password?: string) {
  if (!email?.trim() || !password) {
    throw new AuthError("Email and password are required", 400);
  }
}

export async function registerUser(input: RegisterInput) {
  validateRegisterInput(input);

  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AuthError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name.trim(),
    email,
    passwordHash,
    phone: input.phone?.trim() || "",
    address: input.address?.trim() || "",
    role: UserRole.CUSTOMER,
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  validateLoginInput(email, password);

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AuthError("Invalid email or password", 401);
  }

  return user;
}

export async function updateUserProfile(userId: string, input: ProfileInput) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AuthError("User not found", 404);
  }

  if (input.name?.trim()) user.name = input.name.trim();
  if (input.phone !== undefined) user.phone = input.phone.trim();
  if (input.address !== undefined) user.address = input.address.trim();

  await user.save();
  return formatPublicUser(user);
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId);
  if (!user) return null;
  return formatPublicUser(user);
}
