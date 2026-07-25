import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface MenuItemDocument extends Document {
  _id: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<MenuItemDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const MenuItem = mongoose.model<MenuItemDocument>(
  "MenuItem",
  menuItemSchema,
);
