# Progress Tracker

- Use SOLID Principle

| SDLC Step | Status |
|---|---|
| Step 1: Initial Requirements | ✅ Done |
| Step 2: Quick Design (Prototype UI) | ✅ Done — Screen 1, 2, 3 complete |
| Step 3: User Evaluation | ⬜ Next — Hand phone to shop owner |
| Step 4: Refinement | ⬜ Pending — Wire up MongoDB + backend |

---

# 1. Essential Features for the Prototype
To prove this works to the shop owner, you only need three screens. Do not build anything else until these are perfect:

## Screen 1: The POS Checkout (Mobile-First) Path /checkout — ✅ DONE

> **Built with:** Next.js 16 + Tailwind v4 + shadcn/ui + Zustand + Sonner + Lucide React + next-themes
>
> **What's working:**
> - ✅ Quick-Tap Grid: 22 products in 4 categories (Notebooks, Pens, Printouts, Accessories) with colorful gradient buttons
> - ✅ Category filter tabs (All / Notebooks / Pens / Printouts / Accessories)
> - ✅ Live Cart: Real-time item list with +/- quantity controls, line totals, and trash button
> - ✅ Dynamic total price (formatted in ₹ INR)
> - ✅ "Complete Sale" button with Sonner toast confirmation
> - ✅ Dark/Light theme toggle
> - ✅ Fully responsive: stacked layout on mobile, side-by-side on desktop
> - ✅ Barcode scanner placeholder button
> - ⚠️ Uses dummy data (hardcoded arrays) — no real database yet

## Screen 2: Inventory Management (CRUD) Path /inventory — ✅ DONE
To make this look like a premium ₹10,000 product, you need more than just a table. Use shadcn/ui Data Table components to give it a professional, polished feel.

**The Master Data Table:**

- Columns: Product Name, Category, Price, Current Stock, Action Buttons (Edit/Delete).

- Search Bar: A real-time fuzzy search input at the top. When the owner types "Cello", the table instantly filters. This proves the software is fast.

- Category Tabs/Badges: Quick filters just like the checkout screen (All / Notebooks / Pens / Printouts).

**Smart Indicators (The Visual Hook):**

- Danger (Red): Items below 10 stock get a bright red "Low Stock" badge and a warning icon.

- Warning (Yellow): Items between 10-20 stock get a yellow "Reorder Soon" badge.

- Safe (Green): Normal stock levels.

**The "Add/Edit Item" Modal (shadcn/ui Dialog):**

- A clean popup form with inputs for Name, Category (dropdown), Price, and Initial Stock.

- Pro-Tip for Demo: Add a "Generate Barcode" placeholder button inside this modal. You don't have to build the logic yet, but seeing that button makes the software feel enterprise-grade.

- Quick-Adjust Buttons: Next to the stock number in the table, add tiny + and - buttons for rapid stock corrections without opening the full edit modal.

**Category Management (Inside Inventory Page):**

> Categories are currently hardcoded (Notebooks, Pens, Printouts, Accessories). To let the owner add new product lines (e.g., "Art Supplies", "Exam Pads"), category CRUD lives inside the Inventory page.

- A "Manage Categories" button/tab at the top of the Inventory page opens a panel or section.

- Each category has: Name, Color/Gradient (for the POS grid buttons and table badges), and a Label.

- Owner can Add, Edit (rename/recolor), or Delete categories.

- Deleting a category should warn if products exist under it (prevent orphaned items or force reassignment).

- All other screens pull from this dynamic list:
  - Checkout: Category filter tabs and product button gradients.
  - Inventory: Filter tabs, table badges, and the Add/Edit Item dropdown.
  - Dashboard: Category-based analytics (future).

## Screen 3: The Mini-Dashboard Path /dashboard — ✅ DONE
The dashboard is where you sell the business value. This screen isn't for the cashier; it is strictly for the owner to feel in control of their money.

