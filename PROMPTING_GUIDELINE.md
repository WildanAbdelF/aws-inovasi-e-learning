# 🤖 AI Prompting Guideline — AWS Inovasi E-Learning Platform

Dokumen ini berisi panduan untuk memberikan konteks yang tepat kepada AI/LLM saat meminta bantuan development pada project ini.

---

## 📋 Project Overview

### Deskripsi Singkat
AWS Inovasi E-Learning adalah platform pembelajaran online (LMS) modern yang dibangun menggunakan **Next.js 16+ App Router**, **TypeScript**, **TailwindCSS 4**, dan **shadcn/ui**. Saat ini menggunakan **localStorage** sebagai temporary data storage untuk demo, dan akan diintegrasikan dengan **Supabase** untuk production.

### Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React Framework dengan App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| TailwindCSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | UI Component Library (Radix UI based) |
| Zod | 4.x | Schema Validation |
| React Hook Form | 7.x | Form Management |
| AOS | 2.x | Scroll Animations |
| Lucide React | Latest | Icon Library |

### Fitur Utama
1. **Authentication** - Login/Register dengan role-based access (admin/user)
2. **Course Catalog** - Daftar kursus dengan search & filter
3. **Course Learning** - Modul pembelajaran dengan video, content, dan quiz
4. **Admin Dashboard** - CRUD management untuk courses dan users
5. **User Dashboard** - Akses course yang dimiliki dan sertifikat
6. **Certificate System** - Generate dan download sertifikat PDF

---

## 📁 Project Structure Context

### Folder Utama
```
aws-inovasi-e-learning/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin-only pages (protected)
│   ├── courses/            # Public course detail pages
│   ├── dashboard/          # User dashboard (protected)
│   ├── katalog/            # Course catalog page
│   ├── learn/              # Learning pages (protected)
│   ├── login/              # Auth pages
│   ├── register/
│   ├── forgot-password/
│   └── settings/           # User settings
│
├── components/             # Reusable React components
│   ├── certificate/        # Certificate-related components
│   ├── course/             # Course card, list, catalog
│   ├── home/               # Landing page sections
│   ├── layout/             # Navbar, Footer
│   ├── providers/          # Context providers (Auth, AOS)
│   └── ui/                 # shadcn/ui primitives
│
├── lib/                    # Utilities & business logic
│   ├── data/               # Static/dummy data
│   ├── hooks/              # Custom React hooks
│   ├── services/           # (Planned) API service layer
│   ├── localStorageHelper.ts  # localStorage utilities
│   ├── adminCoursesStorage.ts # Admin course CRUD
│   └── utils.ts            # General utilities (cn, etc.)
│
├── types/                  # TypeScript type definitions
│   ├── course.ts           # Course, Module, Quiz types
│   └── user.ts             # User type
│
├── public/                 # Static assets
│   └── images/             # Course images, etc.
│
└── styles/                 # Additional CSS files
    └── custom.css
```

### Type Definitions

#### User Type
```typescript
type StoredUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  subscriptionStatus?: "active" | "inactive" | "pending";
  lifetimeCourses?: { id: string; title: string }[];
};
```

#### Course Types
```typescript
interface Course {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description?: string;
  curriculum?: string[];
  modules?: CourseModule[];
}

interface CourseModule {
  id: string;
  title: string;
  items: CourseModuleContent[];
}

interface CourseModuleContent {
  id: string;
  title: string;
  type: "page" | "quiz";
  content: string;
  mediaUrl?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
}
```

---

## 🎯 Prompting Templates

### 1. General Development Request
```
Saya sedang mengerjakan project AWS Inovasi E-Learning:
- Tech Stack: Next.js 16 App Router, React 19, TypeScript, TailwindCSS 4, shadcn/ui
- Current State: Demo dengan localStorage, akan migrasi ke Supabase
- UI Pattern: shadcn/ui components dengan Radix UI primitives

[Jelaskan request kamu di sini]
```

### 2. Component Development
```
Context: AWS Inovasi E-Learning - Next.js 16 + shadcn/ui

Saya ingin membuat component [NAMA_COMPONENT] untuk:
- Tujuan: [jelaskan fungsi component]
- Props yang dibutuhkan: [list props]
- Styling: Gunakan TailwindCSS + shadcn/ui components
- Location: components/[folder]/[ComponentName].tsx

Existing patterns:
- Gunakan "use client" untuk client components
- Import shadcn dari @/components/ui/*
- Gunakan cn() dari @/lib/utils untuk className
```

