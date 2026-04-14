import mongoose, { model, models } from "mongoose";

export type Transaction = {
    _id: string;
    shop_id: string;
    invoice_number: string;
    items: CartItem[];
    total_amount: number;
    total_profit: number;
    createdAt: string;
    updatedAt: string;
};

export type CartItem = {
    product_id: string;
    name: string;
    price: number;
    cost_price: number;
    quantity: number;
};

const transactionSchema = new mongoose.Schema<Transaction>({
    shop_id: {
        type: String,
        default: 'shop_001',
        required: true
    },
    invoice_number: {
        type: String,
        required: true
    },
    items: [
        {
            product_id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            cost_price: { type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    total_amount: {
        type: Number,
        required: true
    },
    total_profit: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Transaction = models.Transaction || model('Transaction', transactionSchema)

export default Transaction