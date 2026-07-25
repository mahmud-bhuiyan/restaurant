import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { fetchOrder } from "../lib/orderApi";
import type { Order } from "../types/order";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchOrder(id)
      .then((data) => setOrder(data.order))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load order"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-content px-6 py-12 md:px-8 md:py-16">
        {loading && (
          <p className="text-center text-gray-500">Loading order…</p>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <Link to="/account" className="mt-6 inline-block">
              <Button variant="outline">My Account</Button>
            </Link>
          </div>
        )}

        {order && (
          <div className="mx-auto max-w-lg text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Order Confirmed
            </p>
            <h1 className="mt-2 font-display text-3xl text-white">
              Thank You!
            </h1>
            <p className="mt-3 text-gray-400">
              Your order has been placed. Pay with cash on{" "}
              {order.orderType === "DELIVERY" ? "delivery" : "pickup"}.
            </p>

            <Card className="mt-10 text-left">
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>

                <ul className="mt-6 space-y-3 border-t border-white/5 pt-4">
                  {order.items.map((item) => (
                    <li
                      key={`${item.menuItemId}-${item.quantity}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-300">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="text-gold">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-display text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-gold">${order.total.toFixed(2)}</span>
                </div>

                {order.orderType === "DELIVERY" && order.deliveryAddress && (
                  <p className="mt-4 text-sm text-gray-500">
                    Delivering to: {order.deliveryAddress}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/account">
                <Button variant="outline">View Order History</Button>
              </Link>
              <Link to="/menu">
                <Button>Order Again</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
