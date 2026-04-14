"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { CartItemRow } from "./cart-item-row";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "./checkout-button";

export function CartPanel() {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </div>
          <h2 className="font-semibold text-base">Current Sale</h2>
        </div>
        {totalItems > 0 && (
          <span className="text-xs text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <Separator className="shrink-0" />

      {/* Cart Items — native scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-3">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">No items yet</p>
              <p className="text-xs mt-1">Tap an item below to start a sale</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <CartItemRow key={item.product_id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Total & Checkout */}
      {totalItems > 0 && (
        <div className="border-t bg-card px-4 py-3 space-y-3 shrink-0 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold tracking-tight tabular-nums">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <CheckoutButton totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}
