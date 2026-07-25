import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function ContactPage() {
  const { settings, loading } = useSiteSettings();

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Contact"
            title="Visit Epicurean Haven"
            description="We'd love to hear from you. Reach out or book a table online."
          />

          {loading ? (
            <p className="mt-14 text-center text-gray-500">Loading…</p>
          ) : (
            <div className="mx-auto mt-14 grid max-w-3xl gap-10 md:grid-cols-2">
              <div className="rounded-sm border border-white/5 bg-charcoal p-6">
                <h2 className="font-display text-xl text-white">Get in Touch</h2>
                <address className="mt-4 space-y-3 text-sm not-italic text-gray-400">
                  <p>{settings.address}</p>
                  <p>
                    <a href={`tel:${settings.phone}`} className="hover:text-gold">
                      {settings.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-gold"
                    >
                      {settings.email}
                    </a>
                  </p>
                </address>

                <div className="mt-6 flex flex-wrap gap-3">
                  {Object.entries(settings.socialLinks).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-widest text-gray-500 hover:text-gold"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-white/5 bg-charcoal p-6">
                <h2 className="font-display text-xl text-white">Hours</h2>
                <ul className="mt-4 space-y-2 text-sm text-gray-400">
                  {settings.openingHours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4">
                      <span className="text-gray-300">{h.days}</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/reservations" className="mt-8 inline-block">
                  <Button className="w-full">Make a Reservation</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
