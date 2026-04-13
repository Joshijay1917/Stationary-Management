import { create } from "zustand";
import { CartItem } from "./cart-store";

export type Transaction = {
  id: string;
  invoiceNumber: string;
  timestamp: string; // ISO date string
  items: CartItem[];
  totalAmount: number;
  totalProfit: number;
};

type SalesState = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  // Derived helpers could be placed here or computed via hooks
};

// Sync Background Helper
const syncSales = async (transactions: Transaction[]) => {
  try {
    const today = new Date().toDateString();
    const todaysTxns = transactions.filter(
      (t) => new Date(t.timestamp).toDateString() === today
    );
    const revenue = todaysTxns.reduce((sum, t) => sum + t.totalAmount, 0);
    const count = todaysTxns.length;

    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sales: { revenue, count } }),
    });
  } catch (error) {
    console.error("Failed to sync sales:", error);
  }
};

export const useSalesStore = create<SalesState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => {
      const newTransactions = [transaction, ...state.transactions];
      syncSales(newTransactions);
      return { transactions: newTransactions };
    }),
}));
