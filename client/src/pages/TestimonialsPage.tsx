import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import StarRating from "../components/testimonials/StarRating";
import TestimonialCard from "../components/testimonials/TestimonialCard";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../context/AuthContext";
import { fetchTestimonials, submitTestimonial } from "../lib/testimonialApi";
import type { Testimonial } from "../types/testimonial";

export default function TestimonialsPage() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTestimonials()
      .then((data) => setTestimonials(data.testimonials))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await submitTestimonial({ name, message, rating });
      setSuccess(res.message);
      setMessage("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Guest Reviews"
            title="What Our Guests Say"
            description="Read approved reviews from our diners, or share your own experience."
          />

          {loading && (
            <p className="mt-14 text-center text-gray-500">Loading reviews…</p>
          )}

          {!loading && testimonials.length === 0 && (
            <p className="mt-14 text-center text-gray-500">
              No published reviews yet. Be the first to share your experience.
            </p>
          )}

          {!loading && testimonials.length > 0 && (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}

          <div className="mx-auto mt-16 max-w-xl">
            <Card>
              <CardContent>
                <h2 className="font-display text-2xl text-white">
                  Share Your Experience
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  No account needed. Reviews are moderated before appearing
                  publicly.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <Input
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-300">
                      Rating
                    </p>
                    <StarRating
                      rating={rating}
                      interactive
                      onChange={setRating}
                    />
                  </div>

                  <Textarea
                    label="Your Review"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    minLength={10}
                    placeholder="Tell us about your visit…"
                  />

                  {error && <p className="text-sm text-red-400">{error}</p>}
                  {success && (
                    <p className="text-sm text-green-400">{success}</p>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting…" : "Submit Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
