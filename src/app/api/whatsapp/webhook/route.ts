import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { checkStock, getLowStock, listCategoryItems, getTodaySales } from "@/lib/server-db";
import { SYS_PROMPT } from "@/lib/system_prompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const OWNER_PHONE = (process.env.OWNER_PHONE_NUMBERS || "").split(",");
const WAHA_API_URL = process.env.WAHA_API_URL || "http://localhost:3001";
const chatMemoryHistory = new Map();

// Define the precise tools available to Gemini
const checkStockTool = {
  name: "check_stock",
  description: "Search for a specific product and return its remaining stock level and price.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      item_name: { type: Type.STRING, description: "Name of the stationary item to search for." }
    },
    required: ["item_name"],
  }
};

const getLowStockTool = {
  name: "get_low_stock",
  description: "Find all products that have a stock level at or below the provided threshold.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      threshold: { type: Type.NUMBER, description: "The maximum stock amount to check for (e.g. 10)." }
    },
    required: ["threshold"],
  }
};

const listCategoryTool = {
  name: "list_category",
  description: "Get all available products in a specific category.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category_name: { type: Type.STRING, description: "Category name (e.g. 'notebooks', 'pens', 'printouts', 'accessories')." }
    },
    required: ["category_name"],
  }
};

const getSalesTool = {
  name: "get_today_revenue",
  description: "Get the total completed revenue and number of orders processed today.",
  parameters: {
    type: Type.OBJECT,
    properties: {}, // No params needed
  }
};

// Zod-like response structure for Gemini to guarantee standard format
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "The exact WhatsApp text to send back to the user. MUST be formatted gracefully in Gujarati mixed with English (Gujlish). Never use markdown bolding like **. Use plain spaces or bullet points for lists."
    }
  },
  required: ["reply"],
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("WAHA Hit Webhook: ", data);

    // WAHA event payload structure
    const payload = data.payload || data;
    const sender = payload.from;
    const body = payload.body;

    // Security Whitelist Filter (Only allow the boss!)
    if (!sender) return NextResponse.json({ success: true, reason: "No sender info" });

    const isAuthorized = OWNER_PHONE.some((num) => sender.includes(num.trim()));

    // Ignore internal broadcast or groups / other messages
    if (OWNER_PHONE && !isAuthorized) {
      console.log(`[Blocked] Unauthorized sender: ${sender}`);
      return NextResponse.json({ success: true, reason: "Unauthorized" });
    }

    if (!body || payload.fromMe) {
      return NextResponse.json({ success: true, reason: "Ignoring my own logic/empty body." });
    }

    // Prepare Chat execution
    // Note: For a true prototype we instantiate the chat session fresh.
    const existingHistory = chatMemoryHistory.get(sender) || [];
    const chat = ai.chats.create({
      // model: "gemini-2.0-flash",
      model: "gemma-4-31b-it",
      history: existingHistory,
      config: {
        systemInstruction: SYS_PROMPT,
        tools: [{
          functionDeclarations: [checkStockTool, getLowStockTool, listCategoryTool, getSalesTool]
        }],
        // responseSchema: responseSchema,
        // responseMimeType: "application/json",
      }
    });

    // Send Message allowing Tool Executions
    let response = await chat.sendMessage({ message: body });

    // Handle Function calling loop if LLM requested it
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const call of response.functionCalls) {
        let result: any = null;

        if (call.name === "check_stock") {
          const args = call.args as { item_name: string };
          result = await checkStock(args.item_name);
        } else if (call.name === "get_low_stock") {
          const args = call.args as { threshold: number };
          result = await getLowStock(args.threshold || 10);
        } else if (call.name === "list_category") {
          const args = call.args as { category_name: string };
          result = await listCategoryItems(args.category_name);
        } else if (call.name === "get_today_revenue") {
          result = await getTodaySales();
        }

        // Send tool response back to Gemini to compute final answer
        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: call.name,
              response: { result: result || "Not found" }
            }
          }] as any
        });
      }
    }

    // Extract the final formatted Gujlish message
    let replyText = "Sorry, hu samji na sakyo.";
    const rawText = response.text || replyText;
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.reply) replyText = parsed.reply;
    } catch {
      replyText = rawText;
    }

    const updatedHistory = await chat.getHistory();
    chatMemoryHistory.set(sender, updatedHistory);
    // Emit the reply fully back to WAHA to send the real WhatsApp chat!
    const wahaResponse = await fetch(`${WAHA_API_URL}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.WAHA_API_KEY || ''
      },
      body: JSON.stringify({
        chatId: sender,
        text: replyText,
        session: "default"
      }),
    });

    // const wahaData = await wahaResponse.json();
    // console.log("WAHA Send Status:", wahaResponse.status, wahaData);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
