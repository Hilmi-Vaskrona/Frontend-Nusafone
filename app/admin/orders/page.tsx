"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { getUserOrders, updateOrderStatus } from "@/services/api/order";
import { useAuthStore } from "@/lib/store/auth";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: "Menunggu Pembayaran", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  paid: { label: "Dibayar", color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle },
  processing: { label: "Diproses", color: "text-indigo-700", bg: "bg-indigo-50", icon: Package },
  shipped: { label: "Dikirim", color: "text-orange-700", bg: "bg-orange-50", icon: Truck },
  delivered: { label: "Selesai", color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const allStatuses: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, token, isAdmin, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token || !isAdmin) {
      router.push("/login");
      return;
    }
    getUserOrders(token).then((res) => {
      if (res.success && res.data) setOrders(res.data);
      setLoading(false);
    });
  }, [user, token, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    if (!token) return;
    const res = await updateOrderStatus(orderId, newStatus, token);
    if (res.success && res.data) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? res.data : o))
      );
    } else {
      alert(res.message || "Gagal mengupdate status");
    }
  };

  if (!user) return null;

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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Package className="w-5 h-5" />
            Produk
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Kategori
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Pesanan
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Beranda Toko
          </Link>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola Pesanan</h1>
            <p className="text-gray-500 mt-1">Lihat dan update status semua pesanan.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">No. Pesanan</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Pelanggan</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Tanggal</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Total</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Status</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Memuat data pesanan...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Belum ada pesanan.</td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const status = statusConfig[order.status] || statusConfig.pending;
                      return (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-800">{order.userName}</p>
                            <p className="text-xs text-gray-500">{order.userEmail}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            Rp {order.totalPrice.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              disabled={order.status === "cancelled" || order.status === "delivered"}
                              className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 ${status.bg} ${status.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {allStatuses.map((s) => (
                                <option key={s} value={s}>{statusConfig[s].label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/orders/${order.id}`} className="text-primary text-sm font-bold hover:underline">
                              Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
