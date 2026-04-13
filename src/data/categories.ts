export type Category = {
    id: string;
    label: string;
    color: string;
    gradient: string;
};

export const initialCategories: Category[] = [
    {
        id: "notebooks",
        label: "Notebooks",
        color: "bg-indigo-500",
        gradient: "from-indigo-500 to-blue-600",
    },
    {
        id: "pens",
        label: "Pens",
        color: "bg-emerald-500",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        id: "printouts",
        label: "Printouts",
        color: "bg-amber-500",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        id: "accessories",
        label: "Accessories",
        color: "bg-violet-500",
        gradient: "from-violet-500 to-purple-600",
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