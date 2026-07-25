import { Link } from "react-router-dom";
import { siteInfo } from "../../lib/mockData";
import Button from "../ui/Button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="relative z-10 mx-auto max-w-content px-6 py-20 text-center md:px-8">
        <p className="mb-4 animate-fade-in text-xs uppercase tracking-[0.4em] text-gold">
          Fine Dining Experience
        </p>
        <h1 className="animate-fade-in font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
          {siteInfo.name}
        </h1>
        <p className="mx-auto mt-6 max-w-xl animate-fade-in text-lg text-gray-300 md:text-xl">
          {siteInfo.tagline}
        </p>
        <div
          className="mt-10 flex animate-fade-in flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.15s" }}
        >
          <Link to="/menu">
            <Button size="lg">Explore Menu</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Book a Table
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
