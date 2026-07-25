import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { fetchMyOrders } from "../lib/orderApi";
import { fetchMyReservations } from "../lib/reservationApi";
import type { Order } from "../types/order";
import type { Reservation } from "../types/reservation";
import ReservationStatusBadge from "../components/reservations/ReservationStatusBadge";

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    fetchMyReservations()
      .then((data) => setReservations(data.reservations))
      .catch(() => setReservations([]))
      .finally(() => setReservationsLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-content px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">My Account</p>
            <h1 className="mt-1 font-display text-3xl text-white">
              Hello, {user?.name}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <h2 className="font-display text-xl text-white">Profile</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                  <Input
                    label="Email"
                    value={user?.email || ""}
                    disabled
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                  <Input
                    label="Delivery Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                  />

                  {message && (
                    <p className="text-sm text-green-400">{message}</p>
                  )}
                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg text-white">Account Type</h2>
                  <Badge variant={user?.role === "ADMIN" ? "gold" : "default"}>
                    {user?.role}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl text-white">Order History</h2>
              {ordersLoading && (
                <p className="mt-3 text-sm text-gray-500">Loading orders…</p>
              )}
              {!ordersLoading && orders.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  No orders yet.{" "}
                  <Link to="/menu" className="text-gold hover:underline">
                    Browse the menu
                  </Link>{" "}
                  to place your first order.
                </p>
              )}
              {!ordersLoading && orders.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-white/5 p-3"
                    >
                      <div>
                        <p className="text-sm text-white">
                          #{order.id.slice(-8).toUpperCase()} · $
                          {order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                          {order.orderType === "DELIVERY" ? "Delivery" : "Pickup"}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-display text-xl text-white">Reservations</h2>
              {reservationsLoading && (
                <p className="mt-3 text-sm text-gray-500">Loading…</p>
              )}
              {!reservationsLoading && reservations.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  No reservations yet.{" "}
                  <Link to="/reservations" className="text-gold hover:underline">
                    Book a table
                  </Link>
                  .
                </p>
              )}
              {!reservationsLoading && reservations.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {reservations.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-white/5 p-3"
                    >
                      <div>
                        <p className="text-sm text-white">
                          {new Date(`${r.date}T12:00:00`).toLocaleDateString()} ·{" "}
                          party of {r.partySize}
                        </p>
                        <p className="text-xs text-gray-500">{r.time}</p>
                      </div>
                      <ReservationStatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
