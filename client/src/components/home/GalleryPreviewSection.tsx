import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { fetchGallery } from "../../lib/galleryApi";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import type { GalleryImage } from "../../types/gallery";

export default function GalleryPreviewSection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    fetchGallery(4)
      .then((data) => setImages(data.images))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && images.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-content">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Gallery</p>
          <h2 className="section-heading mt-2">
            Inside {settings.restaurantName}
          </h2>
          <div className="gold-divider" />
        </div>

        {loading && (
          <p className="mt-14 text-center text-gray-500">Loading gallery…</p>
        )}

        {!loading && images.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {images.map((img, i) => (
              <figure
                key={img.id}
                className={`group relative overflow-hidden rounded-sm ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    i === 0
                      ? "aspect-square md:aspect-auto md:h-full"
                      : "aspect-square"
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
          <Link to="/gallery">
            <Button variant="outline">View Gallery</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
