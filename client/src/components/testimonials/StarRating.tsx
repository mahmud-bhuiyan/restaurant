import { cn } from "../../lib/cn";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (rating: number) => void;
};

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div
      className={cn("flex gap-0.5", sizeClass)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1;
        const filled = value <= rating;

        if (interactive) {
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              onClick={() => onChange?.(value)}
              className={cn(
                "transition-colors hover:text-gold",
                filled ? "text-gold" : "text-gray-600",
              )}
            >
              ★
            </button>
          );
        }

        return (
          <span key={value} className={filled ? "text-gold" : "text-gray-600"}>
            ★
          </span>
        );
      })}
    </div>
  );
}
