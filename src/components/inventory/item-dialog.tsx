"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import { useCategoryStore } from "@/store/category-store";
import { Barcode, CheckCircle2 } from "lucide-react";
import { useInventoryStore } from "@/store/inventory-store";
import { toast } from "sonner";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Product | null;
}

export function ItemDialog({ open, onOpenChange, defaultValues }: ItemDialogProps) {
  const isEditing = !!defaultValues;
  const { addItem, updateItem } = useInventoryStore();

  const { categories } = useCategoryStore();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [category, setCategory] = useState<string>("notebooks");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [generatingBarcode, setGeneratingBarcode] = useState(false);

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        setName(defaultValues.name);
        setShortName(defaultValues.shortName);
        setCategory(defaultValues.category);
        setPrice(String(defaultValues.price));
        setCostPrice(String(defaultValues.costPrice || ""));
        setStock(String(defaultValues.stock));
      } else {
        setName("");
        setShortName("");
        setCategory(categories.length > 0 ? categories[0].id : "");
        setPrice("");
        setCostPrice("");
        setStock("");
      }
      setGeneratingBarcode(false);
    }
  }, [open, defaultValues]);

  const handleSave = () => {
    if (!name || !shortName || !price || !costPrice || !stock) {
      toast.error("Please fill all fields");
      return;
    }

    const payload: Product = {
      id: isEditing ? defaultValues!.id : `item-${Date.now()}`,
      name,
      shortName,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
    };

    if (isEditing) {
      updateItem(payload.id, payload);
      toast.success("Item updated successfully");
    } else {
      addItem(payload);
      toast.success("New item added to inventory");
    }

    onOpenChange(false);
  };

  const handleGenerateBarcode = () => {
    setGeneratingBarcode(true);
    // Simulate generation time to feel "enterprise-y"
    setTimeout(() => {
      setGeneratingBarcode(false);
      toast.info("Barcode generated internally.", {
        icon: <CheckCircle2 className="text-green-500 h-4 w-4" />
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Classmate 200pg Notebook"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shortName">Short Name (for POS grid)</Label>
            <Input
              id="shortName"
              placeholder="e.g. Classmate 200pg"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val || "")}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (₹)</Label>
              <Input
                id="costPrice"
                type="number"
                placeholder="30"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="45"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Initial Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* Premium "Enterprise" feature dummy logic */}
          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="outline"
              className="w-full gap-2 text-muted-foreground border-dashed border-2"
              onClick={handleGenerateBarcode}
              disabled={generatingBarcode}
            >
              <Barcode className="h-4 w-4" />
              {generatingBarcode ? "Generating..." : "Generate Barcode (Auto)"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Save Changes" : "Create Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
