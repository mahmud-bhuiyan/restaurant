import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface MenuCategoryDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuCategorySchema = new Schema<MenuCategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const MenuCategory = mongoose.model<MenuCategoryDocument>(
  "MenuCategory",
  menuCategorySchema,
);
