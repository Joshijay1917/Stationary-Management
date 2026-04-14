import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import Category from '@/models/Category';

// 1. Import your RAW data directly (ignore mongoProducts.ts)
import { products as rawProducts } from '@/data/products';
import { initialCategories } from '@/data/categories'; // Adjust this import path!
import connectToDatabase from '@/lib/dbConnect';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Wipe the old test data for Customer #1
    await Product.deleteMany({ shopId: 'shop_001' });
    await Category.deleteMany({ shopId: 'shop_001' });

    // 2. Insert Categories FIRST, forcing the shopId
    const categoriesToInsert = initialCategories.map((cat: any) => {
      // Extract the bad string IDs and leave them behind!
      const { id, _id, ...cleanCategory } = cat;

      return {
        ...cleanCategory,
        shopId: 'shop_001'
      };
    });
    const insertedCategories = await Category.insertMany(categoriesToInsert);

    // 3. Map the RAW products to match Mongoose STRICTLY
    const productsToInsert = rawProducts.map((p: any) => {

      // Find the real MongoDB Category document we just created
      const matchingCategory = insertedCategories.find(
        (c) => c.label.toLowerCase() === p.category.toLowerCase()
      );

      // If a category somehow doesn't match, fallback to the first category's ID
      // This prevents the empty string `""` crash!
      const finalCategoryId = matchingCategory
        ? matchingCategory._id
        : insertedCategories[0]._id;

      return {
        name: p.name,
        // The Fallbacks to satisfy Mongoose requirements!
        short_name: p.short_name || p.name.substring(0, 10),
        price: p.price,
        cost_price: p.cost_price || (p.price * 0.7), // Fake cost price if missing
        stock: p.stock || 0,
        color: p.color || '#4F46E5',
        shopId: 'shop_001',
        category: finalCategoryId // The real, valid ObjectId!
      };
    });

    // 4. Insert the perfectly formatted Products
    await Product.insertMany(productsToInsert);

    return NextResponse.json({ message: 'Database synced perfectly with relational IDs!' });
  } catch (error) {
    console.error("SYNC ERROR:", error);
    return NextResponse.json({ error: 'Failed to sync database' }, { status: 500 });
  }
}