import { useEffect, useState } from "react";
import PageMeta from "../components/seo/PageMeta";
import PublicLayout from "../components/layout/PublicLayout";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
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
      <PageMeta
        title="Menu"
        description="Browse our seasonal fine-dining menu. Order online for delivery or pickup."
      />
      <div className="section-padding">
        <div className="mx-auto max-w-content">
          <PageHeader
            eyebrow="Our Menu"
            title="Seasonal Selections"
            description="Explore our curated dishes. Unavailable items are marked as sold out."
          />

          {loading && <LoadingState message="Loading menu…" className="mt-14" />}

          {error && <ErrorState message={error} className="mt-14 text-center" />}

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
                <EmptyState message="No items in this category yet." />
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
