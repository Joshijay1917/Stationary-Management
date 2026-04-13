"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cart-store";
import { useCategoryStore } from "@/store/category-store";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { incrementQty, decrementQty, removeItem } = useCartStore();
  const { categories } = useCategoryStore();
  const categoryConfig = categories.find(c => c.id === item.product.category) || {
    gradient: "from-gray-500 to-gray-600"
  };
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center gap-3 py-3 px-1 group animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Category color indicator */}
      <div
        className={`w-1 h-10 rounded-full bg-gradient-to-b ${categoryConfig.gradient} shrink-0`}
      />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">
          ₹{item.product.price} each
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          id={`qty-dec-${item.product.id}`}
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => decrementQty(item.product.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">
          {item.quantity}
        </span>
        <Button
          id={`qty-inc-${item.product.id}`}
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => incrementQty(item.product.id)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Line total */}
      <span className="w-16 text-right text-sm font-semibold tabular-nums shrink-0">
        ₹{lineTotal}
      </span>

      {/* Remove button */}
      <Button
        id={`remove-${item.product.id}`}
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0 max-sm:opacity-100"
        onClick={() => removeItem(item.product.id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
