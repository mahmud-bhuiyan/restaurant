import { useEffect, useState } from "react";
import StarRating from "../../components/testimonials/StarRating";
import TestimonialStatusBadge from "../../components/testimonials/TestimonialStatusBadge";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  deleteTestimonial,
  fetchAllTestimonials,
  updateTestimonialStatus,
} from "../../lib/testimonialApi";
import type { Testimonial } from "../../types/testimonial";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllTestimonials(
        statusFilter === "all"
          ? undefined
          : (statusFilter as Testimonial["status"]),
      );
      setTestimonials(data.testimonials);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  async function handleStatus(
    id: string,
    status: Testimonial["status"],
  ) {
    setUpdatingId(id);
    try {
      const { testimonial } = await updateTestimonialStatus(id, status);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? testimonial : t)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial permanently?")) return;
    setUpdatingId(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Testimonials</p>
      <h1 className="mt-1 font-display text-3xl text-white">Moderation Queue</h1>
      <p className="mt-2 text-gray-400">
        Approve or reject guest reviews before they appear on the site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "PENDING", "APPROVED", "REJECTED"].map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "primary" : "outline"}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all" ? "All" : status}
          </Button>
        ))}
      </div>

      {loading && <p className="mt-10 text-gray-500">Loading…</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {!loading && !error && testimonials.length === 0 && (
        <p className="mt-10 text-gray-500">No testimonials found.</p>
      )}

      <div className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-white">
                      {t.name}
                    </span>
                    <TestimonialStatusBadge status={t.status} />
                  </div>
                  <StarRating rating={t.rating} size="sm" />
                  <blockquote className="mt-3 text-sm text-gray-300">
                    &ldquo;{t.message}&rdquo;
                  </blockquote>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {t.status !== "APPROVED" && (
                    <Button
                      size="sm"
                      disabled={updatingId === t.id}
                      onClick={() => handleStatus(t.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                  )}
                  {t.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === t.id}
                      onClick={() => handleStatus(t.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={updatingId === t.id}
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
