# 1. Essential Features for the Prototype
To prove this works to the shop owner, you only need three screens. Do not build anything else until these are perfect:

## Screen 1: The POS Checkout (Mobile-First) Path /checkout

- Quick-Tap Grid: A scrollable grid of buttons for their top 20 selling items (pens, notebooks, printouts). Tapping a button adds it to the cart.

- Live Cart: A section showing current items, quantities, and a dynamically updating total price.

- One-Tap Checkout: A big "Complete Sale" button that deducts stock and clears the cart.

## Screen 2: Inventory Management (CRUD) Path /inventory

- A simple table listing all items, their current stock, and price.

- An "Add New Item" modal.

- Low Stock Indicators: Items drop below 10 should be highlighted in red.

## Screen 3: The Mini-Dashboard Path /dashboard

- "Today's Revenue" counter.

- "Total Items Sold Today" counter.

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

# 3. How Next.js Makes This Faster

- Instead of setting up a React frontend and an Express backend, you will use Next.js Server Actions.