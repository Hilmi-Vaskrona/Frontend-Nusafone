"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutGrid, label: "Kategori", href: "/categories" },
    { icon: ShoppingBag, label: "Keranjang", href: "/cart" },
    { icon: User, label: "Akun", href: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 md:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-[72px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 relative ${
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-all duration-300 ${
                  isActive ? "stroke-[2.5px] scale-110 drop-shadow-md" : "stroke-2"
                }`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                )}
                {item.label === "Keranjang" && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${
                isActive ? "text-primary" : "text-gray-500 font-medium"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
