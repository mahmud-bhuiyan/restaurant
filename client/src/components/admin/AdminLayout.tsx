import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Reservations", href: "/admin/reservations" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-charcoal-dark">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 shrink-0 border-r border-white/5 bg-charcoal p-6 transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
                onClick={() => setMobileOpen(false)}
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center border-b border-white/5 bg-charcoal px-4 py-3 lg:hidden">
          <button
            type="button"
            className="text-sm text-gray-300"
            onClick={() => setMobileOpen(true)}
          >
            ☰ Menu
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
