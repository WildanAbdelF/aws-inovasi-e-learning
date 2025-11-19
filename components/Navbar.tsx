"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getUser, clearUser } from "@/lib/localStorageHelper";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUserName(u.name || u.email);
    }
  }, []);

  const handleLogout = () => {
    clearUser();
    setUserName(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-semibold">LMS Platform</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm">Dashboard</Link>
          <Link href="/katalog" className="text-sm">Katalog Kursus</Link>

          {userName ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-700">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-500 hover:text-neutral-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
