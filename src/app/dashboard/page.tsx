"use client";

import { NavigationHeader } from "@/components/navigation-header";
import { useSalesStore } from "@/store/sales-store";
import { useInventoryStore } from "@/store/inventory-store";
import { 
  TrendingUp, 
  IndianRupee, 
  PackageMinus, 
  ArrowUpRight, 
  AlertTriangle,
  History,
  ShoppingBag
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const { transactions } = useSalesStore();
  const { products } = useInventoryStore();

  // Metrics Logic
  const today = new Date().toDateString();
  const todaysTxns = transactions.filter(
    (t) => new Date(t.timestamp).toDateString() === today
  );

  const todayRevenue = todaysTxns.reduce((sum, t) => sum + t.totalAmount, 0);
  const todayProfit = todaysTxns.reduce((sum, t) => sum + t.totalProfit, 0);
  
  const lowStockItems = products.filter((p) => p.stock < 10);

  // Compute Top Selling Items
  const itemSalesCount: Record<string, { name: string; qty: number; revenue: number }> = {};
  transactions.forEach((t) => {
    t.items.forEach((item) => {
      const id = item.product.id;
      if (!itemSalesCount[id]) {
        itemSalesCount[id] = { name: item.product.shortName, qty: 0, revenue: 0 };
      }
      itemSalesCount[id].qty += item.quantity;
      itemSalesCount[id].revenue += item.quantity * item.product.price;
    });
  });

  const topItems = Object.values(itemSalesCount).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <NavigationHeader />

      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard overview</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Performance metrics, recent sales, and stock alerts.
            </p>
          </div>
        </div>

        {/* Hero KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">₹{todayRevenue.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  ₹{todayProfit.toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{todaysTxns.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className={lowStockItems.length > 0 ? "border-amber-500/50 bg-amber-500/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-500">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
                  {lowStockItems.length}
                </span>
                <span className="text-sm text-muted-foreground">items</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Feed */}
          <Card className="lg:col-span-4 flex flex-col min-h-0 border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Sales
              </CardTitle>
              <CardDescription>Review the latest transactions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-6 pb-6">
              {transactions.length === 0 ? (
                <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground text-sm">No sales recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {transactions.slice(0, 50).map((txn) => (
                    <div key={txn.id} className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {txn.items.map(i => `${i.quantity}x ${i.product.shortName}`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums">₹{txn.totalAmount}</p>
                        <p className="text-[10px] text-emerald-500 font-medium">Profit ₹{Math.floor(txn.totalProfit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side panels */}
          <div className="lg:col-span-3 space-y-6 flex flex-col min-h-0">
            {/* Top items */}
            <Card className="flex-1 border-none shadow-md overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Top Selling Items
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {topItems.length === 0 ? (
                   <p className="text-sm text-muted-foreground py-4 text-center">No data available.</p>
                ) : (
                  <div className="space-y-5">
                    {topItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.qty} units sold</p>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">₹{item.revenue.toLocaleString("en-IN")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Low stock preview */}
            {lowStockItems.length > 0 && (
              <Card className="border-amber-500/30">
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                    <PackageMinus className="h-5 w-5" />
                    Action Needed: Restock
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="py-4 max-h-[200px] overflow-y-auto">
                  <div className="space-y-3">
                    {lowStockItems.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.shortName}</span>
                        <span className="text-amber-600 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                          {item.stock} left
                        </span>
                      </div>
                    ))}
                    {lowStockItems.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        + {lowStockItems.length - 5} more items
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
