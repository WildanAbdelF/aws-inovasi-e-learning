"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Memproses login Google...");

  useEffect(() => {
    const finalizeOAuthLogin = async () => {
      try {
        const code = searchParams.get("code");
        const nextPath = searchParams.get("next");

        if (!code) {
          throw new Error("Kode autentikasi tidak ditemukan.");
        }

        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session || !data.user) {
          throw error ?? new Error("Gagal menukar kode OAuth.");
        }

        const response = await fetch("/api/auth/oauth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session: data.session }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            typeof payload?.error === "string"
              ? payload.error
              : "Gagal menyelesaikan login Google.";
          throw new Error(message);
        }

        router.replace(nextPath?.startsWith("/") ? nextPath : "/dashboard");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Login Google gagal diproses.";
        setStatus(message);
        window.setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    };

    void finalizeOAuthLogin();
  }, [router, searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-2 px-6">
        <p className="text-sm text-neutral-500">{status}</p>
        <p className="text-xs text-neutral-400">Anda akan diarahkan otomatis.</p>
      </div>
    </div>
  );
}