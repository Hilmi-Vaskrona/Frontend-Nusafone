"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Printer } from "lucide-react";
import { getOrderReceipt } from "@/services/api/order";
import { useAuthStore } from "@/lib/store/auth";
import type { Receipt as ReceiptType, OrderStatus } from "@/types";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    params.then(({ id }) => {
      getOrderReceipt(Number(id), token).then((res) => {
        if (res.success && res.data) {
          setReceipt(res.data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
    });
  }, [params, token, router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Memuat receipt...</div>
      </div>
    );
  }

  if (notFound || !receipt) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Receipt Tidak Ditemukan
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

  const r = receipt.receipt;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
          <Link
            href={`/orders/${r.orderId}`}
            className="hover:text-primary transition-colors"
          >
            #{r.orderId}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Receipt</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-900 text-white p-6 text-center">
            <h1 className="text-2xl font-black tracking-tight">
              {r.storeName}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Struk Pembelian Resmi
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start text-sm">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p className="font-bold text-gray-900">#{r.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Tanggal</p>
                <p className="font-bold text-gray-900">
                  {new Date(r.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Pelanggan
              </h3>
              <p className="text-sm font-semibold text-gray-900">
                {r.customer.name}
              </p>
              <p className="text-sm text-gray-500">{r.customer.email}</p>
              <p className="text-sm text-gray-500">{r.customer.address}</p>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Item
              </h3>
              <div className="space-y-3">
                {r.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-4">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {r.note && (
              <div className="border-t border-dashed border-gray-200 pt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Catatan
                </h3>
                <p className="text-sm text-gray-600">{r.note}</p>
              </div>
            )}

            <div className="border-t-2 border-gray-900 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary">
                  Rp {r.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Status:{" "}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {statusLabels[r.status]}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 text-center">
            <p className="text-xs text-gray-400 mb-4">
              Terima kasih telah berbelanja di {r.storeName}
            </p>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors"
            >
              <Printer className="w-4 h-4" />
              Cetak Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