### 3. Page Development
```
Context: AWS Inovasi E-Learning - Next.js 16 App Router

Saya ingin membuat page [NAMA_PAGE]:
- Route: /[path]
- Type: [Client Component / Server Component]
- Features: [list fitur]
- Protected: [Ya/Tidak] - gunakan useAuth() hook jika protected
- Data: Sementara pakai localStorage dari @/lib/localStorageHelper.ts

Patterns yang digunakan:
- Semua page yang butuh state adalah Client Component ("use client")
- Protected routes redirect ke /login jika tidak authenticated
- Admin routes check role === "admin"
```

### 4. API Integration (Supabase Migration)
```
Context: Migrasi AWS Inovasi E-Learning ke Supabase

Current State:
- Data disimpan di localStorage
- Helper functions di lib/localStorageHelper.ts
- Course data di lib/data/courses.data.ts

Migration Request:
- Feature: [nama feature]
- Current localStorage key: [key name]
- Supabase table yang akan digunakan: [table name]
- Operations: [CRUD operations yang dibutuhkan]
```

### 5. Bug Fix / Debugging
```
Context: AWS Inovasi E-Learning - Next.js 16 + TypeScript

File: [path/to/file]
Error: [paste error message]

Yang sudah dicoba:
- [list percobaan]

Expected behavior:
- [jelaskan expected behavior]
```

### 6. UI/UX Enhancement
```
Context: AWS Inovasi E-Learning - TailwindCSS 4 + shadcn/ui

Component: [nama component atau page]
Current: [describe current state]
Enhancement: [describe desired improvement]

Design system:
- Fonts: Montserrat (headings), Poppins (body)
- Primary color: Red (#dc2626)
- Animations: AOS untuk scroll animations
```

---

## 🔄 State Management Context

### Current Data Flow
1. **Authentication**: `AuthProvider` → Context API → `useAuth()` hook
2. **Course Data**: Static data (`dummyCourses`) + Admin created (`getAdminCourses()`)
3. **User Progress**: localStorage per-user dengan key `lms_course_progress_{email}`
4. **Purchases/Subscriptions**: localStorage arrays

### localStorage Keys
```typescript
const LS_KEYS = {
  USER: "lms_user",                    // Current session
  REGISTERED_USERS: "lms_registered_users", // All users
  PURCHASES: "lms_purchases",          // Lifetime purchases
  SUBSCRIPTIONS: "lms_course_subscriptions",
  CERTIFICATES: "lms_certificates",
  ADMIN_COURSES: "lms_admin_courses",  // Admin-created courses
};
```

---

## 🚀 Supabase Migration Roadmap

Ketika bermigrasi ke Supabase, perlu dibuat:

### Tables
1. `users` - User accounts dengan role
2. `courses` - Course data (replace dummyCourses)
3. `modules` - Course modules
4. `module_contents` - Module items (pages, quizzes)
5. `quiz_questions` - Quiz data
6. `user_courses` - User course access (purchases/subscriptions)
7. `user_progress` - Learning progress tracking
8. `certificates` - Generated certificates

### Services Layer
Buat di `lib/services/`:
- `auth.service.ts` - Supabase Auth
- `course.service.ts` - Course CRUD
- `progress.service.ts` - Progress tracking
- `certificate.service.ts` - Certificate management

---

## 📝 Code Style Guidelines

### Naming Conventions
- **Components**: PascalCase (`CourseCard.tsx`)
- **Hooks**: camelCase dengan prefix `use` (`useAuth.ts`)
- **Utilities**: camelCase (`localStorageHelper.ts`)
- **Types**: PascalCase (`Course`, `StoredUser`)

### Import Aliases
```typescript
import { Component } from "@/components/...";
import { utility } from "@/lib/...";
import { Type } from "@/types/...";
```

### Component Structure
```tsx
"use client"; // jika client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ... imports

type Props = {
  // prop types
};

export default function ComponentName({ props }: Props) {
  // hooks
  // state
  // effects
  // handlers
  // render
}
```

---

## ⚠️ Common Pitfalls

1. **SSR vs CSR**: Pastikan localStorage hanya diakses di client dengan check `typeof window !== 'undefined'`

2. **Role Protection**: Admin pages harus check `user.role === "admin"`

3. **Course Access**: User harus punya akses (purchase/subscription/admin-granted) untuk belajar

4. **Type Safety**: Selalu gunakan proper types, hindari `any`

5. **shadcn/ui**: Import dari `@/components/ui/`, bukan langsung dari Radix

---

## 💡 Tips untuk Prompting yang Efektif

1. **Selalu sertakan konteks tech stack** (Next.js 16, App Router, shadcn/ui)
2. **Jelaskan current state** (localStorage untuk demo)
3. **Sebutkan file path** jika modifikasi existing code
4. **Berikan expected behavior** yang jelas
5. **Sertakan constraints** (mobile responsive, accessible, etc.)

---

*Last updated: December 2024*
*Version: 0.1.0 - Demo Stage*
