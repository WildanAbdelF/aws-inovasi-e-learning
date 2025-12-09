import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Siap Tingkatkan Keahlian Anda?
        </h2>

        <p className="text-neutral-600 mt-3 text-base md:text-lg">
          Bergabunglah dengan ribuan pelajar lain dan dapatkan akses tak terbatas.
        </p>

        <Button className="mt-6 bg-red-600 hover:bg-red-700 px-4 md:px-6 py-2 md:py-3">
          Berlangganan Sekarang
        </Button>
      </div>
    </section>
  );
}
