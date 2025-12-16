"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  // Mask email for privacy
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    const maskedLocal = localPart.substring(0, 4) + "***";
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm mx-4 text-center">
        <div data-aos="fade-up" data-aos-duration="500">
          {/* Email Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-neutral-900 mb-3">Periksa Email Anda</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke{" "}
            <strong className="text-neutral-700">{maskEmail(email)}</strong>. 
            Silakan periksa kotak masuk dan folder spam Anda.
          </p>

          {/* For demo purposes - direct link to reset page */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 mb-2">Demo: Klik tombol di bawah untuk melanjutkan reset password</p>
            <Link 
              href="/forgot-password/reset"
              className="inline-block w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 font-medium transition text-sm"
            >
              Buka Halaman Reset Password
            </Link>
          </div>

          <Link 
            href="/login"
            className="inline-block w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordSentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Memuat...</p>
      </div>
    }>
      <SentContent />
    </Suspense>
  );
}
