"use client";

import { CartPanel } from "@/components/checkout/cart-panel";
import { ProductGrid } from "@/components/checkout/product-grid";
import { NavigationHeader } from "@/components/navigation-header";

export default function CheckoutPage() {
  return (
    <div className="flex flex-col h-dvh max-h-dvh overflow-hidden bg-background">
      <NavigationHeader />

      {/* Mobile layout: stacked vertically */}
      {/* Desktop layout: side by side */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Cart Panel - Top on mobile, Left sidebar on desktop */}
        <div className="h-[38dvh] lg:h-full lg:w-[380px] xl:w-[420px] border-b lg:border-b-0 lg:border-r bg-card/50 shrink-0 flex flex-col">
          <CartPanel />
        </div>

        {/* Product Grid - Bottom on mobile, Main area on desktop */}
        <div className="flex-1 min-h-0 flex flex-col">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
