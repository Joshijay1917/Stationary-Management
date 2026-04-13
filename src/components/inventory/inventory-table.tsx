"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/data/products";
import { useCategoryStore } from "@/store/category-store";
import { StockIndicator } from "./stock-indicator";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Plus, Minus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInventoryStore } from "@/store/inventory-store";
import { ItemDialog } from "./item-dialog";
import { toast } from "sonner";

interface InventoryTableProps {
  products: Product[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  const { updateStock, deleteItem } = useInventoryStore();
  const { categories } = useCategoryStore();
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingItem(product);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    deleteItem(id);
    toast.error(`Deleted ${name} from inventory`);
  };

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px] sm:w-[300px]">Product</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const config = categories.find((c) => c.id === product.category) || {
                  label: "Unknown",
                  color: "bg-gray-500",
                  gradient: "from-gray-500 to-gray-600",
                };

                return (
                  <TableRow key={product.id} className="group transition-colors relative">
                    {/* Name column */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${config.gradient} shrink-0`}
                        />
                        <div className="min-w-0">
                          <p className="truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden tracking-tight">
                            {config.label}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category column (Desktop only) */}
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.color} text-white shadow-sm`}
                      >
                        {config.label}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-semibold tabular-nums">
                      ₹{product.price}
                    </TableCell>

                    {/* Stock Level w/ Adjusters */}
                    <TableCell>
                      <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        {/* Status Badge */}
                        <div className="w-[110px]">
                          <StockIndicator stock={product.stock} />
                        </div>
                        {/* Current Stock + Quick Adjuster */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold tabular-nums min-w-[28px] xl:text-right">
                            {product.stock}
                          </span>
                          <div className="flex items-center rounded-md border shadow-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none rounded-l-md border-r hover:bg-muted focus-visible:ring-0 focus-visible:bg-muted"
                              onClick={() => updateStock(product.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none rounded-r-md hover:bg-muted focus-visible:ring-0 focus-visible:bg-muted"
                              onClick={() => updateStock(product.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 p-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        defaultValues={editingItem}
      />
    </>
  );
}
