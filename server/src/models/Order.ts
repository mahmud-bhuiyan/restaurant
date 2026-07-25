import mongoose, { Schema, type Document, type Types } from "mongoose";
import { OrderStatus, OrderType } from "../types/order.js";

export interface OrderItemDocument {
  menuItemId: Types.ObjectId;
  name: string;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  status: OrderStatus;
  orderType: OrderType;
  deliveryAddress: string;
  phone: string;
  subtotal: number;
  total: number;
  notes: string;
  items: OrderItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemDocument>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrder: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
    },
    deliveryAddress: { type: String, default: "" },
    phone: { type: String, required: true, trim: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true, validate: [(v: unknown[]) => v.length > 0, "Order must have items"] },
  },
  { timestamps: true },
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
