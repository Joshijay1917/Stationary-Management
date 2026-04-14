import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Category from '@/models/Category';

// 1. GET: Fetch all categories for the MVP shop
export async function GET() {
    try {
        await connectToDatabase();
        // Hardcoding 'shop_001' for our MVP strategy!
        const categories = await Category.find({ shop_id: 'shop_001' }).sort({ createdAt: -1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// 2. POST: Create a new category
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Force the shopId to guarantee data isolation
        const newCategory = await Category.create({
            ...body,
            shop_id: 'shop_001'
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

// 3. PUT: Update an existing category
export async function PUT(request: Request) {
    try {
        await connectToDatabase();

        // Grab the ID from the URL (e.g., /api/categories?id=123)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            body,
            { new: true } // This tells Mongoose to return the updated document, not the old one
        );

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// 4. DELETE: Remove a category
export async function DELETE(request: Request) {
    try {
        await connectToDatabase();

        // Grab the ID from the URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });

        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}