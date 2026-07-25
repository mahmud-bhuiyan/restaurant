import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function AboutSection() {
  return (
    <section className="section-padding bg-charcoal-dark">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1578477494108-274e1f5c2d86?w=700&h=800&fit=crop"
            alt="Chef preparing a dish"
            className="rounded-sm object-cover shadow-card"
            loading="lazy"
          />
          <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 border border-gold/40 md:block" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h2 className="section-heading mt-2">A Passion for Culinary Art</h2>
          <div className="gold-divider !mx-0" />
          <p className="mt-6 leading-relaxed text-gray-400">
            Founded on the belief that dining should be an experience, Epicurean
            Haven brings together classic techniques and modern creativity. Our
            chef-led kitchen sources locally and seasonally, transforming the
            finest ingredients into dishes that surprise and delight.
          </p>
          <p className="mt-4 leading-relaxed text-gray-400">
            Whether you&apos;re celebrating a special occasion or simply indulging
            in exceptional food, we invite you to savor every moment at our table.
          </p>
          <Link to="/about" className="mt-8 inline-block">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
