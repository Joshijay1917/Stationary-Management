import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const RENDER_URL = 'https://my-waha-api-wv3j.onrender.com/api/version';
  const API_KEY = process.env.WAHA_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Unauthorized request footprint.' }, { status: 401 });
  }

  try {
    const response = await fetch(RENDER_URL, {
      method: 'GET',
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}