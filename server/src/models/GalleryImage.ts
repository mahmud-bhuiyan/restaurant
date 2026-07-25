import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface GalleryImageDocument extends Document {
  _id: Types.ObjectId;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const galleryImageSchema = new Schema<GalleryImageDocument>(
  {
    imageUrl: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const GalleryImage = mongoose.model<GalleryImageDocument>(
  "GalleryImage",
  galleryImageSchema,
);
