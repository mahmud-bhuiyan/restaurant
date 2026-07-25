import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../lib/orderApi";
import { useCartStore } from "../store/cartStore";
import type { OrderType } from "../types/order";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());

  const [orderType, setOrderType] = useState<OrderType>("DELIVERY");
  const [phone, setPhone] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const { order } = await createOrder({
        orderType,
        phone,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      });
      clearCart();
      navigate(`/orders/${order.id}/confirmation`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Checkout</p>
          <h1 className="mt-2 font-display text-3xl text-white">Your Cart is Empty</h1>
          <p className="mt-4 max-w-md text-gray-400">
            Add dishes from the menu, then return here to complete your order.
          </p>
          <Link to="/menu" className="mt-8">
            <Button variant="outline">Browse Menu</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-content px-6 py-12 md:px-8 md:py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Checkout</p>
        <h1 className="mt-1 font-display text-3xl text-white">Your Order</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <h2 className="font-display text-xl text-white">Cart</h2>
                <ul className="mt-6 space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.menuItemId}
                      className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gold">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setQuantity(item.menuItemId, item.quantity - 1)
                            }
                          >
                            −
                          </Button>
                          <span className="w-8 text-center text-sm text-white">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setQuantity(item.menuItemId, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.menuItemId)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <p className="shrink-0 font-display text-gold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-display text-xl text-gold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <Badge variant="muted" className="mt-4">
                  Cash on Delivery
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardContent>
                <h2 className="font-display text-xl text-white">
                  Delivery Details
                </h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-300">
                      Order Type
                    </p>
                    <div className="flex gap-3">
                      {(["DELIVERY", "PICKUP"] as OrderType[]).map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={orderType === type ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setOrderType(type)}
                        >
                          {type === "DELIVERY" ? "Delivery" : "Pickup"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  {orderType === "DELIVERY" && (
                    <Input
                      label="Delivery Address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  )}

                  <Textarea
                    label="Order Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Allergies, delivery instructions…"
                  />

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting
                      ? "Placing Order…"
                      : `Place Order — $${subtotal.toFixed(2)}`}
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
