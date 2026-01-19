"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ChefHat, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Estoque", href: "/estoque", icon: Package },
  { name: "Chef IA", href: "/chef", icon: ChefHat },
];

export default function Sidebar({ isOpen }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={cn(
      "w-64 h-screen bg-white border-r border-bakery-100 flex flex-col p-6 fixed lg:left-0 top-0 z-50 transition-all duration-300",
      isOpen ? "left-0" : "-left-64 lg:left-0"
    )}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 bg-bakery-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-bakery-900/20 rotate-3">
          P
        </div>
        <div>
          <h1 className="font-black text-xl text-bakery-900 leading-none tracking-tight font-serif">PanificAI</h1>
          <p className="text-[10px] text-bakery-400 font-bold uppercase tracking-widest mt-1">Gestão Expert</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive
                  ? "bg-bakery-900 text-white shadow-xl shadow-bakery-900/20 scale-[1.02]"
                  : "text-bakery-500 hover:bg-bakery-50 hover:text-bakery-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                isActive ? "text-bakery-200" : "text-bakery-300"
              )} />
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-bakery-50 rounded-[2rem] border border-bakery-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-bakery-100 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "Avatar"} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-bakery-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-bakery-900 truncate uppercase mt-0.5">
              {user?.displayName || user?.email?.split('@')[0] || "Usuário"}
            </p>
            <p className="text-[10px] text-bakery-400 font-bold uppercase truncate">Gerente</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
}
