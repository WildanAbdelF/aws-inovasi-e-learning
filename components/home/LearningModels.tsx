export default function LearningModels() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">
          Pilih Model Belajar yang Tepat untuk Anda
        </h2>

        <p className="text-neutral-600 text-center mt-3">
          Kami menawarkan fleksibilitas agar Anda dapat belajar sesuai gaya dan anggaran.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="border rounded-xl p-8 text-center shadow-sm hover:shadow-md transition border-red-400">
            <h3 className="font-semibold text-lg">Langganan Bulanan</h3>
            <p className="text-neutral-600 mt-2">
              Akses penuh ke semua kursus.
            </p>
          </div>

          <div className="border rounded-xl p-8 text-center shadow-sm hover:shadow-md transition border-blue-400">
            <h3 className="font-semibold text-lg">Akses Seumur Hidup</h3>
            <p className="text-neutral-600 mt-2">
              Beli kursus satuan dan akses selamanya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
