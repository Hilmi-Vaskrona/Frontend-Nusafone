"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  StickyNote,
  Receipt,
} from "lucide-react";
import { getOrderById, cancelOrder } from "@/services/api/order";
import { useAuthStore } from "@/lib/store/auth";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: Clock,
  },
  paid: {
    label: "Dibayar",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: CheckCircle,
  },
  processing: {
    label: "Diproses",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    icon: Package,
  },
  shipped: {
    label: "Dikirim",
    color: "text-orange-700",
    bg: "bg-orange-50",
    icon: Truck,
  },
  delivered: {
    label: "Selesai",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: XCircle,
  },
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    params.then(({ id }) => {
      getOrderById(Number(id), token).then((res) => {
        if (res.success && res.data) setOrder(res.data);
        setLoading(false);
      });
    });
  }, [params, token, router]);

  const handleCancel = async () => {
    if (!order || !token) return;
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

    setCancelling(true);
    const res = await cancelOrder(order.id, token);
    setCancelling(false);

    if (res.success && res.data) {
      setOrder(res.data);
    } else {
      alert(res.message || "Gagal membatalkan order");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Memuat detail pesanan...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pesanan Tidak Ditemukan
          </h1>
          <Link
            href="/orders"
            className="text-primary font-semibold hover:underline"
          >
            Kembali ke Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/orders"
            className="hover:text-primary transition-colors"
          >
            Pesanan
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">#{order.id}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pesanan #{order.id}
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${status.bg} ${status.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">
                Alamat Pengiriman
              </h2>
            </div>
            <p className="text-gray-600">{order.address}</p>
            {order.note && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <StickyNote className="w-4 h-4" />
                <span>{order.note}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Item Pesanan
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      x{item.quantity} - Rp{" "}
                      {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-black text-primary">
                Rp {order.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Info Pelanggan
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Nama:</span>{" "}
                {order.userName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {order.userEmail}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {order.status === "pending" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-50 text-red-600 border-2 border-red-200 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
              </button>
            )}
            <Link
              href={`/orders/${order.id}/receipt`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary/5 text-primary border-2 border-primary/20 py-3 rounded-xl font-bold text-sm hover:bg-primary/10 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              Lihat Receipt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
