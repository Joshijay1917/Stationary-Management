import fs from "fs";
import path from "path";
import { products as initialProducts, Product } from "@/data/products";
import { initialCategories, Category } from "@/data/categories";

const dbPath = path.join(process.cwd(), "local-db.json");

// Structure of our mock DB
interface Database {
  products: Product[];
  categories: Category[];
  sales: { revenue: number; count: number }; // Aggregated for prototype
}

// Initialize file if not exists
const initDb = () => {
  if (!fs.existsSync(dbPath)) {
    const initialData: Database = {
      products: initialProducts,
      categories: initialCategories,
      sales: { revenue: 0, count: 0 },
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

export const getDb = (): Database => {
  initDb();
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
};

export const updateDb = (data: Partial<Database>) => {
  const current = getDb();
  const updated = { ...current, ...data };
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2));
};

// AI Helper Functions
export const checkStock = (itemName: string) => {
  const db = getDb();
  return db.products.filter((p: Product) => 
    p.name.toLowerCase().includes(itemName.toLowerCase()) || 
    p.shortName.toLowerCase().includes(itemName.toLowerCase())
  );
};

export const getLowStock = (threshold: number) => {
  const db = getDb();
  return db.products.filter((p: Product) => p.stock <= threshold);
};

export const listCategoryItems = (categoryName: string) => {
  const db = getDb();
  const cat = db.categories.find((c: Category) => c.label.toLowerCase() === categoryName.toLowerCase() || c.id.toLowerCase() === categoryName.toLowerCase());
  if (!cat) return [];
  return db.products.filter((p: Product) => p.category === cat.id);
};

export const getTodaySales = () => {
  const db = getDb();
  return db.sales;
};
