"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryStore } from "@/store/category-store";
import { AVAILABLE_COLORS } from "@/data/categories";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useInventoryStore } from "@/store/inventory-store";
import { Category } from "@/models/Category";

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryManager({ open, onOpenChange }: CategoryManagerProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { products } = useInventoryStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(AVAILABLE_COLORS[0].color);
  const [newGradient, setNewGradient] = useState(AVAILABLE_COLORS[0].gradient);

  const resetForm = () => {
    setEditingId(null);
    setNewLabel("");
    setNewColor(AVAILABLE_COLORS[0].color);
    setNewGradient(AVAILABLE_COLORS[0].gradient);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat._id);
    setNewLabel(cat.label);
    setNewColor(cat.color);
    setNewGradient(cat.gradient);
  };

  const handleDelete = (id: string, label: string) => {
    // Check for orphaned items
    const inUse = products.some((p) => p.category === id);
    if (inUse) {
      toast.error(`Cannot delete ${label}. Reassign its products first.`);
      return;
    }
    deleteCategory(id);
    toast.success(`Category ${label} deleted`);
  };

  const handleSave = () => {
    if (!newLabel) {
      toast.error("Category label cannot be empty");
      return;
    }

    if (editingId) {
      updateCategory(editingId, {
        label: newLabel,
        color: newColor || "bg-gray-500",
        gradient: newGradient || "from-gray-500 to-gray-600",
      });
      toast.success("Category updated");
    } else {
      addCategory({
        label: newLabel,
        color: newColor || "bg-gray-500",
        gradient: newGradient || "from-gray-500 to-gray-600",
      });
      toast.success("New product category created");
    }
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="font-medium text-sm">{cat.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(cat)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(cat._id, cat.label)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-3">
              {editingId ? "Edit Category" : "Add New Category"}
            </h4>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Category Label</Label>
                <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Art Supplies" />
              </div>
              <div className="grid gap-2 mt-2">
                <Label>Category Color</Label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {AVAILABLE_COLORS.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setNewColor(c.color);
                        setNewGradient(c.gradient);
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${newColor === c.color ? "ring-2 ring-ring ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                      aria-label={`Select color ${c.color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button onClick={handleSave} className="w-full gap-2">
                  {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingId ? "Save Changes" : "Create Category"}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
