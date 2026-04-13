"use client";

import { useState } from "react";
import { NavigationHeader } from "@/components/navigation-header";
import { useSalesStore, Transaction } from "@/store/sales-store";
import { Search, Eye, Download, FileText, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceDialog } from "@/components/invoices/invoice-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function InvoicesPage() {
  const { transactions } = useSalesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Derive filtered invoices
  const filteredInvoices = transactions.filter((txn) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const dateStr = new Date(txn.timestamp).toLocaleDateString().toLowerCase();
    
    return (
      txn.invoiceNumber.toLowerCase().includes(query) ||
      txn.id.toLowerCase().includes(query) ||
      dateStr.includes(query)
    );
  });

  const openInvoice = (txn: Transaction) => {
    setSelectedTxn(txn);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <NavigationHeader />

      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Browse, reprint, or download past checkout receipts.
            </p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoice # or date..."
                className="pl-8 bg-muted/50 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0" title="Filter options">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {filteredInvoices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl shrink-0">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm">Complete a sale in Checkout to generate an invoice.</p>
          </div>
        ) : (
          <Card className="flex-1 flex flex-col min-h-0 border-none shadow-md overflow-hidden bg-card/50">
            <CardContent className="p-0 flex flex-col h-full min-h-0">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-auto flex-1">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[180px]">Invoice No.</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((txn) => (
                      <TableRow key={txn.id} className="hover:bg-muted/30 group">
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-500">
                          {txn.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{new Date(txn.timestamp).toLocaleDateString()}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{txn.items.length}</TableCell>
                        <TableCell className="text-right font-bold tracking-tight">
                          ₹{txn.totalAmount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openInvoice(txn)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Invoice</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List */}
              <div className="sm:hidden flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                {filteredInvoices.map((txn) => (
                  <div 
                    key={txn.id} 
                    className="bg-card p-4 rounded-xl shadow-sm border flex flex-col gap-3 active:scale-95 transition-transform"
                    onClick={() => openInvoice(txn)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-600 dark:text-emerald-500">
                        {txn.invoiceNumber}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
                        {new Date(txn.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>{txn.items.length} items purchased</p>
                        <p>{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span className="font-bold text-lg tabular-nums">
                        ₹{txn.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </main>

      <InvoiceDialog 
        transaction={selectedTxn}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
