# 🎓 AWS Inovasi E-Learning Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?style=for-the-badge&logo=supabase)

**Platform e-learning modern untuk pembelajaran digital yang interaktif dan engaging**

[Fitur](#-fitur-utama) • [Arsitektur](#-arsitektur) • [Instalasi](#-instalasi) • [Struktur](#-struktur-project) • [Database](#-database-schema)

</div>

---

## 📖 Tentang Project

AWS Inovasi E-Learning adalah platform Learning Management System (LMS) modern yang dibangun sebagai *Full-Stack Next.js Application*. Platform ini sudah dirancang untuk berjalan end-to-end menggunakan **REST API internal** yang terhubung langsung ke **Supabase (PostgreSQL, Auth, dan Storage)**.

Project ini tidak lagi berada dalam tahap demo *localStorage*, melainkan sudah menjadi sistem e-learning operasional dengan integrasi database terpusat yang scalable.

---

## 🏗 Arsitektur

Aplikasi ini menggunakan arsitektur terkini dalam ekosistem Next.js. Komunikasi antara Client dan Database sepenuhnya di-proxy melalui *Route Handlers* Next.js di `/app/api`, menjamin keamanan sekaligus fleksibilitas pengelolaan bisnis logic.

### Alur Utama (High-Level Architecture):
1. **Client / Frontend (React Server & Client Components)**: Menangani UI/UX dengan optimasi SEO.
2. **Next.js API Routes (`/api/...`)**: Bertindak sebagai *BFF (Backend For Frontend)*. Menyembunyikan *logic* dan interaksi langsung dengan Supabase guna keamanan.
3. **Supabase (Backend-as-a-Service)**:
   - **Database**: PostgreSQL untuk menyimpan data `users`, `courses`, `modules`, `progress`, dll.
   - **Auth**: Autentikasi berbasis token, dengan integrasi Next.js Middleware untuk proteksi _route_ aman (menggunakan _HttpOnly Cookies_).
   - **Storage**: Digunakan untuk menyimpan asset publik seperti _thumbnail courses_ dan _media upload_.
4. **LLM Engine (Opsional - Backend)**: Integrasi external AI (seperti Gemini/OpenAI) untuk men-generate quiz berbasis Artificial Intelligence di sisi admin.

---

## ✨ Fitur Utama

### 🔐 Authentication System
- Supabase Auth Authentication.
- Secure HttpOnly Cookie Session Management.
- Login & Register, validasi *Role-Based Access Control* (Admin vs User).
- *Forgot Password Flow* bawaan Supabase (Email Link).

### 📚 Course & Content Management
- Katalog kursus dengan kapabilitas pencarian & filtering.
- Kursus bersifat modular (Module $\rightarrow$ Content/Quiz).
- Pembelian & manajemen langganan (_Subscription_ dan _Lifetime Access_).
- Manajemen data *Course* (CRUD lengkap oleh Admin) via API Supabase.
- Upload Gambar ke public bucket Supabase.

### 🤖 AI Quiz Generation
- Generator soal (MCQ) yang ditenagai oleh konfigurasi sistem *LLM* otomatis.
- Admin bisa generate *quiz/assessment* hanya dari teks/konten materi, yang diolah di *API Layer*.

### 📖 Learning Experience & Tracking
- Player modul belajar (teks, video embdded).
- Tes/Quiz interaktif dengan sistem _scoring_.
- Pelacakan progress pengguna disimpan aman ke database (`user_progress`).

### 🏆 Certificate System
- *Auto-generate* setelah pengguna menyelesaikan seluruh materi & lulus ujian.
- Cetak PDF client-side dengan *jsPDF* & *html2canvas*.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16+ (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.x |
| **Styling** | TailwindCSS 4.x |
| **Components** | shadcn/ui (Radix UI) |
| **Database & Auth** | Supabase (PostgreSQL) |
| **File Storage** | Supabase Storage (`course-media` bucket) |
| **Animation** | AOS (Animate On Scroll) |
| **Icons** | Lucide React |

---

## 🚀 Instalasi

### Prerequisites
- Node.js ≥ 18.x
- Akun dan Project Supabase yang sudah disetup (lihat `supabase/schema.sql`).

### Quick Start

1. **Clone repository**
   ```bash
   git clone https://github.com/WildanAbdelF/aws-inovasi-e-learning.git
   cd aws-inovasi-e-learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environments Setup**
   Buat file `.env.local` di root, isi variabel konfigurasi:
   ```env
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   
   # SUPABASE CONFIGURATION
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
   SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
   
   # STORAGE BUCKET (opsional, default: course-media)
   NEXT_PUBLIC_SUPABASE_COURSE_MEDIA_BUCKET="course-media"
   
   # AI QUIZ GENERATOR API KEY (misal Google Gemini)
   GEMINI_API_KEY="YOUR_API_KEY"
   ```

4. **Database Setup**
   Jalankan query di `supabase/schema.sql` pada SQL Editor di dashboard Supabase milik Anda untuk membuat table-table terkait.

5. **Run development server**
   ```bash
   npm run dev
   ```
   Buka browser: **http://localhost:3000**

---

## 📁 Struktur Project

Struktur utama sudah menerapkan praktik pemisahan tugas (*separation of concern*):

```
aws-inovasi-e-learning/
│
├── 📂 app/                          # Next.js App Router (UI & API)
│   ├── 📂 api/                      # 📡 BE Route Handlers (API Server)
│   │   ├── 📂 admin/                # API manajemen admin (metrics, dll)
│   │   ├── 📂 auth/                 # API autentikasi & manajemen sesi cookie
│   │   ├── 📂 courses/              # API public & detail kursus
│   │   ├── 📂 quiz/                 # 🤖 API integrasi AI Auto-generate
│   │   ├── 📂 uploads/              # API upload image ke Supabase Storage
│   │   └── 📂 users/                # API profil pengguna dan progress
│   │
│   ├── 📂 admin/                    # 🔒 Admin Pages (Dashboard, Course CRUD)
│   ├── 📂 courses/                  # Course Public Pages
│   ├── 📂 learn/                    # 🔒 Learning Path View
│   └── 📂 (auth)/                   # Halaman Login/Register/Reset Password
│
├── 📂 components/                   # React UI Components
│
├── 📂 lib/                          # System Configuration & Services
│   ├── 📄 supabase.ts               # Klien Supabase Server Side
│   ├── 📄 supabaseBrowser.ts        # Klien Supabase Client Side
│   ├── 📄 serverAuth.ts             # Server-side auth verifier
│   └── 📂 services/                 # Frontend fetcher API (Wrapper pemanggil /api)
│
├── 📂 docs/                         # Info teknis sistem, flowchart & guideline API
├── 📂 supabase/                     # Schema Database SQL
└── 📂 types/                        # TypeScript Interface definitions (Domain Model)
```

---

## 🗄 Database Schema

Database menggunakan PostgreSQL (via Supabase). Tabel utama yang menangani operasional platform:

1. **`users`**: Data pendaftar LMS. Tersinkronisasi dengan Supabase Auth.
2. **`courses`**: Main master table berisi data kursus, *curriculum*, dll.
3. **`modules` & `module_contents`**: Daftar bab modul, serta isinya (teks/video/quiz).
4. **`quiz_questions`**: Tabel penyimpanan untuk soal pilihan ganda dari modul *Type=Quiz*.
5. **`user_courses`**: Pendaftaran / Kepemilikan kursus *(Enrollment)* beserta batas waktu *(Subscription)*.
6. **`user_progress`**: Rekam jejak *module content* spesifik yang selesai dibaca/diteskan pengguna.
7. **`certificates`**: Bukti historis sertifikat yang digenerate oleh sistem pasca course berstatus 100% *completed*.

> Skema lengkap dapat dilihat di `docs/SUPABASE_SCHEMA.md` atau `supabase/schema.sql`.

---

## 📋 Masa Depan / Roadmap

- [ ] **Payment Gateway Integration** (Midtrans/Xendit) untuk pembelian real-time.
- [ ] **Advanced Video Handling**: Streaming via CDN private / HLS Support.
- [ ] **Discussion Board / Q&A**: Interaksi siswa dengan instruktur dalam platform materi.
- [ ] **Push Notification / Real-time alerts**: Notifikasi via Supabase Real-time websockets.

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License
Project ini dilindungi dan di-maintain secara spesifik untuk internal/proyek AWS Inovasi.

---
<div align="center">
**Built with ❤️ using Next.js, API First Strategy, and Supabase Database**
</div>
