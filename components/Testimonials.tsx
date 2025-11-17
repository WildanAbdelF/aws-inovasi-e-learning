export default function Testimonials() {
  const data = [
    {
      name: "Wildan Abdel",
      text: "Kursus di sini sangat membantu saya beralih karir. Materinya relevan dan sangat direkomendasikan!",
      avatar: "/images/user1.jpg",
    },
    {
      name: "Noordin M Top",
      text: "Sebagai profesional, saya bisa belajar kapan saja. Platform ini luar biasa!",
      avatar: "/images/user2.jpg",
    },
    {
      name: "Dimas Anjay Mabar",
      text: "Instruktur yang ahli membuat pengalaman belajar menyenangkan.",
      avatar: "/images/user3.jpg",
    },
  ];

  return (
    <section className="bg-neutral-100 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Apa Kata Mereka</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {data.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-neutral-700">{t.text}</p>
              <p className="font-semibold mt-4 text-center">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
