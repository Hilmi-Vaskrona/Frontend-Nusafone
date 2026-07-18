"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { getCategoryById } from "@/services/api/product";
import type { Category, Product } from "@/types";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      getCategoryById(Number(id)).then((res) => {
        if (res.success && res.data) {
          setCategory(res.data);
          setProducts(res.data.products || []);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Memuat...</div>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kategori Tidak Ditemukan</h1>
          <Link href="/categories" className="text-primary font-semibold hover:underline">
            Kembali ke Kategori
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
          <Link href="/categories" className="hover:text-primary transition-colors">Kategori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">{category.name}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-500 mt-1">{products.length} produk ditemukan</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">Belum ada produk di kategori ini</p>
            <Link href="/categories" className="mt-4 inline-block text-primary font-semibold hover:underline">
              Lihat Kategori Lain
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1"
              >
                <div className="relative aspect-square p-6 bg-gray-50/50 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 h-10 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-lg font-black text-primary">Rp {product.price.toLocaleString("id-ID")}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
