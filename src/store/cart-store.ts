import { create } from "zustand";
import { CartItem } from "@/models/Transactions";
import { Product } from "@/models/Product";

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product_id === product._id
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product_id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product_id: product._id, name: product.name, cost_price: product.cost_price, price: product.price, quantity: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product_id !== productId),
    })),

  incrementQty: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decrementQty: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.product_id === productId);
      if (item && item.quantity <= 1) {
        return {
          items: state.items.filter((i) => i.product_id !== productId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product_id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
}));
