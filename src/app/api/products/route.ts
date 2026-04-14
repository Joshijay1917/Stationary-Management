import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Product from '@/models/Product';

// 1. GET: Fetch all products for the MVP shop
export async function GET() {
    try {
        await connectToDatabase();

        // Fetch products only for our first customer! 
        // Sorting by createdAt ensures newest items appear at the top.
        const products = await Product.find({ shop_id: 'shop_001' }).sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        console.error('GET Product Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// 2. POST: Add a new product to inventory
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Security Guard: Force the shopId so Customer 1's data is isolated
        const newProduct = await Product.create({
            ...body,
            shop_id: 'shop_001'
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('POST Product Error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

// 3. PUT: Update an existing product (Also handles Stock Updates!)
export async function PUT(request: Request) {
    try {
        await connectToDatabase();

        // Grab the ID from the URL (e.g., /api/products?id=64a1b2c3...)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // { new: true } returns the updated document, which Zustand needs to replace the temporary ID
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('PUT Product Error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// 4. DELETE: Remove a product from inventory
export async function DELETE(request: Request) {
    try {
        await connectToDatabase();

        // Grab the ID from the URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('DELETE Product Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}