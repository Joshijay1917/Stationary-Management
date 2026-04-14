import { withOptimisticSync } from "@/lib/optimisticSync";
import { Product } from "@/models/Product";
import { create } from "zustand";

type InventoryState = {
  products: Product[];
  isLoading: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  addItem: (product: Omit<Product, '_id'>) => Promise<void>;
  updateItem: (productId: string, data: Partial<Product>) => Promise<void>;
  deleteItem: (productId: string) => Promise<void>;
  updateStock: (productId: string, delta: number) => Promise<void>;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [], // Start empty, fetch from DB!
  isLoading: false,

  // 1. INITIAL LOAD
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      set({ isLoading: false });
    }
  },

  // 2. OPTIMISTIC ADD
  addItem: async (productData) => {
    const tempId = Date.now().toString();
    const optimisticProduct = { ...productData, _id: tempId } as Product;
    const previous = get().products;

    // Instant UI Update
    set({ products: [...previous, optimisticProduct] });

    // Background Sync
    await withOptimisticSync(
      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }),
      () => set({ products: previous }), // Rollback
      (realProduct) => set((state) => ({ // Swap temp ID for real MongoDB _id
        products: state.products.map((p) => (p._id === tempId ? realProduct : p)),
      }))
    );
  },

  // 3. OPTIMISTIC UPDATE
  updateItem: async (productId, data) => {
    const previous = get().products;

    // Instant UI Update
    set((state) => ({
      products: state.products.map((p) =>
        p._id === productId ? { ...p, ...data } : p
      ),
    }));

    // Background Sync
    await withOptimisticSync(
      fetch(`/api/products?id=${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
      () => set({ products: previous }) // Rollback
    );
  },

  // 4. OPTIMISTIC DELETE
  deleteItem: async (productId) => {
    const previous = get().products;

    // Instant UI Update
    set((state) => ({
      products: state.products.filter((p) => p._id !== productId),
    }));

    // Background Sync
    await withOptimisticSync(
      fetch(`/api/products?id=${productId}`, { method: "DELETE" }),
      () => set({ products: previous }) // Rollback
    );
  },

  // 5. OPTIMISTIC STOCK UPDATE (Custom logic, same API PUT request)
  updateStock: async (productId, delta) => {
    const previous = get().products;

    // Find the product so we know the new stock level to send to the DB
    const productToUpdate = previous.find((p) => p._id === productId);
    if (!productToUpdate) return;

    const newStock = Math.max(0, productToUpdate.stock + delta);

    // Instant UI Update
    set((state) => ({
      products: state.products.map((p) => {
        if (p._id === productId) {
          return { ...p, stock: newStock };
        }
        return p;
      }),
    }));

    // Background Sync (We just use the standard PUT endpoint to update the stock field)
    await withOptimisticSync(
      fetch(`/api/products?id=${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      }),
      () => set({ products: previous }) // Rollback
    );
  },
}));