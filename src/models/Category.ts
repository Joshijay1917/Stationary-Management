import mongoose, { model, models } from "mongoose";

export type Category = {
    _id: string;
    shop_id: string;
    label: string;
    color: string;
    gradient: string;
    createdAt: string;
    updatedAt: string;
};

const categorySchema = new mongoose.Schema<Category>({
    shop_id: {
        type: String,
        default: 'shop_001',
        required: true
    },
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    gradient: {
        type: String
    }
}, { timestamps: true })

const Category = models.Category || model('Category', categorySchema)

export default Category