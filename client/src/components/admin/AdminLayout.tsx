import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Reservations", href: "/admin/reservations" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-charcoal-dark">
      <aside className="w-56 shrink-0 border-r border-white/5 bg-charcoal p-6">
        <Link to="/" className="font-display text-lg text-gold">
          Epicurean Haven
        </Link>
        <p className="mt-1 text-xs uppercase tracking-widest text-gray-600">
          Admin Panel
        </p>

        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block rounded-sm px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/"
          className="mt-8 block text-xs text-gray-600 hover:text-gold"
        >
          ← Back to site
        </Link>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
