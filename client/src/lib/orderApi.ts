import { api } from "./api";
import type { CreateOrderInput, Order, OrderStatus } from "../types/order";

export function createOrder(data: CreateOrderInput) {
  return api<{ order: Order }>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchMyOrders() {
  return api<{ orders: Order[] }>("/orders/mine");
}

export function fetchOrder(id: string) {
  return api<{ order: Order }>(`/orders/${id}`);
}

export function fetchAllOrders(status?: OrderStatus) {
  const query = status ? `?status=${status}` : "";
  return api<{ orders: Order[] }>(`/orders${query}`);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return api<{ order: Order }>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
