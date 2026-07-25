import { api } from "./api";
import type {
  AvailabilityResponse,
  CreateReservationInput,
  Reservation,
  ReservationStatus,
} from "../types/reservation";

export function fetchAvailability(date: string) {
  return api<AvailabilityResponse>(
    `/reservations/availability?date=${encodeURIComponent(date)}`,
  );
}

export function createReservation(data: CreateReservationInput) {
  return api<{ reservation: Reservation }>("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchMyReservations() {
  return api<{ reservations: Reservation[] }>("/reservations/mine");
}

export function fetchAllReservations(filters?: {
  date?: string;
  status?: ReservationStatus;
}) {
  const params = new URLSearchParams();
  if (filters?.date) params.set("date", filters.date);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return api<{ reservations: Reservation[] }>(
    `/reservations${query ? `?${query}` : ""}`,
  );
}

export function updateReservationStatus(id: string, status: ReservationStatus) {
  return api<{ reservation: Reservation }>(`/reservations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
