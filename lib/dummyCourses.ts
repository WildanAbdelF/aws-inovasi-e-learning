import { Course } from "@/types/course";

export const dummyCourses: Course[] = [
  {
    id: "1",
    title: "UX Design Mastery",
    author: "Jane Doe",
    price: 500000,
    image: "/images/course1.jpg",
    description:
      "Kuasai seluruh fondasi desain pengalaman pengguna mulai dari riset hingga prototyping dengan studi kasus nyata.",
    curriculum: [
      "Pengenalan UX",
      "Dasar-dasar UX",
      "Prinsip Desain",
      "Riset Pengguna",
      "Studi Kasus",
      "Prototyping",
      "Kuis Akhir",
      "Sertifikat",
    ],
    modules: [
      {
        id: "m1-intro",
        title: "Pengenalan Kursus",
        items: [
          {
            id: "m1-i1",
            title: "Selamat Datang di Kursus",
            type: "page",
            content:
              "Di modul pertama ini Anda akan memahami tujuan kursus, struktur pembelajaran, serta gambaran besar proses desain UX modern.",
            mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
          {
            id: "m1-i2",
            title: "Mindset Seorang UX Designer",
            type: "page",
            content:
              "Desainer UX berperan sebagai jembatan antara bisnis dan pengguna. Mindset eksplorasi, empati, dan data-driven adalah fondasi penting.",
          },
        ],
      },
      {
        id: "m2-foundation",
        title: "Dasar-dasar UX",
        items: [
          {
            id: "m2-i1",
            title: "Proses Desain UX",
            type: "page",
            content:
              "Pelajari tahapan Discover, Define, Develop, Deliver dan bagaimana setiap tahapan membantu membangun produk yang relevan.",
          },
          {
            id: "m2-i2",
            title: "Persona & Journey Map",
            type: "page",
            content:
              "Persona membantu memusatkan diskusi pada pengguna tertentu, sementara journey map menvisualisasikan pengalaman end-to-end.",
          },
        ],
      },
      {
        id: "m3-principles",
        title: "Prinsip Desain",
        items: [
          {
            id: "m3-i1",
            title: "Prinsip-prinsip Utama dalam Desain",
            type: "page",
            content:
              "Desain hebat bukan hanya estetika; ini soal pengalaman intuitif, efisien, dan menyenangkan. Hirarki visual, kontras, dan feedback membantu pengguna memahami konteks.\n\n1. Hirarki Visual — Gunakan ukuran, warna, dan kontras untuk menonjolkan informasi prioritas.\n\n2. Kontras — Kontras warna dan bentuk membantu keterbacaan dan aksesibilitas.\n\n3. Umpan Balik — Pastikan setiap aksi pengguna memiliki respon visual maupun mikro interaksi.",
            mediaUrl: "https://www.youtube.com/embed/7HshCufmqUg",
          },
          {
            id: "m3-i2",
            title: "Tipografi dan Warna",
            type: "page",
            content:
              "Tipografi menentukan ritme membaca, sedangkan warna memandu emosi. Gunakan skala tipografi konsisten dan kontras warna WCAG.",
            mediaUrl: "/images/ux-typography.png",
          },
        ],
      },
      {
        id: "m4-research",
        title: "Riset Pengguna",
        items: [
          {
            id: "m4-i1",
            title: "Metode Riset Populer",
            type: "page",
            content:
              "Kenali wawancara mendalam, usability testing, dan survey kuantitatif. Pilih metode sesuai hipotesis yang ingin diuji.",
          },
          {
            id: "m4-i2",
            title: "Mengubah Insight menjadi Prioritas",
            type: "page",
            content:
              "Gunakan matriks impact-effort untuk memprioritaskan temuan riset agar roadmap lebih fokus pada kebutuhan penting pengguna.",
          },
        ],
      },
      {
        id: "m5-case",
        title: "Studi Kasus",
        items: [
          {
            id: "m5-i1",
            title: "Merancang Aplikasi Edukasi",
            type: "page",
            content:
              "Ikuti walkthrough studi kasus merancang aplikasi edukasi, mulai dari problem statement hingga high-fidelity prototype.",
          },
          {
            id: "m5-i2",
            title: "Presentasi Portofolio",
            type: "page",
            content:
              "Pelajari cara menyusun portofolio yang menceritakan proses dan dampak desain Anda secara jelas.",
          },
        ],
      },
      {
        id: "m6-proto",
        title: "Prototyping",
        items: [
          {
            id: "m6-i1",
            title: "Figma Prototyping",
            type: "page",
            content:
              "Bangun prototipe interaktif dengan komponen, variant, dan prototyping flow di Figma.",
          },
          {
            id: "m6-i2",
            title: "Handoff ke Developer",
            type: "page",
            content:
              "Gunakan fitur Inspect untuk menyiapkan spesifikasi desain dan asset agar implementasi konsisten.",
          },
        ],
      },
      {
        id: "m7-quiz",
        title: "Kuis Akhir",
        items: [
          {
            id: "m7-i1",
            title: "Kuis Evaluasi",
            type: "quiz",
            content:
              "Jawab 10 pertanyaan pilihan ganda untuk menguji pemahaman Anda mengenai konsep UX yang telah dipelajari.",
          },
        ],
      },
      {
        id: "m8-cert",
        title: "Sertifikat",
        items: [
          {
            id: "m8-i1",
            title: "Klaim Sertifikat",
            type: "page",
            content:
              "Setelah menyelesaikan seluruh modul dan kuis, Anda dapat mengunduh sertifikat penyelesaian di sini.",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Digital Marketing 101",
    author: "John Smith",
    price: 499000,
    image: "/images/course2.jpg",
    description:
      "Pelajari seluruh channel pemasaran digital untuk meningkatkan awareness, akuisisi, dan retensi pelanggan.",
    curriculum: [
      "Dasar Marketing",
      "SEO & SEM",
      "Social Media",
      "Content & Analytics",
    ],
    modules: [
      {
        id: "dm1-basics",
        title: "Dasar-dasar Marketing",
        items: [
          {
            id: "dm1-i1",
            title: "Marketing Funnel Modern",
            type: "page",
            content:
              "Kenali funnel AARRR dan bagaimana channel digital mendukung setiap tahap customer journey.",
          },
          {
            id: "dm1-i2",
            title: "Key Metrics",
            type: "page",
            content:
              "Pelajari metrik penting seperti CPA, ROAS, CLV, serta bagaimana membaca dashboard kampanye.",
          },
        ],
      },
      {
        id: "dm2-seo",
        title: "SEO & SEM",
        items: [
          {
            id: "dm2-i1",
            title: "Riset Keyword",
            type: "page",
            content:
              "Gunakan Google Keyword Planner untuk menemukan peluang pencarian dan menyusun konten yang relevan.",
          },
          {
            id: "dm2-i2",
            title: "Google Ads Primer",
            type: "page",
            content:
              "Membangun kampanye Search dari struktur campaign hingga optimasi bidding.",
          },
        ],
      },
      {
        id: "dm3-social",
        title: "Social Media Strategy",
        items: [
          {
            id: "dm3-i1",
            title: "Framework Konten",
            type: "page",
            content:
              "Buat konten 3E (Educate, Engage, Entertain) untuk menjaga ritme komunikasi dan interaksi.",
          },
          {
            id: "dm3-i2",
            title: "Paid Social Essentials",
            type: "page",
            content:
              "Pelajari struktur campaign Meta Ads dan cara membaca learning phase.",
          },
        ],
      },
      {
        id: "dm4-analytics",
        title: "Content & Analytics",
        items: [
          {
            id: "dm4-i1",
            title: "Editorial Calendar",
            type: "page",
            content:
              "Gunakan kalender konten dan workflow approval untuk menjaga konsistensi brand voice.",
          },
          {
            id: "dm4-i2",
            title: "Google Analytics 4",
            type: "page",
            content:
              "Pelajari event-based tracking dan laporan explorations untuk mengukur kinerja channel.",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Full-Stack Web Development",
    author: "Alex Johnson",
    price: 499000,
    image: "/images/course3.jpg",
    description:
      "Bangun aplikasi web modern dengan stack React di front-end dan Node.js + database di back-end.",
    curriculum: ["Front-end", "Back-end", "Database", "Deployment"],
    modules: [
      {
        id: "fs1-html",
        title: "HTML & CSS",
        items: [
          {
            id: "fs1-i1",
            title: "Layout Modern",
            type: "page",
            content:
              "Gunakan Flexbox dan CSS Grid untuk membangun layout responsif tanpa framework berat.",
          },
          {
            id: "fs1-i2",
            title: "Design System Dasar",
            type: "page",
            content:
              "Definisikan token warna, tipografi, dan komponen inti sebelum menulis kode React.",
          },
        ],
      },
      {
        id: "fs2-react",
        title: "JavaScript & React",
        items: [
          {
            id: "fs2-i1",
            title: "Hooks & State",
            type: "page",
            content:
              "Kuasai useState, useEffect, dan custom hooks untuk memisahkan logic UI.",
          },
          {
            id: "fs2-i2",
            title: "Routing & Data Fetching",
            type: "page",
            content:
              "Implementasikan routing dengan Next.js dan optimasi data fetching (SSR, SSG, ISR).",
          },
        ],
      },
      {
        id: "fs3-node",
        title: "Node.js & API",
        items: [
          {
            id: "fs3-i1",
            title: "Express Fundamentals",
            type: "page",
            content:
              "Bangun REST API modular dengan middleware, validation, dan error handling terstruktur.",
          },
          {
            id: "fs3-i2",
            title: "Auth & Security",
            type: "page",
            content:
              "Implementasi JWT, hashing password, serta rate limiting untuk melindungi API.",
          },
        ],
      },
      {
        id: "fs4-db",
        title: "Database & Deployment",
        items: [
          {
            id: "fs4-i1",
            title: "ORM & Query",
            type: "page",
            content:
              "Gunakan Prisma untuk mengelola skema database, migrasi, dan akses data type-safe.",
          },
          {
            id: "fs4-i2",
            title: "Deployment Pipeline",
            type: "page",
            content:
              "Siapkan CI/CD dengan GitHub Actions dan deploy ke platform Vercel/Render.",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Data Analysis dengan Python",
    author: "Siti Rahma",
    price: 399000,
    image: "/images/course4.jpg",
    description:
      "Analisis data end-to-end dengan Python, mulai dari cleaning hingga visualisasi insight.",
    curriculum: [
      "Python Basics",
      "Pandas & NumPy",
      "Data Cleaning",
      "Visualisasi",
    ],
    modules: [
      {
        id: "da1-python",
        title: "Dasar-dasar Python",
        items: [
          {
            id: "da1-i1",
            title: "Sintaks dan Struktur Data",
            type: "page",
            content:
              "Review tipe data, kontrol alur, dan komprehensi untuk memproses dataset besar.",
          },
          {
            id: "da1-i2",
            title: "Environment Setup",
            type: "page",
            content:
              "Siapkan virtualenv dan Jupyter Notebook untuk eksperimen analitik.",
          },
        ],
      },
      {
        id: "da2-pandas",
        title: "Pandas & NumPy",
        items: [
          {
            id: "da2-i1",
            title: "DataFrame Operations",
            type: "page",
            content:
              "Pelajari indexing, filtering, dan aggregation untuk menjawab pertanyaan bisnis.",
          },
          {
            id: "da2-i2",
            title: "NumPy Performance",
            type: "page",
            content:
              "Gunakan array NumPy untuk operasi numerik berkecepatan tinggi.",
          },
        ],
      },
      {
        id: "da3-cleaning",
        title: "Data Cleaning",
        items: [
          {
            id: "da3-i1",
            title: "Menangani Missing Value",
            type: "page",
            content:
              "Gunakan imputasi, drop, atau model prediktif untuk mengatasi data yang hilang.",
          },
          {
            id: "da3-i2",
            title: "Feature Engineering",
            type: "page",
            content:
              "Buat feature baru seperti rasio, bucket waktu, atau flag untuk meningkatkan insight.",
          },
        ],
      },
      {
        id: "da4-viz",
        title: "Visualisasi Data",
        items: [
          {
            id: "da4-i1",
            title: "Matplotlib & Seaborn",
            type: "page",
            content:
              "Buat chart komparatif, distribusi, dan time-series dengan palet warna konsisten.",
          },
          {
            id: "da4-i2",
            title: "Storytelling Insight",
            type: "page",
            content:
              "Rangkai narasi insight menggunakan visual dan teks yang singkat namun kuat.",
          },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Belajar Cloud Computing Dasar",
    author: "Budi Santoso",
    price: 450000,
    image: "/images/course5.jpg",
    description:
      "Memahami layanan cloud populer dan praktik terbaik menjalankan workload dengan aman.",
    curriculum: [
      "Konsep Cloud",
      "Model Layanan",
      "Layanan Populer",
      "Keamanan",
    ],
    modules: [
      {
        id: "cc1-concept",
        title: "Konsep Dasar Cloud",
        items: [
          {
            id: "cc1-i1",
            title: "Sejarah & Evolusi",
            type: "page",
            content:
              "Dari data center tradisional menuju elastic cloud dengan model konsumsi pay-as-you-go.",
          },
          {
            id: "cc1-i2",
            title: "Shared Responsibility",
            type: "page",
            content:
              "Pahami pembagian tanggung jawab antara provider dan pelanggan.",
          },
        ],
      },
      {
        id: "cc2-model",
        title: "Model Layanan",
        items: [
          {
            id: "cc2-i1",
            title: "IaaS, PaaS, SaaS",
            type: "page",
            content:
              "Bandingkan fleksibilitas, kontrol, dan effort operasional setiap model.",
          },
          {
            id: "cc2-i2",
            title: "Contoh Kasus",
            type: "page",
            content:
              "Gunakan IaaS untuk aplikasi legacy, dan PaaS/SaaS untuk percepat inovasi.",
          },
        ],
      },
      {
        id: "cc3-services",
        title: "Layanan Populer",
        items: [
          {
            id: "cc3-i1",
            title: "Compute & Storage",
            type: "page",
            content:
              "Kenali EC2, Lambda, S3, serta kapan menggunakan masing-masing.",
          },
          {
            id: "cc3-i2",
            title: "Networking & Monitoring",
            type: "page",
            content:
              "Bangun arsitektur aman dengan VPC, load balancer, dan CloudWatch.",
          },
        ],
      },
      {
        id: "cc4-security",
        title: "Keamanan & Best Practice",
        items: [
          {
            id: "cc4-i1",
            title: "Identity & Access",
            type: "page",
            content:
              "Implementasikan prinsip least privilege dengan IAM dan logging menyeluruh.",
          },
          {
            id: "cc4-i2",
            title: "Cost & Governance",
            type: "page",
            content:
              "Gunakan tagging, budget alert, dan policy untuk mengendalikan biaya dan compliance.",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Product Management untuk Pemula",
    author: "Dina Pratama",
    price: 425000,
    image: "/images/course6.jpg",
    description:
      "Pelajari lifecycle produk dan cara berkolaborasi lintas fungsi untuk meluncurkan fitur bernilai.",
    curriculum: [
      "Peran PM",
      "Discovery",
      "Prioritas",
      "Kolaborasi",
    ],
    modules: [
      {
        id: "pm1-role",
        title: "Peran Product Manager",
        items: [
          {
            id: "pm1-i1",
            title: "Scope & Mandate",
            type: "page",
            content:
              "PM bertanggung jawab pada outcome produk, bukan sekadar output fitur.",
          },
          {
            id: "pm1-i2",
            title: "Skill Set Kunci",
            type: "page",
            content:
              "Komunikasi, analisis data, dan leadership tanpa otoritas adalah kemampuan utama.",
          },
        ],
      },
      {
        id: "pm2-discovery",
        title: "Discovery & Riset",
        items: [
          {
            id: "pm2-i1",
            title: "Problem Framing",
            type: "page",
            content:
              "Gunakan Jobs To Be Done untuk menggali motivasi sebenarnya dari pengguna.",
          },
          {
            id: "pm2-i2",
            title: "Validasi Hipotesis",
            type: "page",
            content:
              "Eksperimen cepat seperti landing page test membantu memvalidasi ide sebelum membangun.",
          },
        ],
      },
      {
        id: "pm3-priority",
        title: "Prioritas & Roadmap",
        items: [
          {
            id: "pm3-i1",
            title: "Prioritization Framework",
            type: "page",
            content:
              "Bandingkan RICE, ICE, dan Kano untuk menyusun backlog prioritas.",
          },
          {
            id: "pm3-i2",
            title: "Roadmap Naratif",
            type: "page",
            content:
              "Komunikasikan arah produk per kuartal dengan fokus outcome, bukan daftar fitur statis.",
          },
        ],
      },
      {
        id: "pm4-collab",
        title: "Kolaborasi",
        items: [
          {
            id: "pm4-i1",
            title: "Kerja dengan Desain & Tech",
            type: "page",
            content:
              "Gunakan ritual seperti discovery sync, design crit, dan backlog grooming.",
          },
          {
            id: "pm4-i2",
            title: "Peluncuran & Iterasi",
            type: "page",
            content:
              "Set target eksperimen, ukur metrik, lalu iterasikan berdasarkan insight.",
          },
        ],
      },
    ],
  },
];
