type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: PageHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">{title}</h1>
      {align === "center" && <div className="gold-divider" />}
      {description && (
        <p
          className={`mt-2 text-sm text-gray-400 ${align === "center" ? "mx-auto max-w-md" : "max-w-xl"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
