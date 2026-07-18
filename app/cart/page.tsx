"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h1>
          <p className="text-gray-500 mb-6">Belum ada produk di keranjang belanja kamu</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
            Mulai Belanja <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Keranjang ({totalItems})</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 flex gap-4 md:gap-6">
                <Link href={`/product/${item.productId}`} className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/product/${item.productId}`} className="text-sm md:text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.productId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center bg-gray-100 rounded-xl">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-xl transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-xl transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-lg font-black text-primary">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} item)</span>
                  <span className="font-semibold text-gray-900">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-primary">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full bg-primary text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all">
                Checkout Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
