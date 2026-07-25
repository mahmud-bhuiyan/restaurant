export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderType = "DELIVERY" | "PICKUP";

export type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  priceAtOrder: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  userId: string;
  customerName?: string;
  status: OrderStatus;
  orderType: OrderType;
  deliveryAddress: string;
  phone: string;
  subtotal: number;
  total: number;
  notes: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  orderType: OrderType;
  deliveryAddress?: string;
  phone: string;
  notes?: string;
  items: { menuItemId: string; quantity: number }[];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];
