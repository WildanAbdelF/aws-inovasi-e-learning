

# 🚀 AWS Inovasi E-Learning — Next.js + TypeScript + shadcn/ui

Platform e-learning modern yang dibangun menggunakan **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, serta autentikasi lokal berbasis LocalStorage.
Aplikasi ini mencakup fitur login, register, dashboard, dan komponen UI yang reusable.

---

# 📥 Instalasi & Setup Project

Ikuti langkah-langkah berikut untuk menjalankan project dari awal.

---

## 1️⃣ **Clone Repository**

Jika project sudah ada di GitHub:

```bash
git clone <your-repository-url>
cd aws-inovasi-e-learning
```

Jika belum, cukup masuk ke folder project yang sudah dibuat di lokal.

---

## 2️⃣ **Install Dependencies**

Pastikan Node.js ≥ 18 sudah terinstall.

```bash
npm install
```

---

## 3️⃣ **Jalankan Server Development**

Setelah seluruh dependency terpasang:

```bash
npm run dev
```

Buka di browser:
👉 [http://localhost:3000](http://localhost:3000)

---

# 🔧 Setup Dari Nol (Jika Membuat Proyek Baru)

Jika ingin membangun project ini dari awal (clean setup), gunakan langkah berikut:

---

## 1️⃣ **Buat Project Next.js Baru**

```bash
npx create-next-app@latest aws-inovasi-e-learning --typescript --tailwind --app --eslint
```

Pilih:

* Yes → TypeScript
* Yes → TailwindCSS
* Yes → App Router
* Yes → src directory (No → karena project kita tidak memakai `src`)

Masuk ke folder:

```bash
cd aws-inovasi-e-learning
```

---

## 2️⃣ **Install shadcn/ui**

```bash
npx shadcn@latest init
```

Kemudian tambahkan komponen utama:

```bash
npx shadcn@latest add button input card avatar form dropdown-menu
```

---

## 3️⃣ **Struktur Folder Project**

Karena aplikasi ini tidak memakai folder `src/`, maka struktur folder:

```
aws-inovasi-e-learning/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│
├── components/
│   ├── ui/                 # Komponen shadcn
│   ├── Navbar.tsx
│   ├── CourseCard.tsx
│   └── Footer.tsx
│
├── lib/
│   ├── AuthProvider.tsx     # Context global Auth
│   └── localAuth.ts         # Logic login/register/localStorage
│
├── types/
│   └── user.ts
│
├── public/
│   └── images/
│
├── tailwind.config.ts
└── package.json
```

---

# 🔐 Fitur Autentikasi

Autentikasi dicatat menggunakan `localStorage`.

### Fitur:

* Register user baru
* Login email + password
* Logout
* Redirect otomatis:

  * Register → Login
  * Login → Homepage
* `AuthProvider` + `useAuth()` sudah menangani:

  * current user
  * state global
  * proteksi halaman jika dibutuhkan

---

# 🎨 UI Modern dengan shadcn/ui

Project ini menggunakan shadcn/ui untuk membangun UI yang:

* Konsisten
* Modular
* Mudah digunakan
* Mengikuti standar desain modern

Komponen yang dipakai:

* `<Button>`
* `<Input>`
* `<Card>`
* `<Avatar>`
* `<DropdownMenu>`
* `<Form>`
  dan lainnya.

---

# 🧩 Dashboard & Course

* Halaman utama menampilkan daftar course dalam bentuk Card.
* Data course masih menggunakan dummy data.
* Komponen UI reusable agar mudah dikembangkan kembali.

---

# ▶️ Cara Menjalankan Project Lagi di Lain Waktu

Setiap kali kamu ingin menjalankan:

```bash
npm install   # hanya jika ada perubahan dependency
npm run dev
```

---

# 🚀 Rencana Pengembangan Berikutnya

* Integrasi penuh dengan Supabase (Auth, Database, Storage)
* Halaman admin untuk membuat course
* Upload thumbnail course
* Pembayaran / Enrollment
* Learning page (video + attachments)
* Role-based authorization

---