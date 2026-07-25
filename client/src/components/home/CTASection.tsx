import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=600&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/80" />

      <div className="relative z-10 section-padding text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl text-white md:text-4xl">
            Reserve Your Table Tonight
          </h2>
          <p className="mt-4 text-gray-400">
            Join us for an unforgettable dining experience. Book online or call
            to secure your spot.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/contact">
              <Button size="lg">Make a Reservation</Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" size="lg">
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
