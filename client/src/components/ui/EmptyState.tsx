import type { ReactNode } from "react";

type EmptyStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export default function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="font-display text-lg text-white">{title}</p>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
