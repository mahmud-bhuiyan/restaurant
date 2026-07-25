import { Link } from "react-router-dom";
import { testimonials } from "../../lib/mockData";
import Button from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-gold" : "text-gray-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsPreviewSection() {
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

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent>
                <StarRating rating={t.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.message}&rdquo;
                </blockquote>
                <p className="mt-4 font-display text-gold">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/testimonials">
            <Button variant="outline">Read All Reviews</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
