import { create } from "zustand";
import { Category, initialCategories } from "@/data/categories";

type CategoryState = {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
};

// Sync Background Helper
const syncCategories = async (categories: Category[]) => {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    });
  } catch (error) {
    console.error("Failed to sync categories:", error);
  }
};

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: initialCategories,

  addCategory: (category) =>
    set((state) => {
      const newCategories = [...state.categories, category];
      syncCategories(newCategories);
      return { categories: newCategories };
    }),

  updateCategory: (id, data) =>
    set((state) => {
      const newCategories = state.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c
      );
      syncCategories(newCategories);
      return { categories: newCategories };
    }),

  deleteCategory: (id) =>
    set((state) => {
      const newCategories = state.categories.filter((c) => c.id !== id);
      syncCategories(newCategories);
      return { categories: newCategories };
    }),
}));
