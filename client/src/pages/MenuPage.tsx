import { useEffect, useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import MenuItemCard from "../components/menu/MenuItemCard";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { fetchMenu } from "../lib/menuApi";
import { cn } from "../lib/cn";
import type { MenuCategory, MenuItem } from "../types/menu";

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu()
      .then((data) => {
        setCategories(data.categories);
        setItems(data.items);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load menu"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.categoryId === activeCategory);

  return (
    <PublicLayout>
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Our Menu"
            title="Seasonal Selections"
            description="Explore our curated dishes. Unavailable items are marked as sold out."
          />

          {loading && (
            <p className="mt-14 text-center text-gray-500">Loading menu…</p>
          )}

          {error && (
            <p className="mt-14 text-center text-red-400">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                <Button
                  variant={activeCategory === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {filteredItems.length === 0 ? (
                <p className="mt-14 text-center text-gray-500">
                  No items in this category yet.
                </p>
              ) : (
                <div
                  className={cn(
                    "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
