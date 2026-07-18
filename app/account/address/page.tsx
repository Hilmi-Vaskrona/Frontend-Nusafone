"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

export default function AddressPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/account" className="hover:text-primary transition-colors">Akun</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Alamat Pengiriman</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Alamat Pengiriman</h1>

        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kelola Alamat</h3>
          <p className="text-gray-500 mb-6">Fitur alamat pengiriman akan tersedia setelah backend mendukung.</p>
          <Link href="/account" className="inline-flex items-center text-primary font-semibold hover:underline">
            Kembali ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
