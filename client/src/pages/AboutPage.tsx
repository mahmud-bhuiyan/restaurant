import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function AboutPage() {
  const { settings, loading } = useSiteSettings();
  const paragraphs = settings.aboutBody.split("\n\n").filter(Boolean);

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Our Story"
            title={settings.aboutTitle}
            description={settings.tagline}
          />

          {loading ? (
            <p className="mt-14 text-center text-gray-500">Loading…</p>
          ) : (
            <div className="mt-14 grid items-center gap-12 md:grid-cols-2 md:gap-16">
              <div className="relative">
                <img
                  src={settings.aboutImage}
                  alt=""
                  className="rounded-sm object-cover shadow-card"
                />
                <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 border border-gold/40 md:block" />
              </div>

              <div>
                {paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-4 leading-relaxed text-gray-400 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                <Link to="/menu" className="mt-8 inline-block">
                  <Button variant="outline">Explore the Menu</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
