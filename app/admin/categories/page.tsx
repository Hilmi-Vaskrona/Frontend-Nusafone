"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Package,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/api/product";
import { useAuthStore } from "@/lib/store/auth";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, token, isAdmin, logout } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !token || !isAdmin) {
      router.push("/login");
      return;
    }
    getAllCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
      setLoading(false);
    });
  }, [user, token, isAdmin, router]);

  const loadCategories = () => {
    getAllCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormImage("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormImage(cat.image || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!token || !formName.trim()) return;
    setSaving(true);

    const data = { name: formName.trim(), image: formImage.trim() || undefined };
    const res = editingId
      ? await updateCategory(editingId, data, token)
      : await createCategory(data, token);

    setSaving(false);
    if (res.success) {
      setShowModal(false);
      loadCategories();
    } else {
      alert(res.message || "Gagal menyimpan kategori");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    const res = await deleteCategory(id, token);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.message || "Gagal menghapus kategori");
    }
  };

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
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Package className="w-5 h-5" />
            Produk
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-medium transition-colors">
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola Kategori</h1>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus kategori produk.</p>
            </div>
            <button onClick={openCreate} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Kategori
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Nama Kategori</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Jumlah Produk</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Dibuat</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Memuat data kategori...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Belum ada kategori.</td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                              ) : (
                                <LayoutDashboard className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{cat.products?.length ?? 0} produk</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(cat.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masukkan nama kategori"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar (opsional)</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
