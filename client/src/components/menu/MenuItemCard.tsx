import type { MenuItem } from "../../types/menu";
import Badge from "../ui/Badge";
import { Card, CardContent, CardImage } from "../ui/Card";
import { cn } from "../../lib/cn";

type MenuItemCardProps = {
  item: MenuItem;
  className?: string;
};

export default function MenuItemCard({ item, className }: MenuItemCardProps) {
  return (
    <Card hover className={cn(!item.isAvailable && "opacity-75", className)}>
      {item.imageUrl && <CardImage src={item.imageUrl} alt={item.name} />}
      <CardContent>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {item.categoryName && (
              <Badge variant="gold">{item.categoryName}</Badge>
            )}
            {!item.isAvailable && <Badge variant="warning">Sold Out</Badge>}
            {item.isFeatured && item.isAvailable && (
              <Badge variant="success">Featured</Badge>
            )}
          </div>
          <span className="shrink-0 font-display text-lg text-gold">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <h3 className="font-display text-xl text-white">{item.name}</h3>
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {item.description}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
