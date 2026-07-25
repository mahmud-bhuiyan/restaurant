import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Button from "../components/ui/Button";

export default function CheckoutPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Checkout</p>
        <h1 className="mt-2 font-display text-3xl text-white">Your Cart</h1>
        <p className="mt-4 max-w-md text-gray-400">
          Cart and checkout flow will be built in Module 5. You&apos;re signed in
          and ready to order.
        </p>
        <Link to="/menu" className="mt-8">
          <Button variant="outline">Browse Menu</Button>
        </Link>
      </div>
    </PublicLayout>
  );
}
