"use client";

import { useState } from "react";
import { NavigationHeader } from "@/components/navigation-header";
import { Search, Plus, ListTree } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventoryStore } from "@/store/inventory-store";
import { useCategoryStore } from "@/store/category-store";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { ItemDialog } from "@/components/inventory/item-dialog";
import { CategoryManager } from "@/components/inventory/category-manager";

type FilterCategory = "all" | string;

export default function InventoryPage() {
  const { products } = useInventoryStore();
  const { categories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  const filterTabs = [
    { id: "all", label: "All Items" },
    ...categories.map(c => ({ id: c.id, label: c.label }))
  ];

  // Derive filtered products
  const displayedProducts = products.filter((product) => {
    // 1. Text match (Case-insensitive fuzzy match)
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category match
    const matchesCategory =
      activeFilter === "all" || product.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <NavigationHeader />

      <main className="flex-1 container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Page Header Area */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock Inventory</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your products, prices, and stock levels.
            </p>
          </div>
          <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-4">
            <Button variant="outline" onClick={() => setCategoryManagerOpen(true)} className="gap-2 w-full sm:w-auto">
              <ListTree className="h-4 w-4" />
              Categories
            </Button>
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2 shrink-0 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Item
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-3 sm:p-4 rounded-xl shadow-sm border">

          {/* Fuzzy Search Bar */}
          <div className="relative w-full lg:max-w-md shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              className="pl-9 bg-background focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 w-full scrollbar-hide shrink-0">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "outline"}
                size="sm"
                className={`rounded-full shrink-0 h-9 transition-colors ${activeFilter === tab.id ? "shadow-md" : "hover:bg-accent/50 text-muted-foreground"
                  }`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Master Data Table */}
        <InventoryTable products={displayedProducts} />
      </main>

      <ItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultValues={null} /* null implies "Add Mode" */
      />

      <CategoryManager
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
      />
    </div>
  );
}
