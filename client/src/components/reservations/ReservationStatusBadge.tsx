import Badge from "../ui/Badge";
import type { ReservationStatus } from "../../types/reservation";
import { RESERVATION_STATUS_LABELS } from "../../types/reservation";

const variantMap: Record<
  ReservationStatus,
  "default" | "gold" | "success" | "warning" | "muted"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "muted",
};

type ReservationStatusBadgeProps = {
  status: ReservationStatus;
};

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      {RESERVATION_STATUS_LABELS[status]}
    </Badge>
  );
}
