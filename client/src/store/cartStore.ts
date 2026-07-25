import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "../types/menu";

export type CartLine = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!item.isAvailable) return;

        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItemId !== menuItemId),
        }));
      },

      setQuantity: (menuItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "epicurean-cart" },
  ),
);
