import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navLinks, siteInfo } from "../../lib/mockData";
import { cn } from "../../lib/cn";
import Button from "../ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-charcoal/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-8">
        <Link to="/" className="group flex flex-col">
          <span className="font-display text-xl font-semibold tracking-wide text-white transition-colors group-hover:text-gold">
            {siteInfo.name}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-gray-500 sm:block">
            Fine Dining
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  "text-sm tracking-wide transition-colors hover:text-gold",
                  location.pathname === link.href
                    ? "text-gold"
                    : "text-gray-400",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  {user.name.split(" ")[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-transform",
              mobileOpen && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-opacity",
              mobileOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-transform",
              mobileOpen && "-translate-y-2 -rotate-45",
            )}
          />
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-charcoal px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block text-lg",
                    location.pathname === link.href
                      ? "text-gold"
                      : "text-gray-300",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    My Account
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button className="w-full" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
