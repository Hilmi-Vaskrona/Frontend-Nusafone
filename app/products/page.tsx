"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { getAllProducts } from "@/services/api/product";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types";

function formatPrice(n: number) {
  return n.toLocaleString("id-ID");
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer flex flex-col h-full border border-gray-100 hover:-translate-y-1 relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square p-6 bg-gray-50/50 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 bg-white">
          <h3 className="text-base text-gray-800 mb-3 line-clamp-2 font-semibold h-12 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto">
            <div className="text-xl font-black text-primary mb-5">
              Rp {formatPrice(product.price)}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <button
          onClick={() => addItem(product)}
          className="w-full bg-white text-primary border-2 border-primary py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          + Keranjang
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.success && res.data) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Semua Produk</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Semua Produk</h1>
          <p className="text-gray-500 mt-2">Temukan berbagai produk unggulan kami</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat produk...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
