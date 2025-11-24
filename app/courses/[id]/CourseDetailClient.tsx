"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dummyCourses } from "@/lib/dummyCourses";
import { addPurchase, getPurchases } from "@/lib/localStorageHelper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type CourseDetailClientProps = {
  course: (typeof dummyCourses)[number];
};

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const list = getPurchases();
    setAlreadyPurchased(list.some((c) => c.id === String(course.id)));
  }, [course.id]);

  const handleConfirmPurchase = () => {
    addPurchase({ id: String(course.id), title: course.title, price: course.price });
    setOpen(false);
    setShowSuccess(true);

    setAlreadyPurchased(true);

    setTimeout(() => {
      setShowSuccess(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <nav className="text-sm text-neutral-500 mb-4">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/katalog">Katalog Kursus</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold mb-2">{course.title}</h1>
          <p className="text-sm text-neutral-600 mb-6">Oleh {course.author}</p>

          <div className="bg-neutral-900 rounded-lg h-64 mb-6 flex items-center justify-center text-white">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-lg" />
          </div>

          <div className="border-b pb-4 mb-6">
            <h2 className="font-semibold mb-2">Tentang Kursus Ini</h2>
            <p className="text-sm text-neutral-700">{course.description ?? "Deskripsi tidak tersedia."}</p>
          </div>

          <section className="mb-6">
            <h3 className="font-semibold mb-2">Kurikulum</h3>
            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
              {(course.curriculum ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Instruktur</h3>
            <p className="text-sm text-neutral-700">{course.author}</p>
          </section>
        </main>

        <aside>
          <div className="border rounded-lg p-6 shadow-sm bg-white">
            <div className="mb-4">
              <div className="text-2xl font-bold">Rp {course.price.toLocaleString("id-ID")}</div>
              <div className="text-xs text-neutral-500 flex items-center gap-2">
                <span>Akses Lifetime</span>
                {alreadyPurchased && (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">
                    Sudah dibeli
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-red-600 text-white py-3 rounded-lg disabled:opacity-70 disabled:cursor-default"
                onClick={() => !alreadyPurchased && setOpen(true)}
                disabled={alreadyPurchased}
              >
                {alreadyPurchased ? "Lanjutkan Pembelajaran" : "Beli Lifetime"}
              </button>
              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg">
                Gabung Langganan
              </button>
            </div>

            <ul className="mt-6 text-sm text-neutral-700 space-y-2">
              <li>25 Jam video on-demand</li>
              <li>Studi kasus dunia nyata</li>
              <li>Akses di mobile dan desktop</li>
              <li>Sertifikat kelulusan</li>
            </ul>
          </div>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Selesaikan Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="border rounded-lg p-4 mb-4 bg-neutral-50 text-sm">
            <div className="flex justify-between mb-1">
              <span>Item</span>
              <span>{course.title}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rp {course.price.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Pilih Metode Pembayaran</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button className="border rounded-lg py-2 bg-neutral-900 text-white font-medium">
                Kartu
              </button>
              <button className="border rounded-lg py-2 bg-neutral-100 text-neutral-700">
                Virtual Account
              </button>
              <button className="border rounded-lg py-2 bg-neutral-100 text-neutral-700">
                E-Wallet
              </button>
            </div>
          </div>

          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold mt-2"
            onClick={handleConfirmPurchase}
          >
            Lanjutkan Pembayaran
          </button>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-2">Pembayaran Berhasil</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Kursus <span className="font-medium">{course.title}</span> berhasil ditambahkan ke akun Anda.
            </p>
            <p className="text-xs text-neutral-500">
              Mengarahkan ke dashboard Anda...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
