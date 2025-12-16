# 🎓 AWS Inovasi E-Learning Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)

**Platform e-learning modern untuk pembelajaran digital yang interaktif dan engaging**

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Struktur](#-struktur-project) • [Roadmap](#-roadmap)

</div>

---

## 📖 Tentang Project

AWS Inovasi E-Learning adalah platform Learning Management System (LMS) yang dibangun dengan teknologi modern. Platform ini dirancang untuk memberikan pengalaman belajar yang interaktif dengan fitur-fitur seperti:

- 🎥 Video pembelajaran embedded
- 📝 Quiz interaktif dengan scoring
- 🏆 Sistem sertifikat otomatis
- 👨‍💼 Dashboard admin untuk manajemen konten
- 📱 Fully responsive untuk semua device

> **Note**: Versi saat ini adalah **Demo Stage** menggunakan localStorage. Production version akan menggunakan **Supabase** untuk backend.

---

## ✨ Fitur Utama

### 🔐 Authentication System
- Login & Register dengan email/password
- Role-based access (Admin / User)
- Protected routes dengan redirect
- Forgot password flow

### 📚 Course Management
- Katalog kursus dengan search & filter
- Detail kursus dengan curriculum preview
- Purchase & subscription system
- Admin CRUD untuk courses

### 📖 Learning Experience
- Module-based learning path
- Video & text content support
- Interactive quiz dengan instant feedback
- Progress tracking per-user
- Auto-save progress

### 🏆 Certificate System
- Auto-generate setelah course completion
- Download sebagai PDF
- Certificate gallery di dashboard

### 👨‍💼 Admin Dashboard
- Course management (CRUD)
- User management
- Access control (grant/revoke)
- Analytics overview

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16+ (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.x |
| **Styling** | TailwindCSS 4.x |
| **Components** | shadcn/ui (Radix UI) |
| **Forms** | React Hook Form + Zod |
| **Animation** | AOS (Animate On Scroll) |
| **Icons** | Lucide React |
| **PDF** | jsPDF + html2canvas |
| **Storage** | localStorage (demo) → Supabase (planned) |

---

## 🚀 Instalasi

### Prerequisites
- Node.js ≥ 18.x
- npm atau yarn atau pnpm

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/WildanAbdelF/aws-inovasi-e-learning.git
cd aws-inovasi-e-learning

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Buka browser: **http://localhost:3000**

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📁 Struktur Project

```
aws-inovasi-e-learning/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # Root layout dengan providers
│   ├── 📄 page.tsx                  # Homepage
│   ├── 📄 globals.css               # Global styles
│   │
│   ├── 📂 admin/                    # 🔒 Admin pages (protected)
│   │   ├── 📄 page.tsx              # Admin dashboard
│   │   ├── 📂 courses/              # Course management
│   │   │   ├── 📂 new/              # Create new course
│   │   │   └── 📂 [id]/             # Edit course
│   │   ├── 📂 dashboard/            # Admin analytics
│   │   └── 📂 users/                # User management
│   │
│   ├── 📂 courses/                  # Public course pages
│   │   └── 📂 [id]/                 # Course detail
│   │
│   ├── 📂 dashboard/                # 🔒 User dashboard
│   ├── 📂 katalog/                  # Course catalog
│   │
│   ├── 📂 learn/                    # 🔒 Learning pages
│   │   └── 📂 [courseId]/
│   │       └── 📂 [moduleId]/
│   │           └── 📂 [itemId]/     # Lesson/quiz page
│   │
│   ├── 📂 login/                    # Auth pages
│   ├── 📂 register/
│   ├── 📂 forgot-password/
│   │   ├── 📂 sent/
│   │   └── 📂 reset/
│   │
│   └── 📂 settings/                 # User settings
│
├── 📂 components/                   # React components
│   ├── 📄 index.ts                  # Barrel exports
│   │
│   ├── 📂 certificate/              # Certificate components
│   │   └── 📄 CertificateModal.tsx
│   │
│   ├── 📂 course/                   # Course components
│   │   ├── 📄 CourseCard.tsx
│   │   ├── 📄 CourseCatalog.tsx
│   │   ├── 📄 CourseList.tsx
│   │   └── 📄 index.ts
│   │
│   ├── 📂 home/                     # Landing page sections
│   │   ├── 📄 HeroSection.tsx
│   │   ├── 📄 FeaturedCourses.tsx
│   │   ├── 📄 LearningModels.tsx
│   │   ├── 📄 Testimonials.tsx
│   │   ├── 📄 CTASection.tsx
│   │   └── 📄 index.ts
│   │
│   ├── 📂 layout/                   # Layout components
│   │   ├── 📄 Navbar.tsx
│   │   ├── 📄 Footer.tsx
│   │   └── 📄 index.ts
│   │
│   ├── 📂 providers/                # Context providers
│   │   ├── 📄 AuthProvider.tsx
│   │   ├── 📄 AOSProvider.tsx
│   │   └── 📄 index.ts
│   │
│   └── 📂 ui/                       # shadcn/ui components
│       ├── 📄 button.tsx
│       ├── 📄 card.tsx
│       ├── 📄 dialog.tsx
│       ├── 📄 form.tsx
│       ├── 📄 input.tsx
│       ├── 📄 label.tsx
│       └── 📄 sheet.tsx
│
├── 📂 lib/                          # Utilities & helpers
│   ├── 📄 utils.ts                  # General utilities (cn, etc.)
│   ├── 📄 localStorageHelper.ts     # localStorage CRUD
│   ├── 📄 adminCoursesStorage.ts    # Admin course management
│   │
│   ├── 📂 data/                     # Static/dummy data
│   │   ├── 📄 courses.data.ts       # Sample courses
│   │   └── 📄 index.ts
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── 📄 useInView.ts          # Intersection observer hook
│   │   └── 📄 index.ts
│   │
│   └── 📂 services/                 # 🔮 API services (future)
│
├── 📂 types/                        # TypeScript definitions
│   ├── 📄 course.ts                 # Course, Module, Quiz types
│   └── 📄 user.ts                   # User types
│
├── 📂 public/                       # Static assets
│   └── 📂 images/                   # Course images, etc.
│
├── 📂 styles/                       # Additional CSS
│   └── 📄 custom.css
│
├── 📄 components.json               # shadcn/ui config
├── 📄 next.config.ts                # Next.js config
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 package.json
└── 📄 PROMPTING_GUIDELINE.md        # AI prompting guide
```

---

## 🔐 Role & Access Control

| Page | Guest | User | Admin |
|------|-------|------|-------|
| Homepage | ✅ | ✅ | ✅ |
| Katalog | ✅ | ✅ | ✅ |
| Course Detail | ✅ | ✅ | ✅ |
| Login/Register | ✅ | ❌ | ❌ |
| User Dashboard | ❌ | ✅ | ✅ |
| Learning Page | ❌ | ✅* | ✅* |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Course Management | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |

*Requires course access (purchase/subscription/granted)

---

## 💾 Data Storage

### Current (Demo Stage)
Data disimpan di browser localStorage dengan keys:

| Key | Description |
|-----|-------------|
| `lms_user` | Current logged-in user |
| `lms_registered_users` | All registered users |
| `lms_purchases` | Lifetime course purchases |
| `lms_course_subscriptions` | Active subscriptions |
| `lms_certificates` | User certificates |
| `lms_admin_courses` | Admin-created courses |
| `lms_course_progress_{email}` | User learning progress |

### Planned (Supabase)
Akan migrasi ke Supabase dengan struktur:

```sql
-- Tables
users, courses, modules, module_contents,
quiz_questions, user_courses, user_progress, certificates
```

---

## 🎨 Design System

### Typography
- **Headings**: Montserrat (600-900 weight)
- **Body**: Poppins (300-700 weight)

### Colors
- **Primary**: Red (#dc2626)
- **Background**: White/Neutral-50
- **Text**: Neutral-900

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 📋 Roadmap

### ✅ Phase 1: Demo Stage (Current)
- [x] Authentication system
- [x] Course catalog & detail
- [x] Learning experience dengan quiz
- [x] Certificate generation
- [x] Admin dashboard
- [x] User management

### 🔄 Phase 2: Supabase Integration
- [ ] Setup Supabase project
- [ ] Migrate auth to Supabase Auth
- [ ] Create database tables
- [ ] Implement API services layer
- [ ] Real-time progress sync

### 🔮 Phase 3: Enhanced Features
- [ ] Payment integration
- [ ] Video upload & streaming
- [ ] Discussion forum
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Project ini dibuat untuk keperluan internal AWS Inovasi.

---

## 📞 Contact

**AWS Inovasi Team**
- GitHub: [@WildanAbdelF](https://github.com/WildanAbdelF)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

</div>