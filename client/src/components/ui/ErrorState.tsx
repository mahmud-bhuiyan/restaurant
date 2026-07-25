type ErrorStateProps = {
  message: string;
  className?: string;
};

export default function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <p className={className ?? "text-center text-red-400"} role="alert">
      {message}
    </p>
  );
}
