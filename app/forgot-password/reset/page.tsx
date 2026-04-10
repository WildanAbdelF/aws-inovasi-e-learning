"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [maskedEmail, setMaskedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tokenHash, setTokenHash] = useState("");
  const [authCode, setAuthCode] = useState("");

  useEffect(() => {
    const parseRecoveryToken = () => {
      if (typeof window === "undefined") return;

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const queryParams = new URLSearchParams(window.location.search);

      const parsedAccessToken =
        hashParams.get("access_token") || queryParams.get("access_token") || "";
      const parsedRefreshToken =
        hashParams.get("refresh_token") || queryParams.get("refresh_token") || "";
      const parsedTokenHash =
        hashParams.get("token_hash") || queryParams.get("token_hash") || "";
      const parsedCode = queryParams.get("code") || "";
      const parsedType = hashParams.get("type") || queryParams.get("type") || "";

      const isRecoveryType = parsedType ? parsedType === "recovery" : true;

      if (!isRecoveryType) {
        router.replace("/forgot-password");
        return;
      }

      if (!parsedAccessToken && !parsedTokenHash && !parsedCode) {
        router.replace("/forgot-password");
        return;
      }

      setAccessToken(parsedAccessToken);
      setRefreshToken(parsedRefreshToken);
      setTokenHash(parsedTokenHash);
      setAuthCode(parsedCode);
      setIsValidToken(true);
    };

    parseRecoveryToken();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password.length < 6) {
      window.alert("Kata sandi harus memiliki setidaknya 6 karakter.");
      setIsSubmitting(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      window.alert("Konfirmasi kata sandi tidak cocok.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();

      if (tokenHash) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });

        if (verifyError) {
          throw verifyError;
        }
      } else if (authCode) {
        const { error: codeError } = await supabase.auth.exchangeCodeForSession(authCode);

        if (codeError) {
          throw codeError;
        }
      } else if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }
      } else {
        throw new Error("Token reset tidak valid atau sudah kedaluwarsa.");
      }

      const { data: currentUserData } = await supabase.auth.getUser();
      const userEmail = currentUserData.user?.email ?? "";
      if (userEmail) {
        const [localPart, domain] = userEmail.split("@");
        if (localPart && domain) {
          const visible = localPart.slice(0, 2);
          setMaskedEmail(`${visible}${"*".repeat(Math.max(1, localPart.length - 2))}@${domain}`);
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut();
      window.alert("Kata sandi berhasil diubah! Silakan login dengan kata sandi baru Anda.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengubah kata sandi. Silakan coba lagi.";
      window.alert(message);
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Memvalidasi token...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm mx-4">
        <div className="text-center mb-6" data-aos="fade-up" data-aos-duration="500">
          {/* Logo */}
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 font-medium mb-1">AWS E-Learning</p>
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Buat Kata Sandi Baru</h1>
          <p className="text-sm text-neutral-500">
            Kata sandi harus memiliki setidaknya 6 karakter.
          </p>
          {maskedEmail ? (
            <p className="text-xs text-neutral-500 mt-2">Akun: {maskedEmail}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru Anda"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Masukkan kembali kata sandi baru Anda"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}
