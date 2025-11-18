AWS Inovasi E-Learning — Next.js + TypeScript + shadcn/ui

Platform e-learning modern yang dibangun menggunakan Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, dan sistem autentikasi lokal menggunakan LocalStorage.
Aplikasi ini memiliki fitur login, register, dashboard, serta komponen UI yang reusable.

Fitur Utama
> Autentikasi (LocalStorage),
> Register user baru,
> Login dengan email & password,
> Logout.

Redirect otomatis:
> Setelah register → login,
> Setelah login → homepage/dashboard,
> Auth state global menggunakan AuthProvider + useAuth() hook.

🎨 UI Modern dengan shadcn/ui
Komponen UI reusable: Button, Input, Card, dll.
Style mengikuti standar desain modern (e.g. rounded, padding, transition).
Mendukung dark/light mode dengan tailwind custom theme.

📚 Dashboard & Course
Halaman utama menampilkan course-card.
Struktur komponen modular dan mudah diperluas.

🧩 Arsitektur Terstruktur
Tanpa folder src/, semua file berada di level root seperti standar Next.js App Router.
Pemisahan folder: app, components, lib, types, public.