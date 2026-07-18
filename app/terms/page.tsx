import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Syarat & Ketentuan</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Syarat & Ketentuan</h1>
              <p className="text-gray-500">Pembaruan Terakhir: 15 Juli 2024</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
            <h3>1. Pendahuluan</h3>
            <p>
              Selamat datang di Nusafone. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Silakan baca dengan seksama sebelum melakukan transaksi.
            </p>

            <h3>2. Akun Pengguna</h3>
            <ul>
              <li>Pengguna wajib memberikan informasi yang akurat dan lengkap saat melakukan pendaftaran.</li>
              <li>Pengguna bertanggung jawab atas kerahasiaan password dan akun masing-masing.</li>
              <li>Nusafone berhak menangguhkan atau menghapus akun yang terindikasi melakukan penipuan atau melanggar ketentuan.</li>
            </ul>

            <h3>3. Pemesanan dan Harga</h3>
            <p>
              Semua harga yang tercantum di website adalah dalam Rupiah (IDR) dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Pesanan Anda baru dianggap sah dan mengikat setelah kami menerima pembayaran dan mengirimkan konfirmasi pesanan.
            </p>

            <h3>4. Pengiriman</h3>
            <p>
              Waktu pengiriman bergantung pada estimasi yang diberikan oleh pihak kurir. Nusafone tidak bertanggung jawab atas keterlambatan pengiriman yang diakibatkan oleh force majeure atau kendala operasional dari pihak ekspedisi.
            </p>

            <h3>5. Garansi dan Pengembalian (Retur)</h3>
            <ul>
              <li>Semua perangkat elektronik yang dijual di Nusafone dilengkapi dengan garansi resmi.</li>
              <li>Barang hanya dapat dikembalikan maksimal 3x24 jam sejak diterima, jika terdapat cacat pabrik (factory defect).</li>
              <li>Pengguna wajib menyertakan video unboxing (tanpa jeda) sebagai bukti klaim pengembalian.</li>
            </ul>

            <h3>6. Hukum yang Berlaku</h3>
            <p>
              Syarat dan ketentuan ini tunduk dan ditafsirkan sesuai dengan hukum Republik Indonesia. Segala perselisihan akan diselesaikan melalui musyawarah mufakat atau di wilayah hukum yurisdiksi Jakarta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
