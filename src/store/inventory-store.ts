import { create } from "zustand";
import { products as initialProducts, Product } from "@/data/products";

type InventoryState = {
  products: Product[];
  addItem: (product: Product) => void;
  updateItem: (productId: string, data: Partial<Product>) => void;
  deleteItem: (productId: string) => void;
  updateStock: (productId: string, delta: number) => void;
};

// Sync Background Helper
const syncProducts = async (products: Product[]) => {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
  } catch (error) {
    console.error("Failed to sync inventory:", error);
  }
};

export const useInventoryStore = create<InventoryState>((set) => ({
  products: initialProducts,

  addItem: (product) =>
    set((state) => {
      const newProducts = [...state.products, product];
      syncProducts(newProducts);
      return { products: newProducts };
    }),

  updateItem: (productId, data) =>
    set((state) => {
      const newProducts = state.products.map((p) =>
        p.id === productId ? { ...p, ...data } : p
      );
      syncProducts(newProducts);
      return { products: newProducts };
    }),

  deleteItem: (productId) =>
    set((state) => {
      const newProducts = state.products.filter((p) => p.id !== productId);
      syncProducts(newProducts);
      return { products: newProducts };
    }),

  updateStock: (productId, delta) =>
    set((state) => {
      const newProducts = state.products.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      });
      syncProducts(newProducts);
      return { products: newProducts };
    }),
}));
