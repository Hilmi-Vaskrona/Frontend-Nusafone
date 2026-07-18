"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-black text-primary tracking-tighter">
              nusa<span className="text-gray-900">fone</span>
              <span className="text-primary text-5xl leading-[0]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Lupa Password?</h1>
          <p className="text-gray-500 mt-2">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Terdaftar</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="contoh@email.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                Kirim Tautan Reset
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Periksa Email Anda</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Kami telah mengirimkan instruksi untuk mengatur ulang password ke <span className="font-semibold text-gray-900">{email}</span>. Silakan periksa folder Inbox atau Spam Anda.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Coba Email Lain
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Kembali ke halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
