import mongoose, { Schema, model, models } from 'mongoose';

export type Product = {
    _id: string;
    shop_id: string;
    name: string;
    short_name: string;
    price: number;
    category: string; // Links to Category.id
    stock: number;
    cost_price: number;
    createdAt: string;
    updatedAt: string;
};

const ProductSchema = new Schema<Product>({
    // The secret weapon: Default shop ID for Customer #1
    shop_id: { type: String, default: 'shop_001', required: true },

    name: { type: String, required: true },
    short_name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    cost_price: { type: Number, required: true },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt!
});

// Next.js hot-reloading trick: Check if model exists before creating it
const Product = models.Product || model('Product', ProductSchema);

export default Product;