import { create } from "zustand";
import { initialCategories } from "@/data/categories";
import { Category } from "@/models/Category";
import { ObjectId } from "mongoose";
import { withOptimisticSync } from "@/lib/optimisticSync";

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<Category[]>;
  addCategory: (category: Partial<Category>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  // Sync Background Helper
  fetchCategories: async (): Promise<Category[]> => {
    try {
      const categories = await fetch("/api/categories");
      const data = await categories.json();
      set({ categories: data, isLoading: false });
      return data;
    } catch (error) {
      console.error("Failed to sync categories:", error);
      return [];
    }
  },

  addCategory: async (categoryData) => {
    const tempId = Date.now().toString();
    const previous = get().categories;

    // 1. Instant UI Update
    set({ categories: [...previous, { ...categoryData, _id: tempId } as Category] });

    // 2. Background Sync
    await withOptimisticSync(
      fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      }),
      () => set({ categories: previous }), // Rollback if it fails
      (realCategory) => set((state) => ({   // Replace temp ID if it succeeds
        categories: state.categories.map((c) => (c._id === tempId ? realCategory : c)),
      }))
    );
  },

  updateCategory: async (id, data) => {
    const previous = get().categories;

    // 1. Instant UI Update
    set((state) => ({
      categories: state.categories.map((c) => (c._id === id ? { ...c, ...data } : c)),
    }));

    // 2. Background Sync
    await withOptimisticSync(
      fetch(`/api/categories?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
      () => set({ categories: previous }) // Only need a rollback here!
    );
  },

  deleteCategory: async (id) => {
    const previous = get().categories;

    // 1. Instant UI Update
    set((state) => ({
      categories: state.categories.filter((c) => c._id !== id),
    }));

    // 2. Background Sync
    await withOptimisticSync(
      fetch(`/api/categories?id=${id}`, { method: "DELETE" }),
      () => set({ categories: previous }) // Only need a rollback here!
    );
  }
}));
