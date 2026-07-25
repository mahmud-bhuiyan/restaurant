import { cn } from "../../lib/cn";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export default function LoadingState({
  message = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <p className={cn("text-center text-gray-500", className)} role="status">
      {message}
    </p>
  );
}
