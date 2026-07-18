import Link from "next/link";
import { Store, ShieldCheck, Users, Trophy, ChevronRight, PhoneCall, Mail } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Pelanggan Aktif", value: "50K+", icon: Users },
    { label: "Cabang Toko", value: "24", icon: Store },
    { label: "Penghargaan", value: "15+", icon: Trophy },
    { label: "Garansi Resmi", value: "100%", icon: ShieldCheck },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Menghubungkan Anda dengan <span className="text-primary">Teknologi Masa Depan</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Nusafone adalah destinasi utama untuk gadget dan aksesoris orisinal di Indonesia. Kami berkomitmen memberikan pengalaman berbelanja teknologi yang aman, mudah, dan terpercaya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">Tentang Kami</span>
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 -mt-24 relative z-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-xl shadow-gray-200/20 border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cerita Kami</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Didirikan pada tahun 2015, Nusafone bermula dari sebuah toko kecil di pusat kota Jakarta. Visi kami sederhana: menyediakan gadget berkualitas dengan garansi resmi untuk masyarakat Indonesia tanpa rasa khawatir akan produk palsu atau black market.
              </p>
              <p>
                Seiring berjalannya waktu, kepercayaan pelanggan membawa kami bertumbuh menjadi salah satu retail teknologi terkemuka. Kini, dengan puluhan cabang yang tersebar di berbagai kota besar, kami terus berinovasi untuk memberikan pelayanan terbaik—baik melalui toko fisik maupun platform e-commerce kami.
              </p>
              <p>
                Kami percaya bahwa teknologi harus dapat diakses oleh siapa saja dengan mudah, aman, dan didukung oleh layanan purna jual yang andal.
              </p>
            </div>
          </div>
          <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl relative overflow-hidden flex items-center justify-center">
            <Store className="w-24 h-24 text-gray-400" />
            <div className="absolute inset-0 bg-gray-900/10"></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <PhoneCall className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Telepon & WhatsApp</h3>
              <p className="text-gray-500 text-sm mb-3">Senin - Minggu, 09:00 - 21:00</p>
              <a href="tel:081122334455" className="font-bold text-primary hover:underline">0811-2233-4455</a>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
              <p className="text-gray-500 text-sm mb-3">Respon dalam 24 jam kerja</p>
              <a href="mailto:support@nusafone.com" className="font-bold text-primary hover:underline">support@nusafone.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
