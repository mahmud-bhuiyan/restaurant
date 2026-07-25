export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export type CreateReservationInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
};
