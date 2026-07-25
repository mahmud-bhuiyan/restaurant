import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { fetchGallery } from "../lib/galleryApi";
import type { GalleryImage } from "../types/gallery";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGallery()
      .then((data) => setImages(data.images))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load gallery"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Gallery"
            title="Inside Epicurean Haven"
            description="A glimpse of our dining room, dishes, and atmosphere."
          />

          {loading && (
            <p className="mt-14 text-center text-gray-500">Loading gallery…</p>
          )}
          {error && (
            <p className="mt-14 text-center text-red-400">{error}</p>
          )}

          {!loading && !error && images.length === 0 && (
            <p className="mt-14 text-center text-gray-500">
              Gallery images coming soon.
            </p>
          )}

          {!loading && images.length > 0 && (
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {images.map((img, i) => (
                <figure
                  key={img.id}
                  className={`group relative overflow-hidden rounded-sm ${
                    i === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[420px]" : "aspect-square"
                    }`}
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/reservations">
              <Button>Book a Table</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
