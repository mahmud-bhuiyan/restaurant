import Badge from "../ui/Badge";
import type { TestimonialStatus } from "../../types/testimonial";
import { TESTIMONIAL_STATUS_LABELS } from "../../types/testimonial";

const variantMap: Record<
  TestimonialStatus,
  "default" | "gold" | "success" | "warning" | "muted"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "muted",
};

type TestimonialStatusBadgeProps = {
  status: TestimonialStatus;
};

export default function TestimonialStatusBadge({
  status,
}: TestimonialStatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      {TESTIMONIAL_STATUS_LABELS[status]}
    </Badge>
  );
}
