"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { getUserOrders } from "@/services/api/order";
import { useAuthStore } from "@/lib/store/auth";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Menunggu Pembayaran", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  paid: { label: "Dibayar", color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle },
  processing: { label: "Diproses", color: "text-indigo-700", bg: "bg-indigo-50", icon: Package },
  shipped: { label: "Dikirim", color: "text-orange-700", bg: "bg-orange-50", icon: Truck },
  delivered: { label: "Selesai", color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    getUserOrders(token).then((res) => {
      if (res.success && res.data) setOrders(res.data);
      setLoading(false);
    });
  }, [token, router]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/account" className="hover:text-primary transition-colors">Akun</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Pesanan</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat pesanan...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mb-6">Mulai belanja untuk membuat pesanan pertama kamu.</p>
            <Link href="/" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">No. Pesanan</p>
                        <p className="font-bold text-gray-900">#{order.id}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} item</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg font-black text-primary">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
