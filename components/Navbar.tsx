"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const userName = user?.name || user?.email || null;
  const isLoggedIn = !!userName;

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        {/* Brand kiri */}
        <div className="flex items-center gap-2">
          <div
            className={
              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold " +
              (isLoggedIn ? "bg-blue-600" : "bg-red-600")
            }
          >
            <span>L</span>
          </div>
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-neutral-900"
          >
            LMS Platform
          </Link>
        </div>

        {/* Menu + area user kanan */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className={
                isLoggedIn
                  ? "text-blue-600 font-medium"
                  : "text-neutral-700 hover:text-neutral-900"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/katalog"
              className={
                isLoggedIn
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900"
              }
            >
              Katalog Kursus
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Icon notifikasi */}
              <button className="relative text-neutral-500 hover:text-neutral-800">
                <span className="sr-only">Notifikasi</span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3C9.8 3 8 4.8 8 7v1.1C6.2 8.6 5 10.2 5 12v5l-1 1v1h16v-1l-1-1v-5c0-1.8-1.2-3.4-3-3.9V7c0-2.2-1.8-4-4-4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Avatar + nama user */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-neutral-800 max-w-[140px] truncate">
                  {userName}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-neutral-500 hover:text-neutral-800 ml-1"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
