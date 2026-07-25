import { Link } from "react-router-dom";
import { navLinks, siteInfo } from "../../lib/mockData";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-charcoal-dark">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl text-white">{siteInfo.name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
            {siteInfo.description}
          </p>
          <div className="mt-6 flex gap-4">
            {Object.entries(siteInfo.social).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-gray-500 transition-colors hover:text-gold"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-gold">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-gold">
            Visit Us
          </h4>
          <address className="space-y-2 text-sm not-italic text-gray-400">
            <p>{siteInfo.address}</p>
            <p>
              <a href={`tel:${siteInfo.phone}`} className="hover:text-gold">
                {siteInfo.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteInfo.email}`} className="hover:text-gold">
                {siteInfo.email}
              </a>
            </p>
          </address>
          <div className="mt-4 space-y-1">
            {siteInfo.hours.map((h) => (
              <p key={h.days} className="text-xs text-gray-500">
                <span className="text-gray-400">{h.days}:</span> {h.time}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
