type FormErrorProps = {
  message: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
      {message}
    </p>
  );
}
