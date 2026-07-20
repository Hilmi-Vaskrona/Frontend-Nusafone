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
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api/product";
import type { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, token, isAdmin, logout } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    if (!user || !token || !isAdmin) {
      router.push("/login");
      return;
    }

    Promise.all([getAllProducts(), getAllCategories()]).then(
      ([prodRes, catRes]) => {
        if (prodRes.success && prodRes.data) setProducts(prodRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        setLoading(false);
      }
    );
  }, [user, token, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!token || !form.name.trim() || !form.price || !form.categoryId) return;
    setSaving(true);

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      imageUrl: form.imageUrl.trim() || undefined,
      categoryId: Number(form.categoryId),
    };

    const res = editingId
      ? await updateProduct(editingId, data, token)
      : await createProduct(data, token);

    setSaving(false);
    if (res.success) {
      setShowModal(false);
      // Reload products
      const prodRes = await getAllProducts();
      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
    } else {
      alert(res.message || "Gagal menyimpan produk");
    }
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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-medium transition-colors">
            <Package className="w-5 h-5" />
            Produk
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Kategori
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Pesanan
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Beranda Toko
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola Produk</h1>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus produk toko Anda.</p>
            </div>
            <button onClick={openCreate} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Produk
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Info Produk</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Harga</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Stok</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Kategori</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Memuat data produk...</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Tidak ada produk ditemukan.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain rounded-lg" />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">Rp {product.price.toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {product.stock} unit
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || "-"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Contoh: Samsung Galaxy S24" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Deskripsi produk..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0" min={0} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stok</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} placeholder="0" min={0} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori *</label>
                <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 bg-white">
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar (opsional)</label>
                <input type="text" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/product.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.price || !form.categoryId} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
