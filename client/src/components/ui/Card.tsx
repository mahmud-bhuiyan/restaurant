import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-charcoal-light bg-charcoal-light/40",
        hover && "transition-transform duration-300 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("aspect-[4/3] overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}
