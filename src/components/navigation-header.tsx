"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingCart, PackageSearch, LayoutDashboard, FileText } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function NavigationHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/checkout",
      label: "Checkout",
      icon: ShoppingCart,
    },
    {
      href: "/inventory",
      label: "Inventory",
      icon: PackageSearch,
    },
    {
      href: "/invoices",
      label: "Invoices",
      icon: FileText,
    },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b bg-card/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight tracking-tight">
              QuickBill POS
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none">
              Stationary Store
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className={isActive ? "block" : "hidden sm:block"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}
