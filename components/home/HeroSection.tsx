import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Wujudkan Potensi Anda Melalui Pembelajaran
          </h1>

          <p className="text-neutral-600 mt-4 text-base md:text-lg">
            Temukan ribuan kursus dari para ahli industri untuk meningkatkan
            keahlian Anda ke level berikutnya.
          </p>

          <Button asChild className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-4 md:py-6 text-base md:text-lg">
            <Link href="/katalog">Mulai Belajar Sekarang</Link>
          </Button>
        </div>

        <div className="flex justify-center mt-8 md:mt-0">
          <img
            src="/images/hero.png"
            alt="Hero"
            className="rounded-xl w-full max-w-sm md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
