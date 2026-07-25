import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import MenuItemCard from "../menu/MenuItemCard";
import { fetchFeatured } from "../../lib/menuApi";
import type { MenuItem } from "../../types/menu";

export default function FeaturedMenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured()
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-content">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            From Our Kitchen
          </p>
          <h2 className="section-heading mt-2">Featured Dishes</h2>
          <div className="gold-divider" />
          <p className="section-subheading mx-auto">
            Handpicked selections from our seasonal menu, crafted with the finest
            ingredients.
          </p>
        </div>

        {loading && (
          <p className="mt-14 text-center text-gray-500">Loading featured dishes…</p>
        )}

        {!loading && items.length === 0 && (
          <p className="mt-14 text-center text-gray-500">
            Featured dishes coming soon.
          </p>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/menu">
            <Button variant="outline">View Full Menu</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
