"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Memproses login Google...");

  useEffect(() => {
    const finalizeOAuthLogin = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const nextPath = searchParams.get("next") || currentUrl.searchParams.get("next");
        const code = currentUrl.searchParams.get("code") || searchParams.get("code");
        const accessToken = currentUrl.hash ? new URLSearchParams(currentUrl.hash.replace(/^#/, "")).get("access_token") : null;
        const refreshToken = currentUrl.hash ? new URLSearchParams(currentUrl.hash.replace(/^#/, "")).get("refresh_token") : null;
        const tokenHash = currentUrl.hash ? new URLSearchParams(currentUrl.hash.replace(/^#/, "")).get("token_hash") : null;
        const authType = currentUrl.hash ? new URLSearchParams(currentUrl.hash.replace(/^#/, "")).get("type") : null;

        const supabase = getSupabaseBrowserClient();
        let sessionResult: { access_token: string; refresh_token: string } | null = null;

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error || !data.session || !data.user) {
            throw error ?? new Error("Gagal menukar kode OAuth.");
          }

          sessionResult = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          };
        } else if ((accessToken && refreshToken) || tokenHash || authType === "recovery") {
          if (tokenHash) {
            const { error } = await supabase.auth.verifyOtp({
              type: authType === "recovery" ? "recovery" : "magiclink",
              token_hash: tokenHash,
            });

            if (error) {
              throw error;
            }
          } else if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              throw error;
            }
          }

          const { data, error } = await supabase.auth.getSession();

          if (error || !data.session) {
            throw error ?? new Error("Gagal mengambil session OAuth.");
          }

          sessionResult = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          };
        } else {
          throw new Error(
            "OAuth callback tidak menerima code atau session token. Pastikan redirect URL Supabase diarahkan ke /auth/callback dan URL itu terdaftar di Supabase Auth > Redirect URLs."
          );
        }

        const response = await fetch("/api/auth/oauth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session: sessionResult }),
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

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-2 px-6">
            <p className="text-sm text-neutral-500">Memproses login Google...</p>
            <p className="text-xs text-neutral-400">Anda akan diarahkan otomatis.</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}