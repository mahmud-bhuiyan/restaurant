import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../store/cartStore";
import Button from "../ui/Button";

export default function CartButton() {
  const count = useCartStore((s) => s.itemCount());
  const { user } = useAuth();

  const to = user ? "/checkout" : "/login";

  return (
    <Link to={to} state={user ? undefined : { from: "/checkout" }}>
      <Button variant="ghost" size="sm" className="relative">
        Cart
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-charcoal">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}
