"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const userName = user?.name || user?.email || null;
  const isLoggedIn = !!userName;
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50 font-sans">
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

        {/* Tombol hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>

        {/* Menu + area user kanan (desktop) */}
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
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-800 ml-1"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="border-red-400">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile dropdown dengan animasi smooth */}
      <div
        className={`md:hidden border-t bg-white overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-3 text-sm">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            className="text-neutral-700 hover:text-neutral-900"
          >
            Katalog Kursus
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                logout();
                router.push("/");
              }}
              className="text-left text-neutral-500 hover:text-neutral-800"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="w-full border-red-400">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  Daftar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
