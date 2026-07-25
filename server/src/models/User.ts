import mongoose, { Schema, type Document, type Types } from "mongoose";
import { UserRole } from "../types/user.js";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<UserDocument>("User", userSchema);
