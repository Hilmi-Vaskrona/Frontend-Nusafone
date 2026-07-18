"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { getAllProducts, getAllCategories } from "@/services/api/product";
import type { Product, Category } from "@/types";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories()]).then(([prodRes, catRes]) => {
      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 font-sans selection:bg-primary/20 selection:text-primary">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="w-full h-[240px] md:h-[440px] rounded-3xl overflow-hidden relative shadow-2xl shadow-primary/10 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-primary to-red-800 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-400 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse delay-700"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white z-10 px-4">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold mb-6 border border-white/30 uppercase tracking-wider">
                Nusafone
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                Belanja Mudah <br className="hidden md:block"/> Harga Terbaik
              </h2>
              <p className="text-lg md:text-2xl font-medium text-white/90 mb-8 max-w-2xl drop-shadow-md">
                Temukan produk terbaik dengan penawaran menarik hanya di Nusafone!
              </p>
              <Link href="/categories" className="bg-white text-primary px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group/btn">
                Belanja Sekarang
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              <div className="w-10 h-2 bg-white rounded-full shadow-md"></div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-white">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-primary transition-colors text-center">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Semua Produk</h2>
            </div>
            <p className="text-gray-500 text-base ml-4">Produk terbaik untukmu</p>
          </div>
          <Link href="/categories" className="hidden md:flex items-center text-primary font-semibold hover:text-primary-dark hover:bg-primary/5 px-4 py-2 rounded-full transition-colors">
            Lihat Semua <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat produk...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-6 md:hidden flex justify-center">
          <Link href="/categories" className="flex items-center text-primary font-semibold border-2 border-primary/20 hover:bg-primary/5 px-6 py-2.5 rounded-full transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      </section>
    </div>
  );
}
