export default function FAQSection() {
  const items = [
    {
      question: "Apakah saya bisa akses kursus selamanya?",
      answer:
        "Ya, untuk pembelian kursus satuan Anda mendapatkan akses seumur hidup.",
    },
    {
      question: "Apakah ada sertifikat setelah selesai?",
      answer:
        "Ada. Sertifikat tersedia setelah Anda menuntaskan seluruh modul dan kuis.",
    },
    {
      question: "Bisa belajar lewat HP?",
      answer:
        "Bisa. Platform kami responsif dan nyaman diakses lewat perangkat mobile.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Pertanyaan yang Sering Diajukan</h2>
        <p className="text-neutral-600 text-center mt-3">
          Jawaban singkat untuk pertanyaan umum sebelum mulai belajar.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {items.map((item) => (
            <div
              key={item.question}
              className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition border-rose-300"
            >
              <h3 className="font-semibold text-lg">{item.question}</h3>
              <p className="text-neutral-600 mt-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
