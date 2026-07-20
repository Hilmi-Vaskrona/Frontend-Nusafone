"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Shield, MapPin, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { createOrder } from "@/services/api/order";
import { addToCart } from "@/services/api/cart";
import { useAuthStore } from "@/lib/store/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const token = useAuthStore((s) => s.token);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!orderPlaced && items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, orderPlaced, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePlaceOrder = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!address.trim()) {
      setError("Alamat pengiriman wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    // Sync local cart items to backend cart before placing order
    for (const item of items) {
      await addToCart({ productId: item.productId, quantity: item.quantity }, token);
    }

    const res = await createOrder(
      { address: address.trim(), note: note.trim() || undefined },
      token
    );

    setLoading(false);
    if (res.success) {
      setOrderPlaced(true);
      clearCart();
    } else {
      setError(res.message || "Gagal membuat pesanan");
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah berbelanja di Nusafone.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/orders" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
              Lihat Pesanan
            </Link>
            <Link href="/" className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
              Kembali Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/cart" className="hover:text-primary transition-colors">Keranjang</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Alamat Pengiriman</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat pengiriman lengkap (Jl., RT/RW, Kelurahan, Kota, Provinsi, Kode Pos)"
                    required
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: Tolong kirim sebelum jam 5 sore"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 text-xs">No img</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity} - Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <span className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Harga</h2>
              <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="flex justify-between mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-primary">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Shield className="w-5 h-5" />
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
