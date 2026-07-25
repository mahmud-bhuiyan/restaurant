import { Reservation, type ReservationDocument } from "../models/Reservation.js";
import {
  DEFAULT_MAX_COVERS_PER_SLOT,
  DEFAULT_TIME_SLOTS,
} from "../models/SiteSettings.js";
import {
  ReservationStatus,
  type CreateReservationInput,
} from "../types/reservation.js";
import { getSiteSettings } from "./settingsService.js";

export class ReservationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const ACTIVE_STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
];

export function formatReservation(reservation: ReservationDocument) {
  return {
    id: reservation._id.toString(),
    userId: reservation.userId?.toString(),
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    date: reservation.date,
    time: reservation.time,
    partySize: reservation.partySize,
    status: reservation.status,
    notes: reservation.notes,
    createdAt: reservation.createdAt.toISOString(),
    updatedAt: reservation.updatedAt.toISOString(),
  };
}

function parseDateOnly(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ReservationError("Date must be YYYY-MM-DD", 400);
  }
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new ReservationError("Invalid date", 400);
  }
  return parsed;
}

function isPastDate(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const booking = parseDateOnly(date);
  return booking < today;
}

export async function getSlotAvailability(date: string) {
  parseDateOnly(date);

  if (isPastDate(date)) {
    throw new ReservationError("Cannot book a date in the past", 400);
  }

  const settings = await getSiteSettings();
  const maxCovers = settings.maxCoversPerSlot ?? DEFAULT_MAX_COVERS_PER_SLOT;
  const slots = settings.reservationTimeSlots?.length
    ? settings.reservationTimeSlots
    : DEFAULT_TIME_SLOTS;

  const reservations = await Reservation.find({
    date,
    status: { $in: ACTIVE_STATUSES },
  });

  const bookedBySlot = new Map<string, number>();
  for (const r of reservations) {
    bookedBySlot.set(r.time, (bookedBySlot.get(r.time) ?? 0) + r.partySize);
  }

  return {
    date,
    maxCoversPerSlot: maxCovers,
    slots: slots.map((time) => {
      const bookedCovers = bookedBySlot.get(time) ?? 0;
      const remainingCovers = Math.max(0, maxCovers - bookedCovers);
      return {
        time,
        bookedCovers,
        remainingCovers,
        available: remainingCovers > 0,
      };
    }),
  };
}

async function getBookedCovers(date: string, time: string) {
  const reservations = await Reservation.find({
    date,
    time,
    status: { $in: ACTIVE_STATUSES },
  });
  return reservations.reduce((sum, r) => sum + r.partySize, 0);
}

export async function createReservation(
  input: CreateReservationInput,
  userId?: string,
) {
  if (!input.name?.trim() || !input.email?.trim() || !input.phone?.trim()) {
    throw new ReservationError("Name, email, and phone are required", 400);
  }

  if (!input.date || !input.time) {
    throw new ReservationError("Date and time are required", 400);
  }

  if (!input.partySize || input.partySize < 1 || input.partySize > 20) {
    throw new ReservationError("Party size must be between 1 and 20", 400);
  }

  if (isPastDate(input.date)) {
    throw new ReservationError("Cannot book a date in the past", 400);
  }

  const settings = await getSiteSettings();
  const slots = settings.reservationTimeSlots?.length
    ? settings.reservationTimeSlots
    : DEFAULT_TIME_SLOTS;

  if (!slots.includes(input.time)) {
    throw new ReservationError("Invalid time slot", 400);
  }

  const maxCovers = settings.maxCoversPerSlot ?? DEFAULT_MAX_COVERS_PER_SLOT;
  const booked = await getBookedCovers(input.date, input.time);

  if (booked + input.partySize > maxCovers) {
    throw new ReservationError(
      "This time slot does not have enough covers available",
      409,
    );
  }

  const reservation = await Reservation.create({
    userId: userId || undefined,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    date: input.date,
    time: input.time,
    partySize: input.partySize,
    notes: input.notes?.trim() || "",
    status: ReservationStatus.PENDING,
  });

  return reservation;
}

export async function getReservationsForUser(userId: string) {
  return Reservation.find({ userId }).sort({ date: -1, time: -1 });
}

export async function getAllReservations(filters: {
  date?: string;
  status?: ReservationStatus;
}) {
  const query: Record<string, unknown> = {};
  if (filters.date) query.date = filters.date;
  if (filters.status) query.status = filters.status;
  return Reservation.find(query).sort({ date: -1, time: -1 });
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
) {
  if (!Object.values(ReservationStatus).includes(status)) {
    throw new ReservationError("Invalid reservation status", 400);
  }

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new ReservationError("Reservation not found", 404);
  }

  if (
    status !== ReservationStatus.CANCELLED &&
    reservation.status === ReservationStatus.CANCELLED
  ) {
    const settings = await getSiteSettings();
    const maxCovers = settings.maxCoversPerSlot ?? DEFAULT_MAX_COVERS_PER_SLOT;
    const booked = await getBookedCovers(reservation.date, reservation.time);
    if (booked + reservation.partySize > maxCovers) {
      throw new ReservationError(
        "Cannot reactivate — slot is now full",
        409,
      );
    }
  }

  reservation.status = status;
  await reservation.save();
  return reservation;
}
