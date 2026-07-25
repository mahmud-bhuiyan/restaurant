import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useSiteSettings } from "../../hooks/useSiteSettings";

export default function AboutSection() {
  const { settings } = useSiteSettings();
  const teaser = settings.aboutBody.split("\n\n")[0] ?? settings.description;

  return (
    <section className="section-padding bg-charcoal-dark">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative">
          <img
            src={settings.aboutImage}
            alt=""
            className="rounded-sm object-cover shadow-card"
            loading="lazy"
          />
          <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 border border-gold/40 md:block" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h2 className="section-heading mt-2">{settings.aboutTitle}</h2>
          <div className="gold-divider !mx-0" />
          <p className="mt-6 leading-relaxed text-gray-400">{teaser}</p>
          <Link to="/about" className="mt-8 inline-block">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
