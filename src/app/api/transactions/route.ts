import connectToDatabase from '@/lib/dbConnect';
import Transaction from '@/models/Transactions';
import { NextResponse } from 'next/server';

// 1. GET: Fetch all past receipts for the Dashboard
export async function GET() {
    try {
        await connectToDatabase();

        // Fetch only Customer 1's receipts, and sort by newest first (-1)
        const transactions = await Transaction.find({ shop_id: "shop_001" }).sort({ createdAt: -1 });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('GET Transaction Error:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

// 2. POST: The Checkout Button! Save the snapshot.
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Create the receipt and lock it to this specific shop
        const newTransaction = await Transaction.create({
            ...body,
            shopId: 'shop_001'
        });

        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error('POST Transaction Error:', error);
        return NextResponse.json({ error: 'Failed to save transaction' }, { status: 500 });
    }
}

// 3. DELETE: For voiding receipts or clearing your test data
export async function DELETE(request: Request) {
    try {
        await connectToDatabase();

        // Grab the ID from the URL (e.g., /api/transactions?id=123)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Transaction voided successfully' });
    } catch (error) {
        console.error('DELETE Transaction Error:', error);
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}