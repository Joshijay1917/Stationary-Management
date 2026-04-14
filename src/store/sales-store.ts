import { withOptimisticSync } from "@/lib/optimisticSync";
import { Transaction } from "@/models/Transactions";
import { create } from "zustand";

type DashboardMetrics = {
  revenue: number;
  profit: number;
  count: number;
};

type TransactionState = {
  transactions: Transaction[];
  isLoading: boolean;

  // Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<void>;

  // 🚀 The Magic: Derived Helper Function right in the store!
  getTodayMetrics: () => DashboardMetrics;
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  // 1. INITIAL LOAD
  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      set({ transactions: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      set({ isLoading: false });
    }
  },

  // 2. OPTIMISTIC ADD (The Checkout Process)
  addTransaction: async (transactionData) => {
    const tempId = Date.now().toString();
    const tempDate = new Date().toISOString(); // Fake a creation date for the UI

    const optimisticTxn = {
      ...transactionData,
      _id: tempId,
      createdAt: tempDate
    } as Transaction;

    const previous = get().transactions;

    // Instant UI Update: Add the new receipt to the TOP of the list
    set({ transactions: [optimisticTxn, ...previous] });

    // Background Sync
    await withOptimisticSync(
      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      }),
      () => set({ transactions: previous }), // Rollback
      (realTxn) => set((state) => ({ // Swap temp ID for real Mongoose document
        transactions: state.transactions.map((t) => (t._id === tempId ? realTxn : t)),
      }))
    );
  },

  // 3. DASHBOARD CALCULATOR
  // This replaces your old syncSales function! It runs instantly on the client.
  getTodayMetrics: () => {
    const transactions = get().transactions;
    const today = new Date().toDateString();

    // 1. Filter for only today's sales
    const todaysTxns = transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );

    // 2. Crunch the numbers
    const revenue = todaysTxns.reduce((sum, t) => sum + t.total_amount, 0);
    const profit = todaysTxns.reduce((sum, t) => sum + t.total_profit, 0);
    const count = todaysTxns.length;

    return { revenue, profit, count };
  }
}));