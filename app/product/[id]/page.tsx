"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Truck, Shield, ChevronRight, Minus, Plus, Check } from "lucide-react";
import { getProductById } from "@/services/api/product";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      getProductById(Number(id)).then((res) => {
        if (res.success && res.data) setProduct(res.data);
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Memuat produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
          <Link href="/" className="text-primary font-semibold hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <Link href={`/category/${product.categoryId}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-semibold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <ShoppingBag className="w-24 h-24 text-gray-300" />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              {product.category && (
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{product.category.name}</span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mt-3">
                {product.stock > 0 ? (
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Stok: {product.stock}</span>
                ) : (
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">Stok Habis</span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <span className="text-3xl md:text-4xl font-black text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Jumlah</h3>
              <div className="inline-flex items-center bg-gray-100 rounded-xl">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-6 font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  added ? "bg-emerald-500 text-white"
                  : product.stock === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20"
                }`}
              >
                {added ? (<><Check className="w-5 h-5" />Ditambahkan!</>) : (<><ShoppingBag className="w-5 h-5" />Tambah ke Keranjang</>)}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Gratis Ongkir</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <Shield className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Garansi Resmi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Produk</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
