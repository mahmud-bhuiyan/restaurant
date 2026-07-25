import { Router } from "express";
import { authenticate, optionalAuth, requireAdmin } from "../middleware/auth.js";
import {
  ReservationError,
  createReservation,
  formatReservation,
  getAllReservations,
  getReservationsForUser,
  getSlotAvailability,
  updateReservationStatus,
} from "../services/reservationService.js";
import { ReservationStatus } from "../types/reservation.js";

const router = Router();

function handleError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof ReservationError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(fallback, err);
  res.status(500).json({ message: fallback });
}

router.get("/availability", async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      res.status(400).json({ message: "date query parameter is required" });
      return;
    }
    const availability = await getSlotAvailability(date);
    res.json(availability);
  } catch (err) {
    handleError(res, err, "Failed to fetch availability");
  }
});

router.post("/", optionalAuth, async (req, res) => {
  try {
    const reservation = await createReservation(
      req.body,
      req.user?.id,
    );
    res.status(201).json({ reservation: formatReservation(reservation) });
  } catch (err) {
    handleError(res, err, "Failed to create reservation");
  }
});

router.get("/mine", authenticate, async (req, res) => {
  try {
    const reservations = await getReservationsForUser(req.user!.id);
    res.json({
      reservations: reservations.map((r) => formatReservation(r)),
    });
  } catch (err) {
    handleError(res, err, "Failed to fetch reservations");
  }
});

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    const status = req.query.status as ReservationStatus | undefined;

    if (status && !Object.values(ReservationStatus).includes(status)) {
      res.status(400).json({ message: "Invalid status filter" });
      return;
    }

    const reservations = await getAllReservations({ date, status });
    res.json({
      reservations: reservations.map((r) => formatReservation(r)),
    });
  } catch (err) {
    handleError(res, err, "Failed to fetch reservations");
  }
});

router.patch("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const reservation = await updateReservationStatus(
      req.params.id,
      req.body.status,
    );
    res.json({ reservation: formatReservation(reservation) });
  } catch (err) {
    handleError(res, err, "Failed to update reservation status");
  }
});

export default router;
