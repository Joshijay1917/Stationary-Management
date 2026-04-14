"use client";

import { useState } from "react";
import {
  BookOpen,
  Pen,
  Printer,
  Package,
  ScanBarcode,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/models/Product";
import { useCartStore } from "@/store/cart-store";
import { useCategoryStore } from "@/store/category-store";
import { useInventoryStore } from "@/store/inventory-store";
import { toast } from "sonner";

type FilterCategory = "all" | string;

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const addItem = useCartStore((s) => s.addItem);

  const { categories } = useCategoryStore();
  const { products } = useInventoryStore();

  const filterTabs = [
    { key: "all", label: "All" },
    ...categories.map((c) => ({ key: c._id, label: c.label }))
  ];

  console.log("FilteredTabs:", filterTabs)

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const handleAddItem = (product: (typeof products)[0]) => {
    addItem(product);
    toast(`Added ${product.name}`, {
      description: `₹${product.price}`,
      duration: 1000,
      position: "top-center",
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Category filter tabs */}
      <div className="px-3 py-2 border-b shrink-0">
        <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab) => (
            <Button
              id={`filter-${tab.key}`}
              key={tab.key}
              variant={activeFilter === tab.key ? "default" : "outline"}
              size="sm"
              className={`shrink-0 rounded-full text-xs h-8 px-4 transition-all duration-200 ${activeFilter === tab.key ? "shadow-md" : "hover:bg-accent"
                }`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.key === "all" ? (
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Package className="h-3.5 w-3.5 mr-1.5" />
              )}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Product grid — native scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 pb-2">
          {filteredProducts.map((product) => {
            const config = categories.find((c) => c._id === product.category) || {
              label: "Unknown",
              color: "bg-gray-500",
              gradient: "from-gray-500 to-gray-600"
            };

            return (
              <button
                id={`product-${product._id}`}
                key={product._id}
                className={`
                  relative flex flex-col items-center justify-center
                  rounded-xl p-2.5 min-h-[88px]
                  bg-gradient-to-br ${config.gradient}
                  text-white
                  shadow-md hover:shadow-lg
                  transition-all duration-150
                  active:scale-95 hover:scale-[1.03]
                  cursor-pointer
                  select-none
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                `}
                onClick={() => handleAddItem(product)}
              >
                <Package className="h-5 w-5 mb-1 opacity-80" />
                <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
                  {product.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold mt-1 opacity-90 bg-black/20 rounded-full px-2 py-0.5">
                  ₹{product.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scan barcode placeholder */}
      <div className="px-3 py-2 border-t shrink-0">
        <Button
          id="scan-barcode-btn"
          variant="outline"
          className="w-full h-10 text-sm gap-2"
          onClick={() =>
            toast.info("Barcode scanner will be available in the next update!")
          }
        >
          <ScanBarcode className="h-4 w-4" />
          Scan Barcode
        </Button>
      </div>
    </div>
  );
}
