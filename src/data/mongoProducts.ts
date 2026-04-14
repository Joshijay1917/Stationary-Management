import { products } from "./products";

export const mongoProducts = products.map((p) => {
    // 1. Pull out the problem fields so they don't break Mongoose
    const { id, _id, category, ...cleanProduct } = p as any;

    return {
        ...cleanProduct,

        // 2. Temporarily save the category name (e.g., "Notebooks") as a label
        categoryLabel: category,

        // 🛠️ THE FIX: Provide fallback values if they are missing in the old data!
        // If it doesn't have a cost_price, fake it (e.g., 70% of the selling price)
        cost_price: p.cost_price || (p.price * 0.7),

        // If it doesn't have a short_name, just use the first 10 letters of the name
        short_name: p.short_name || p.name.substring(0, 10),

        shopId: 'shop_001'
    };
});