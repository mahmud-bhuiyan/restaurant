import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { fetchAllOrders, updateOrderStatus } from "../../lib/orderApi";
import type { Order } from "../../types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders(filter: string) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllOrders(
        filter === "all" ? undefined : (filter as Order["status"]),
      );
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  async function handleStatusChange(orderId: string, status: Order["status"]) {
    setUpdatingId(orderId);
    try {
      const { order } = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Orders</p>
      <h1 className="mt-1 font-display text-3xl text-white">Order Management</h1>
      <p className="mt-2 text-gray-400">
        View and update order status. Payment is cash on delivery.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "primary" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status.replace(/_/g, " ")}
            </Button>
          ),
        )}
      </div>

      {loading && <p className="mt-10 text-gray-500">Loading orders…</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="mt-10 text-gray-500">No orders found.</p>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-white">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <Badge variant="muted">
                      {order.orderType === "DELIVERY" ? "Delivery" : "Pickup"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    {order.customerName || "Customer"} · {order.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.deliveryAddress && (
                    <p className="mt-1 text-sm text-gray-500">
                      {order.deliveryAddress}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-display text-xl text-gold">
                    ${order.total.toFixed(2)}
                  </p>
                  <select
                    className="mt-3 rounded-sm border border-charcoal-light bg-charcoal-dark px-3 py-2 text-sm text-white"
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as Order["status"],
                      )
                    }
                  >
                    {[
                      "PENDING",
                      "CONFIRMED",
                      "PREPARING",
                      "OUT_FOR_DELIVERY",
                      "DELIVERED",
                      "CANCELLED",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="mt-4 space-y-1 border-t border-white/5 pt-4 text-sm">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.menuItemId}`} className="flex justify-between text-gray-400">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {order.notes && (
                <p className="mt-3 text-sm italic text-gray-500">
                  Note: {order.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
