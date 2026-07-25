import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import ReservationStatusBadge from "../components/reservations/ReservationStatusBadge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../context/AuthContext";
import {
  createReservation,
  fetchAvailability,
} from "../lib/reservationApi";
import { cn } from "../lib/cn";
import type { Reservation, SlotAvailability } from "../types/reservation";

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function formatTime12(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function ReservationPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(tomorrowIso());
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    setSelectedTime("");
    setLoadingSlots(true);
    setError("");

    fetchAvailability(date)
      .then((data) => setSlots(data.slots))
      .catch((err) => {
        setSlots([]);
        setError(err instanceof Error ? err.message : "Failed to load slots");
      })
      .finally(() => setLoadingSlots(false));
  }, [date]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const { reservation } = await createReservation({
        name,
        email,
        phone,
        date,
        time: selectedTime,
        partySize,
        notes: notes || undefined,
      });
      setConfirmed(reservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book table");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-6 py-16 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Reservation Received
          </p>
          <h1 className="mt-2 font-display text-3xl text-white">
            You&apos;re Booked!
          </h1>
          <p className="mt-3 text-gray-400">
            We&apos;ll confirm your table shortly. A confirmation may be sent to{" "}
            {confirmed.email}.
          </p>

          <Card className="mt-10 text-left">
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-lg text-white">
                  {confirmed.name} · party of {confirmed.partySize}
                </p>
                <ReservationStatusBadge status={confirmed.status} />
              </div>
              <p className="mt-3 text-gold">
                {new Date(`${confirmed.date}T12:00:00`).toLocaleDateString(
                  undefined,
                  { weekday: "long", month: "long", day: "numeric" },
                )}{" "}
                at {formatTime12(confirmed.time)}
              </p>
              <p className="mt-2 text-sm text-gray-500">{confirmed.phone}</p>
            </CardContent>
          </Card>

          <Button className="mt-8" onClick={() => setConfirmed(null)}>
            Book Another Table
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Reservations"
            title="Book a Table"
            description="No account required. Log in to pre-fill your details and see bookings on your account page."
          />

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-2xl space-y-8"
          >
            <Card>
              <CardContent className="space-y-5">
                <h2 className="font-display text-xl text-white">When</h2>
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-300">
                    Time Slot
                  </p>
                  {loadingSlots && (
                    <p className="text-sm text-gray-500">Loading slots…</p>
                  )}
                  {!loadingSlots && slots.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No slots available for this date.
                    </p>
                  )}
                  {!loadingSlots && slots.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available || slot.remainingCovers < partySize}
                          onClick={() => setSelectedTime(slot.time)}
                          className={cn(
                            "rounded-sm border px-3 py-2 text-sm transition-colors",
                            selectedTime === slot.time
                              ? "border-gold bg-gold/15 text-gold"
                              : "border-charcoal-light text-gray-300 hover:border-gold/40",
                            (!slot.available ||
                              slot.remainingCovers < partySize) &&
                              "cursor-not-allowed opacity-40",
                          )}
                        >
                          {formatTime12(slot.time)}
                          <span className="mt-0.5 block text-xs text-gray-500">
                            {slot.remainingCovers} covers left
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  label="Party Size"
                  type="number"
                  min={1}
                  max={20}
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-5">
                <h2 className="font-display text-xl text-white">Your Details</h2>
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Textarea
                  label="Special Requests (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anniversary, dietary needs, seating preference…"
                />
              </CardContent>
            </Card>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting…" : "Request Reservation"}
            </Button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
