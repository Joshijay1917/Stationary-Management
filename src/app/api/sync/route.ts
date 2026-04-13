import { NextResponse } from "next/server";
import { updateDb } from "@/lib/server-db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate if it's products or sales
    if (data.products) {
      updateDb({ products: data.products });
    }
    
    if (data.sales) {
      updateDb({ sales: data.sales });
    }
    
    if (data.categories) {
      updateDb({ categories: data.categories });
    }

    return NextResponse.json({ success: true, message: "Sync successful" });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
