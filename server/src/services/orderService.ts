import { MenuItem } from "../models/MenuItem.js";
import { Order, type OrderDocument } from "../models/Order.js";
import { User } from "../models/User.js";
import {
  OrderStatus,
  OrderType,
  type CreateOrderInput,
} from "../types/order.js";

export class OrderError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatOrder(order: OrderDocument, customerName?: string) {
  return {
    id: order._id.toString(),
    userId: order.userId.toString(),
    customerName,
    status: order.status,
    orderType: order.orderType,
    deliveryAddress: order.deliveryAddress,
    phone: order.phone,
    subtotal: order.subtotal,
    total: order.total,
    notes: order.notes,
    items: order.items.map((item) => ({
      menuItemId: item.menuItemId.toString(),
      name: item.name,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
      lineTotal: roundMoney(item.quantity * item.priceAtOrder),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  if (!input.items?.length) {
    throw new OrderError("Order must include at least one item", 400);
  }

  if (!Object.values(OrderType).includes(input.orderType)) {
    throw new OrderError("Invalid order type", 400);
  }

  if (!input.phone?.trim()) {
    throw new OrderError("Phone number is required", 400);
  }

  if (input.orderType === OrderType.DELIVERY && !input.deliveryAddress?.trim()) {
    throw new OrderError("Delivery address is required for delivery orders", 400);
  }

  const lineItems: OrderDocument["items"] = [];
  let subtotal = 0;

  for (const line of input.items) {
    if (!line.menuItemId || !line.quantity || line.quantity < 1) {
      throw new OrderError("Each item must have a valid menu item and quantity", 400);
    }

    const menuItem = await MenuItem.findById(line.menuItemId);
    if (!menuItem) {
      throw new OrderError(`Menu item not found: ${line.menuItemId}`, 400);
    }
    if (!menuItem.isAvailable) {
      throw new OrderError(`${menuItem.name} is currently unavailable`, 400);
    }

    const priceAtOrder = menuItem.price;
    subtotal += priceAtOrder * line.quantity;

    lineItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      quantity: line.quantity,
      priceAtOrder,
    });
  }

  subtotal = roundMoney(subtotal);

  const order = await Order.create({
    userId,
    status: OrderStatus.PENDING,
    orderType: input.orderType,
    deliveryAddress:
      input.orderType === OrderType.DELIVERY
        ? input.deliveryAddress!.trim()
        : "",
    phone: input.phone.trim(),
    subtotal,
    total: subtotal,
    notes: input.notes?.trim() || "",
    items: lineItems,
  });

  return order;
}

export async function getOrdersForUser(userId: string) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}

export async function getAllOrders(status?: OrderStatus) {
  const filter = status ? { status } : {};
  return Order.find(filter).sort({ createdAt: -1 });
}

export async function getOrderById(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new OrderError("Order not found", 404);
  }
  return order;
}

export async function getCustomerName(userId: string) {
  const user = await User.findById(userId).select("name");
  return user?.name;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!Object.values(OrderStatus).includes(status)) {
    throw new OrderError("Invalid order status", 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new OrderError("Order not found", 404);
  }

  order.status = status;
  await order.save();
  return order;
}
