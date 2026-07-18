"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { getUserOrders } from "@/services/api/order";
import { getAllProducts } from "@/services/api/product";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAdmin, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token || !isAdmin) {
      router.push("/login");
      return;
    }

    Promise.all([getUserOrders(token), getAllProducts()]).then(
      ([ordersRes, productsRes]) => {
        let revenue = 0;
        let orderCount = 0;

        if (ordersRes.success && ordersRes.data) {
          orderCount = ordersRes.data.length;
          revenue = ordersRes.data.reduce(
            (sum, order) => sum + order.totalPrice,
            0
          );
        }

        setStats({
          totalOrders: orderCount,
          totalProducts:
            productsRes.success && productsRes.data
              ? productsRes.data.length
              : 0,
          totalRevenue: revenue,
        });
        setLoading(false);
      }
    );
  }, [user, token, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  const statCards = [
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Pesanan",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Admin",
      value: user.name,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 min-h-screen sticky top-0">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black text-primary tracking-tighter">
              nusa<span className="text-gray-900">fone</span>
              <span className="text-primary text-3xl leading-[0]">.</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <Package className="w-5 h-5" />
            Produk
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Kategori
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Pesanan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Beranda Toko
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Selamat datang, {user.name}!
            </h1>
            <p className="text-gray-500 mt-1">
              Ringkasan aktivitas dan statistik toko Anda.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Memuat data dashboard...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Aksi Cepat</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/products"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                    Kelola Produk
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                    Kelola Kategori
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                    Kelola Pesanan
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
