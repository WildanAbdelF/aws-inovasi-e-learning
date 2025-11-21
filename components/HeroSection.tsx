import { Button } from "./ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Wujudkan Potensi Anda Melalui Pembelajaran
        </h1>

        <p className="text-neutral-600 mt-4 text-lg">
          Temukan ribuan kursus dari para ahli industri untuk meningkatkan
          keahlian Anda ke level berikutnya.
        </p>

        <Button asChild className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-6 text-lg">
          <Link href="/katalog">Mulai Belajar Sekarang</Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <img
          src="/images/hero.png"
          alt="Hero"
          className="rounded-xl shadow-md w-full"
        />
      </div>
    </section>
  );
}
