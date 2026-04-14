import { Category } from "@/models/Category";

const now = new Date().toISOString();

export const initialCategories: Category[] = [
    {
        _id: "notebooks",
        shop_id: "shop_001",
        label: "Notebooks",
        color: "bg-indigo-500",
        gradient: "from-indigo-500 to-blue-600",
        createdAt: now,
        updatedAt: now,
    },
    {
        _id: "pens",
        shop_id: "shop_001",
        label: "Pens",
        color: "bg-emerald-500",
        gradient: "from-emerald-500 to-teal-600",
        createdAt: now,
        updatedAt: now,
    },
    {
        _id: "printouts",
        shop_id: "shop_001",
        label: "Printouts",
        color: "bg-amber-500",
        gradient: "from-amber-500 to-orange-600",
        createdAt: now,
        updatedAt: now,
    },
    {
        _id: "accessories",
        shop_id: "shop_001",
        label: "Accessories",
        color: "bg-violet-500",
        gradient: "from-violet-500 to-purple-600",
        createdAt: now,
        updatedAt: now,
    },
];



export const AVAILABLE_COLORS = [
    { color: "bg-indigo-500", gradient: "from-indigo-500 to-blue-600" },
    { color: "bg-emerald-500", gradient: "from-emerald-500 to-teal-600" },
    { color: "bg-amber-500", gradient: "from-amber-500 to-orange-600" },
    { color: "bg-violet-500", gradient: "from-violet-500 to-purple-600" },
    { color: "bg-rose-500", gradient: "from-rose-500 to-pink-600" },
    { color: "bg-cyan-500", gradient: "from-cyan-500 to-blue-500" },
    { color: "bg-yellow-400", gradient: "from-yellow-400 to-orange-500" },
    { color: "bg-slate-500", gradient: "from-slate-500 to-gray-600" },
];