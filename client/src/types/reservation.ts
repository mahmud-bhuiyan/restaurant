export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type Reservation = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotAvailability = {
  time: string;
  bookedCovers: number;
  remainingCovers: number;
  available: boolean;
};

export type AvailabilityResponse = {
  date: string;
  maxCoversPerSlot: number;
  slots: SlotAvailability[];
};

export type CreateReservationInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
];
