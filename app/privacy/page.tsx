import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Kebijakan Privasi</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kebijakan Privasi</h1>
              <p className="text-gray-500">Pembaruan Terakhir: 15 Juli 2024</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
            <h3>1. Pendahuluan</h3>
            <p>
              Privasi Anda sangat penting bagi Nusafone. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan mengungkapkan informasi pribadi Anda saat menggunakan platform kami.
            </p>

            <h3>2. Informasi yang Kami Kumpulkan</h3>
            <p>Kami dapat mengumpulkan informasi pribadi Anda seperti:</p>
            <ul>
              <li><strong>Informasi Identitas:</strong> Nama lengkap, tanggal lahir, dan jenis kelamin.</li>
              <li><strong>Informasi Kontak:</strong> Alamat email, nomor telepon, dan alamat pengiriman.</li>
              <li><strong>Informasi Pembayaran:</strong> Rincian kartu kredit atau akun bank (yang diproses secara aman oleh payment gateway mitra kami).</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, data login, dan interaksi Anda di website.</li>
            </ul>

            <h3>3. Penggunaan Informasi</h3>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Memproses dan memenuhi pesanan Anda.</li>
              <li>Berkomunikasi mengenai status pesanan, pertanyaan, atau keluhan.</li>
              <li>Personalisasi pengalaman berbelanja dan merekomendasikan produk.</li>
              <li>Mendeteksi dan mencegah aktivitas penipuan.</li>
            </ul>

            <h3>4. Keamanan Data</h3>
            <p>
              Kami menerapkan standar keamanan enkripsi terkini untuk melindungi data pribadi Anda dari akses yang tidak sah. Walau begitu, transmisi data di internet tidak ada yang 100% aman, sehingga kami mengimbau Anda untuk selalu menjaga kerahasiaan kata sandi Anda.
            </p>

            <h3>5. Pembagian Informasi dengan Pihak Ketiga</h3>
            <p>
              Kami tidak akan menjual atau menyewakan informasi pribadi Anda. Kami hanya membagikan data Anda kepada pihak ketiga yang berpartisipasi dalam menyelesaikan pesanan Anda (seperti mitra logistik dan penyedia gateway pembayaran).
            </p>

            <h3>6. Hak Anda</h3>
            <p>
              Anda memiliki hak untuk mengakses, mengubah, atau meminta penghapusan data pribadi Anda yang ada di sistem kami kapan saja melalui menu Pengaturan Akun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
