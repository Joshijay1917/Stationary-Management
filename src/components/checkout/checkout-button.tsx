"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useSalesStore } from "@/store/sales-store";
import { useInventoryStore } from "@/store/inventory-store";
import { toast } from "sonner";

interface CheckoutButtonProps {
  totalPrice: number;
}

export function CheckoutButton({ totalPrice }: CheckoutButtonProps) {
  const { clearCart, getTotalItems, items } = useCartStore();
  const { addTransaction } = useSalesStore();
  const { updateStock } = useInventoryStore();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const itemCount = totalItems;
    const price = totalPrice;

    // Calculate total profit margin
    const totalProfit = items.reduce((acc, item) => {
      const margin = (item.product.price - item.product.costPrice) * item.quantity;
      return acc + margin;
    }, 0);

    // 1. Log transaction
    const now = Date.now();
    const invoiceNumber = `INV-${now.toString().slice(-6)}`;
    
    addTransaction({
      id: `txn-${now}`,
      invoiceNumber,
      timestamp: new Date().toISOString(),
      items: [...items],
      totalAmount: price,
      totalProfit,
    });

    // 2. Deduct all bought items from the real inventory
    items.forEach((item) => {
      updateStock(item.product.id, -item.quantity);
    });

    // 3. Reset Cart
    clearCart();

    toast.success("Sale Recorded!", {
      description: `${itemCount} item${itemCount !== 1 ? "s" : ""} — ₹${price.toLocaleString("en-IN")}`,
      duration: 500,
    });
  };

  return (
    <Button
      id="complete-sale-btn"
      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
      onClick={handleCheckout}
      disabled={totalItems === 0}
    >
      <Check className="h-5 w-5 mr-2" />
      Complete Sale — ₹{totalPrice.toLocaleString("en-IN")}
    </Button>
  );
}
