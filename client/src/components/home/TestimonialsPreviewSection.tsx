import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TestimonialCard from "../testimonials/TestimonialCard";
import Button from "../ui/Button";
import { fetchTestimonials } from "../../lib/testimonialApi";
import type { Testimonial } from "../../types/testimonial";

export default function TestimonialsPreviewSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials(3)
      .then((data) => setTestimonials(data.testimonials))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-charcoal-dark">
      <div className="mx-auto max-w-content">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Guest Reviews
          </p>
          <h2 className="section-heading mt-2">What Our Guests Say</h2>
          <div className="gold-divider" />
        </div>

        {loading && (
          <p className="mt-14 text-center text-gray-500">Loading reviews…</p>
        )}

        {!loading && testimonials.length > 0 && (
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/testimonials">
            <Button variant="outline">Read All Reviews</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