**The Hero Metrics (shadcn/ui Cards):**

- "Today's Revenue" Counter: Displayed in a massive, bold green font (e.g., ₹4,250).

- "Total Items Sold Today" Counter: To show volume.

- "Total Profit Today" (Optional but killer): If you add a "cost price" to your dummy data, showing them their actual daily profit will blow them away.

**The "Action Needed" Panel:**

- A dedicated card titled "Needs Restocking". Instead of making them hunt through the inventory table, this card instantly lists the top 5 items that are critically low (e.g., "Apsara Pencils - 2 left").

**Recent Transactions Feed:**

- A scrolling list of the last 5-10 sales made on the /checkout screen.

- Format: Time: 11:45 AM | Items: 3 | Total: ₹145.

**Top Selling Item:**

- A small highlight card showing what is moving the fastest today (e.g., "🔥 Hot Item: Classmate Notebook 200pg - 14 sold").

## Screen 4: Stock Check via WhatsApp (Owner-Only, AI-Powered) — 🆕 NEW

> **⚠️ Note:** The entire website is behind owner login. Only the authenticated shop owner can access any screen. This WhatsApp feature extends that — only the owner's verified phone number can use it.

> **Concept:** The shop owner can check stock, prices, and business stats (like today's revenue) directly from WhatsApp without opening the app. They text naturally, Gemini API understands the query, calls tools to talk to the database, and replies with real data. Conversation history is maintained so follow-up questions work naturally.

### How it works:

- Owner sends a WhatsApp message → **Webhook** (Next.js API route) receives it
- Only the **owner's phone number** is authorized (all others are ignored)
- Message + **conversation history** are sent to **Gemini API**
- Gemini uses **tool calling** to query the live MongoDB database:
  - `check_stock(item_name)` → Stock count + price for a specific product
  - `list_category(category)` → All items in a category (notebooks / pens / printouts / accessories)
  - `get_today_revenue()` → Total sales revenue for today
  - `get_low_stock_items(threshold)` → Items with stock below threshold
  - `search_items(query)` → Fuzzy search across all 22 products
- Gemini processes tool results and sends a human-friendly reply back via WhatsApp

### Example Conversations (using actual products):

```
Owner: "ketli pen baki che?"
Bot: "tamari pase 8 type na pens che:
  • S-Pen Blue — 200 pcs (₹10)
  • S-Pen Black — 180 pcs (₹10)
  • S-Pen Red — 120 pcs (₹10)
  • Cello Butterflow — 100 pcs (₹20)
  • Reynolds 045 — 150 pcs (₹12)
  • Natraj Pencil — 300 pcs (₹5)
  • Apsara Pencil — 280 pcs (₹5)
  • Highlighter — 90 pcs (₹20)
koy ek pen nu kyo?"

Owner: "cello butterflow ketli baki che?"
Bot: "Cello Butterflow: 100 pieces in stock @ ₹20 each."

Owner: "aaj no nafo ketlo che?"
Bot: "Today's revenue: ₹3,450 from 28 sales."

Owner: "low stock items?"
Bot: "These items are running low (below 10):
  • Register 200pg — only 8 left
  • Spiral Notebook A4 — only 5 left
Restock soon!"
```

## Screen 5: Invoice History Path /invoices — ✅ DONE

> **Purpose:** After every completed checkout, an invoice record is created. This screen lets the owner browse, search, and reprint any past invoice.

**Invoice List View:**

- A scrollable table/card list of all invoices, newest first.
- Columns: Invoice #, Date & Time, Items Count, Total Amount, Actions.
- Search/filter by date range or invoice number.
- Each row shows a short summary (e.g., "3 items — ₹245").

**Invoice Detail View (Modal or Expandable):**

- Full breakdown: Product Name, Qty, Unit Price, Line Total.
- Invoice header: Shop name, date, invoice number.
- Footer: Grand total, payment method (future).

**Save as PDF:**

- A "Download PDF" button generates a clean, print-ready PDF of the invoice using browser-based PDF generation (e.g., `react-to-print` + `@react-pdf/renderer` or `html2canvas` + `jsPDF`).
- The PDF should include: shop branding, itemized list, totals, and a thank-you footer.

**Print Option:**

- A "Print" button opens the browser's native print dialog with the invoice pre-formatted.
- Uses `react-to-print` or `window.print()` with a print-optimized CSS stylesheet.
- Designed for thermal receipt printers (58mm/80mm width) as well as A4 paper.

**Tech Requirements:**

- Data source: `useSalesStore` transactions (each transaction becomes an invoice).
- PDF generation: `react-to-print` for print, `jsPDF` or `@react-pdf/renderer` for download.
- Invoice numbering: Auto-incremented from transaction ID (e.g., INV-001, INV-002…).
- Mobile-friendly: Card-based layout on small screens, table on desktop.

### Tech Requirements:

- Gemini API with tool calling / function declarations (`@google/genai`)
- WhatsApp Business Cloud API (Meta) or Twilio WhatsApp
- Owner phone number whitelisting (single authorized number)
- Conversation history per session stored in MongoDB (or in-memory for prototype)
- Hindi + English natural language understanding via Gemini

# 2. The Next.js "Speed Build" Library Stack
To build this in a few days, you should avoid writing custom CSS or complex state logic from scratch. Here is the modern Next.js stack optimized for speed:

## UI & Styling (Look professional instantly)

- Tailwind CSS: (Built into Next.js) For rapid, responsive mobile styling.

- shadcn/ui: Do not build buttons, modals, or tables from scratch. Shadcn gives you beautifully designed, accessible components that copy-paste directly into your Next.js project. It looks incredibly professional right out of the box.

- Lucide React: The best icon library for modern apps. Use this for your UI icons (cart, trash can, settings).

## State Management (The Cart)

- Zustand: Forget Redux or complex Context APIs. Zustand is a tiny, incredibly fast library for managing your Cart state. It allows you to add items, increase quantities, and clear the cart with minimal boilerplate code.

## Database & Backend

- Prisma (ORM): Since you like structure, Prisma is a game-changer. It allows you to define your database schema clearly and gives you perfect auto-completion in VS Code when writing queries.

- MongoDB: Prisma works perfectly with MongoDB. You can use MongoDB Atlas for a free, cloud-hosted database.

## Alerts & Notifications

- Sonner: A lightweight toast notification library. When the owner taps "Checkout," you want a satisfying little green pop-up at the top of the screen saying "Sale Recorded!" Sonner is the best looking one for Next.js.

## Camera Barcode Scanner (For testing without hardware)

- html5-qrcode: A very reliable library for accessing the smartphone camera directly in the browser. You can add a "Scan" button to your UI that opens the camera, reads a notebook barcode, and adds it to the Zustand cart.

## Charts (For the Dashboard)

- Recharts: A composable charting library built on React components. Super easy to throw in a bar chart showing the last 7 days of sales.

## AI & Messaging (For WhatsApp Stock Check)

- **@google/genai**: Official Google Generative AI SDK for Gemini API integration with tool calling / function calling support.

- **WAHA (WhatsApp HTTP API)**: 🧠 Free, self-hosted WhatsApp API that runs on your PC/server. Works by scanning a QR code (like WhatsApp Web) and exposes a REST API to send/receive messages. The core version is completely free. ⚠️ _Important: WAHA is unofficial — avoid spamming or violating WhatsApp's terms. For production, consider Meta's official WhatsApp Business Cloud API or Twilio WhatsApp API._

- **Conversation History**: Per-session chat history stored in MongoDB (or in-memory Map for prototype). Gemini uses this to understand follow-up questions and maintain context.

# 3. How Next.js Makes This Faster

- Instead of setting up a React frontend and an Express backend, you will use Next.js Server Actions.