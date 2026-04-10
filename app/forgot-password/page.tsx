"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/services/userApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses permintaan reset password.";
      window.alert(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm mx-4">
        <div className="text-center mb-6" data-aos="fade-up" data-aos-duration="500">
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Lupa Kata Sandi?</h1>
          <p className="text-sm text-neutral-500">
            Masukkan email Anda untuk memulai proses reset kata sandi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
          </button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:underline"
            >
              Kembali ke Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
