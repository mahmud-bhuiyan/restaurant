import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";
import { fetchDashboardStats, type DashboardStats } from "../../lib/adminApi";

const quickLinks = [
  { label: "Menu", desc: "Categories & dishes", href: "/admin/menu" },
  { label: "Orders", desc: "Manage & update status", href: "/admin/orders" },
  { label: "Reservations", desc: "Table bookings", href: "/admin/reservations" },
  { label: "Testimonials", desc: "Review moderation", href: "/admin/testimonials" },
  { label: "Gallery", desc: "Photos & captions", href: "/admin/gallery" },
  { label: "Settings", desc: "Site content & hours", href: "/admin/settings" },
];

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const content = (
    <Card className={href ? "transition-colors hover:border-gold/30" : undefined}>
      <CardContent>
        <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
        <p className="mt-2 font-display text-3xl text-gold">{value}</p>
        {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </CardContent>
    </Card>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data.stats))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load stats"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Badge variant="gold">Admin</Badge>
      <h1 className="mt-4 font-display text-3xl text-white">Dashboard</h1>
      <p className="mt-3 max-w-xl text-gray-400">
        Welcome back, {user?.name}. Here&apos;s what needs attention today.
      </p>

      {loading && <p className="mt-10 text-gray-500">Loading stats…</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {stats && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Orders Today"
            value={stats.ordersToday}
            hint={`${stats.weekOrderCount} this week`}
            href="/admin/orders"
          />
          <StatCard
            label="Pending Orders"
            value={stats.pendingOrders}
            href="/admin/orders"
          />
          <StatCard
            label="Pending Reservations"
            value={stats.pendingReservations}
            href="/admin/reservations"
          />
          <StatCard
            label="Pending Reviews"
            value={stats.pendingTestimonials}
            href="/admin/testimonials"
          />
          <StatCard
            label="Revenue (7 days)"
            value={`$${stats.weekRevenue.toFixed(2)}`}
            hint="Excludes cancelled"
          />
          <StatCard label="Menu Items" value={stats.totalMenuItems} href="/admin/menu" />
          <StatCard label="Gallery Photos" value={stats.galleryImages} href="/admin/gallery" />
        </div>
      )}

      <h2 className="mt-12 font-display text-xl text-white">Quick Links</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-sm border border-charcoal-light bg-charcoal p-5 transition-colors hover:border-gold/30"
          >
            <h3 className="font-display text-lg text-white">{card.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
