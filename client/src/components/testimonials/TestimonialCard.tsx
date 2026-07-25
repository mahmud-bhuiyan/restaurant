import type { Testimonial } from "../../types/testimonial";
import StarRating from "./StarRating";
import { Card, CardContent } from "../ui/Card";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent>
        <StarRating rating={testimonial.rating} />
        <blockquote className="mt-4 text-sm leading-relaxed text-gray-300">
          &ldquo;{testimonial.message}&rdquo;
        </blockquote>
        <p className="mt-4 font-display text-gold">{testimonial.name}</p>
      </CardContent>
    </Card>
  );
}
