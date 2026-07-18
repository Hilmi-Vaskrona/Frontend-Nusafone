"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronRight, Search } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = ["Semua", "Pemesanan", "Pembayaran", "Pengiriman", "Garansi & Retur"];

  const faqs = [
    {
      category: "Pemesanan",
      question: "Bagaimana cara melakukan pemesanan di Nusafone?",
      answer: "Anda dapat memilih produk yang diinginkan, klik 'Tambah ke Keranjang', lalu ikuti proses Checkout dengan mengisi alamat pengiriman dan memilih metode pembayaran. Setelah pembayaran terverifikasi, pesanan akan segera diproses."
    },
    {
      category: "Pemesanan",
      question: "Apakah saya harus membuat akun untuk berbelanja?",
      answer: "Ya, kami mewajibkan pembuatan akun untuk memudahkan Anda dalam melacak status pesanan, menyimpan riwayat transaksi, dan mendapatkan promo eksklusif member."
    },
    {
      category: "Pembayaran",
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima berbagai metode pembayaran termasuk Transfer Bank (Virtual Account), E-Wallet (GoPay, OVO, ShopeePay), Kartu Kredit/Debit, dan layanan Cicilan Tanpa Kartu Kredit (Kredivo, SPayLater)."
    },
    {
      category: "Pengiriman",
      question: "Berapa lama estimasi waktu pengiriman?",
      answer: "Estimasi pengiriman untuk area Jabodetabek adalah 1-2 hari kerja. Untuk luar Jabodetabek berkisar antara 3-5 hari kerja tergantung pada layanan kurir yang Anda pilih saat checkout."
    },
    {
      category: "Garansi & Retur",
      question: "Bagaimana prosedur klaim garansi produk?",
      answer: "Seluruh produk yang kami jual memiliki garansi resmi. Anda dapat langsung membawa produk ke Service Center resmi merek terkait, atau menghubungi Customer Service kami untuk bantuan panduan klaim."
    },
    {
      category: "Garansi & Retur",
      question: "Apakah barang yang sudah dibeli bisa ditukar/dikembalikan?",
      answer: "Barang dapat ditukar atau dikembalikan maksimal 3x24 jam sejak barang diterima, dengan syarat segel belum terbuka dan terdapat cacat pabrik (bukan kesalahan pengguna). Wajib menyertakan video unboxing."
    }
  ];

  const filteredFaqs = activeCategory === "Semua" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Pusat Bantuan (FAQ)</span>
        </nav>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pusat Bantuan Nusafone</h1>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan seputar pengalaman berbelanja di Nusafone.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik bantuan..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIndex === idx ? "border-primary/30 shadow-md ring-4 ring-primary/5" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === idx ? "rotate-180 text-primary" : ""}`} />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 md:p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-1">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Masih Butuh Bantuan?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Tim Customer Support kami siap membantu Anda 24/7 untuk menjawab pertanyaan lebih lanjut.
          </p>
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all">
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
}
