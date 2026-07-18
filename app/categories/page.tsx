"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { getAllCategories } from "@/services/api/product";
import type { Category } from "@/types";

const colorMap = [
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" },
  { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Semua Kategori</h1>
          <p className="text-gray-500 mt-2">Temukan produk sesuai kebutuhanmu</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat kategori...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, idx) => {
              const color = colorMap[idx % colorMap.length];
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`bg-white rounded-2xl p-6 md:p-8 border ${color.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className={`w-16 h-16 ${color.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <ShoppingBag className={`w-8 h-8 ${color.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <span className="inline-flex items-center text-sm font-semibold text-primary">
                    Lihat Semua <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
