import { useRef } from "react";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const data = [
    {
      name: "Nadia Prameswari",
      text: "Kursus di sini sangat membantu saya beralih karir. Materinya relevan dan sangat direkomendasikan!",
      avatar: "/images/user1.jpg",
    },
    {
      name: "Rizky Aditya",
      text: "Sebagai profesional, saya bisa belajar kapan saja. Platform ini luar biasa!",
      avatar: "/images/user2.jpg",
    },
    {
      name: "Farah Nuraini",
      text: "Instruktur yang ahli membuat pengalaman belajar menyenangkan.",
      avatar: "/images/user3.jpg",
    },
    {
      name: "Dimas Pratama",
      text: "Modulnya singkat dan jelas. Saya bisa langsung praktik di kantor.",
      avatar: "/images/user4.jpg",
    },
    {
      name: "Alya Syafira",
      text: "Pengerjaan tugas dan kuisnya membuat saya benar-benar paham konsep.",
      avatar: "/images/user5.jpg",
    },
    {
      name: "Fajar Mahendra",
      text: "Platformnya ringan dan cepat, cocok untuk belajar di sela kerja.",
      avatar: "/images/user6.jpg",
    },
    {
      name: "Salsabila Putri",
      text: "Materinya terstruktur rapi dari dasar sampai lanjutan.",
      avatar: "/images/user7.jpg",
    },
    {
      name: "Bagas Saputra",
      text: "Sertifikatnya membantu saat melamar kerja. Terima kasih!",
      avatar: "/images/user8.jpg",
    },
    {
      name: "Maya Anggraini",
      text: "Mentor responsif dan penjelasannya mudah diikuti.",
      avatar: "/images/user9.jpg",
    },
    {
      name: "Hendra Kurniawan",
      text: "Fitur pembelajaran mandiri sangat membantu untuk jadwal padat.",
      avatar: "/images/user10.jpg",
    },
  ];

  return (
    <section className="bg-neutral-100 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Apa Kata Mereka</h2>

        <div className="mt-8 md:mt-12 relative">
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => trackRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
            className="w-9 h-9 rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-200 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-9 md:-translate-x-11 shadow"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Selanjutnya"
            onClick={() => trackRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
            className="w-9 h-9 rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-200 absolute right-0 top-1/2 -translate-y-1/2 translate-x-9 md:translate-x-11 shadow"
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-2 md:px-10"
          >
            {data.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow min-w-[260px] md:min-w-[320px]"
              >
                <div className="px-4 md:px-6 pt-4 md:pt-6">
                  <p className="font-semibold text-center text-sm md:text-base">{t.name}</p>
                </div>
                <div className="mt-3 border-t border-neutral-200 px-4 md:px-6 pb-4 md:pb-6">
                  <p className="italic text-neutral-700 text-sm md:text-base pt-3">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
