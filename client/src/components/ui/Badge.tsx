import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "default" | "gold" | "success" | "warning" | "muted";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-charcoal-light text-gray-300 border-charcoal-light",
  gold: "bg-gold/15 text-gold border-gold/30",
  success: "bg-green-500/15 text-green-400 border-green-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  muted: "bg-white/5 text-gray-500 border-white/10",
};

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
