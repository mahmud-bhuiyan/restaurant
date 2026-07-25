import Badge from "../ui/Badge";
import type { OrderStatus } from "../../types/order";
import { ORDER_STATUS_LABELS } from "../../types/order";

const variantMap: Record<
  OrderStatus,
  "default" | "gold" | "success" | "warning" | "muted"
> = {
  PENDING: "warning",
  CONFIRMED: "gold",
  PREPARING: "gold",
  OUT_FOR_DELIVERY: "default",
  DELIVERED: "success",
  CANCELLED: "muted",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
