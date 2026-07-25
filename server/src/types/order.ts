export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum OrderType {
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP",
}

export const ORDER_STATUSES = Object.values(OrderStatus);

export type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
};

export type CreateOrderInput = {
  orderType: OrderType;
  deliveryAddress?: string;
  phone: string;
  notes?: string;
  items: CreateOrderItemInput[];
};
