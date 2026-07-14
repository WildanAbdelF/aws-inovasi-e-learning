import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-2 px-6">
            <p className="text-sm text-neutral-500">Memuat halaman login...</p>
          </div>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
