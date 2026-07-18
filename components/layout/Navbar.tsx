"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, Phone, HelpCircle, MapPin, ChevronDown, User, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  
  const { token, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-gray-50 text-[11px] font-medium py-1.5 px-4 hidden md:flex justify-between items-center text-gray-500 border-b border-gray-100">
        <div className="max-w-7xl mx-auto w-full flex justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <a href="tel:1500123" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> 1500-123
            </a>
            <Link href="/track-order" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Lacak Pesanan
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Bantuan
            </Link>
            <Link href="/categories" className="hover:text-primary transition-colors">
              Promo Spesial
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
          
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl md:text-3xl font-black text-primary tracking-tighter">
                nusa<span className="text-gray-900">fone</span>
                <span className="text-primary text-4xl leading-[0]">.</span>
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="hidden sm:flex flex-1 max-w-2xl px-4">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari smartphone, tablet, smartwatch..."
                className="w-full bg-gray-100/80 border-2 border-transparent text-gray-900 rounded-full pl-12 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all placeholder:font-normal placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary hover:bg-red-50 rounded-full transition-all group">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-5">
              {!mounted ? (
                <div className="w-[120px] h-10 animate-pulse bg-gray-100 rounded-lg"></div>
              ) : token ? (
                <>
                  <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                    <User className="w-5 h-5" />
                    {user?.name || "Profil"}
                  </Link>
                  <button onClick={() => logout()} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Keluar">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                    Masuk
                  </Link>
                  <Link href="/register" className="text-sm font-bold bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Below Header) */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full bg-gray-100 border-2 border-transparent text-gray-900 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary/30 transition-all"
            />
          </form>
        </div>
      </div>

      {/* Categories Bar (Desktop) */}
      <div className="hidden md:block bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <ul className="flex items-center gap-4 lg:gap-8 h-12 text-sm font-semibold overflow-x-auto whitespace-nowrap pb-1 -mb-1">
            <li>
              <Link href="/categories" className="flex items-center gap-1.5 text-white hover:text-primary transition-colors">
                <Menu className="w-4 h-4" /> Semua Kategori
              </Link>
            </li>
            <div className="w-px h-4 bg-gray-700"></div>
            <li><Link href="/categories" className="hover:text-white transition-colors">Promo Spesial</Link></li>
            <li><Link href="/categories" className="hover:text-white transition-colors">Smartphone</Link></li>
            <li><Link href="/categories" className="hover:text-white transition-colors">Tablet & Laptop</Link></li>
            <li><Link href="/categories" className="hover:text-white transition-colors">Aksesoris</Link></li>
            <li><Link href="/categories" className="hover:text-white transition-colors flex items-center gap-1">Lainnya <ChevronDown className="w-4 h-4"/></Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
