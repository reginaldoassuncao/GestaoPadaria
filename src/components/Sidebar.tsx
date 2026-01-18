"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ChefHat, User } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Estoque", href: "/estoque", icon: Package },
  { name: "Chef IA", href: "/chef", icon: ChefHat },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-bakery-100 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-10 h-10 bg-bakery-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          P
        </div>
        <div>
          <h1 className="font-bold text-lg text-bakery-900 leading-none">PanificAI</h1>
          <p className="text-xs text-bakery-500">Gestão Inteligente</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-bakery-100 text-bakery-900 font-medium"
                  : "text-bakery-600 hover:bg-bakery-50 hover:text-bakery-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-bakery-100 pt-4 px-2">
        <div className="flex items-center gap-3 p-2 bg-bakery-50 rounded-xl">
          <div className="w-10 h-10 bg-bakery-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-bakery-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-bakery-900 truncate">Maria da Silva</p>
            <p className="text-xs text-bakery-500 truncate">Gerente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
