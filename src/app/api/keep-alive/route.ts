import { NextResponse } from "next/server";

export default async function GET(req: Request) {
  const RENDER_URL = 'https://my-waha-api-wv3j.onrender.com/health';
  const API_KEY = process.env.WAHA_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Unauthorized request footprint.' });
  }

  try {
    const response = await fetch(RENDER_URL, {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      }
    });
    if (response.ok) {
      return NextResponse.json({ status: 'Backend is awake!' });
    }
    throw new Error(`Backend responded with status: ${response.status}`);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}