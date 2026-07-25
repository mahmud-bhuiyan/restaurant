import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/ui/Badge";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Badge variant="gold">Admin</Badge>
      <h1 className="mt-4 font-display text-3xl text-white">Dashboard</h1>
      <p className="mt-3 max-w-xl text-gray-400">
        Welcome back, {user?.name}. Manage your menu from the sidebar. Orders,
        reservations, and testimonials will be added in upcoming modules.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Menu", desc: "Categories & dishes", href: "/admin/menu" },
          { label: "Orders", desc: "Module 5", href: "#" },
          { label: "Reservations", desc: "Module 6", href: "#" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-sm border border-charcoal-light bg-charcoal p-5"
          >
            <h2 className="font-display text-lg text-white">{card.label}</h2>
            <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
