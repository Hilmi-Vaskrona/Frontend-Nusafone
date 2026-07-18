"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import {
  getAllProducts,
  deleteProduct,
} from "@/services/api/product";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, token, isAdmin, logout } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || !token || !isAdmin) {
      router.push("/login");
      return;
    }

    getAllProducts().then((res) => {
      if (res.success && res.data) setProducts(res.data);
      setLoading(false);
    });
  }, [user, token, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    const res = await deleteProduct(id, token);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.message || "Gagal menghapus produk");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 min-h-screen sticky top-0">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black text-primary tracking-tighter">
              nusa<span className="text-gray-900">fone</span>
              <span className="text-primary text-3xl leading-[0]">.</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-medium transition-colors"
          >
            <Package className="w-5 h-5" />
            Produk
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Kategori
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Pesanan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Beranda Toko
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Kelola Produk
              </h1>
              <p className="text-gray-500 mt-1">
                Tambah, edit, dan hapus produk toko Anda.
              </p>
            </div>
            <Link
              href="/dashboard/products"
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Produk
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">
                      Info Produk
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">
                      Harga
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">
                      Stok
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">
                      Kategori
                    </th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        Memuat data produk...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Tidak ada produk ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          Rp {product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.stock} unit
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
