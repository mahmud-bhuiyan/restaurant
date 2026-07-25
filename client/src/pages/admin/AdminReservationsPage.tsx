import { useEffect, useState } from "react";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import {
  fetchAllReservations,
  updateReservationStatus,
} from "../../lib/reservationApi";
import type { Reservation } from "../../types/reservation";

function formatTime12(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllReservations({
        date: dateFilter || undefined,
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as Reservation["status"]),
      });
      setReservations(data.reservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [dateFilter, statusFilter]);

  async function handleStatusChange(
    id: string,
    status: Reservation["status"],
  ) {
    setUpdatingId(id);
    try {
      const { reservation } = await updateReservationStatus(id, status);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? reservation : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Reservations</p>
      <h1 className="mt-1 font-display text-3xl text-white">
        Table Bookings
      </h1>
      <p className="mt-2 text-gray-400">
        Confirm or cancel guest reservations. Capacity is enforced per time slot.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <Input
          label="Filter by date"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-48"
        />
        <div className="flex flex-wrap gap-2">
          {["all", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "primary" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-10 text-gray-500">Loading…</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <p className="mt-10 text-gray-500">No reservations found.</p>
      )}

      <div className="mt-8 space-y-4">
        {reservations.map((r) => (
          <Card key={r.id}>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-white">
                      {r.name}
                    </span>
                    <ReservationStatusBadge status={r.status} />
                    <Badge variant="muted">Party of {r.partySize}</Badge>
                  </div>
                  <p className="mt-2 text-gold">
                    {new Date(`${r.date}T12:00:00`).toLocaleDateString()} at{" "}
                    {formatTime12(r.time)}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {r.email} · {r.phone}
                  </p>
                  {r.notes && (
                    <p className="mt-2 text-sm italic text-gray-500">
                      {r.notes}
                    </p>
                  )}
                </div>

                <select
                  className="rounded-sm border border-charcoal-light bg-charcoal-dark px-3 py-2 text-sm text-white"
                  value={r.status}
                  disabled={updatingId === r.id}
                  onChange={(e) =>
                    handleStatusChange(
                      r.id,
                      e.target.value as Reservation["status"],
                    )
                  }
                >
                  {["PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
