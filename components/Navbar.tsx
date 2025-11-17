"use client";

import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">LMS Platform</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm">Katalog Kursus</a>
          <Button variant="outline">Login</Button>
          <Button className="bg-red-600 hover:bg-red-700">Daftar</Button>
        </div>
      </div>
    </nav>
  );
}
