"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-semibold">LMS Platform</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/katalog" className="text-sm">Katalog Kursus</Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
            <Link href="/register">Daftar</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
