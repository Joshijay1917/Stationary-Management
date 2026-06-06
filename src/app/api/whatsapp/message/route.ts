import { NextResponse } from "next/server";

const WAHA_API_URL = process.env.WAHA_API_URL || "http://localhost:3001";

if(!process.env.WAHA_API_KEY) {
    console.warn("Warning: WAHA_API_KEY is not set. WhatsApp messaging will not work.");
}

export async function POST(req: Request) {
    try {
        const { message, phone } = await req.json();

        if(!message || !phone) {
            return NextResponse.json({ error: "Missing 'message' or 'phone' in request body." }, { status: 400 });
        }

        const wahaResponse = await fetch(`${WAHA_API_URL}/api/sendText`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": process.env.WAHA_API_KEY || ''
            },
            body: JSON.stringify({
                chatId: phone,
                text: message,
                session: "default"
            }),
        });

        return NextResponse.json({ success: wahaResponse.ok });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
    }
}