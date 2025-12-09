"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dummyCourses } from "@/lib/data/courses.data";
import {
  addMonthlySubscription,
  addPurchase,
  getPurchases,
  getSubscriptionByCourseId,
} from "@/lib/localStorageHelper";
import type { CourseSubscription } from "@/lib/localStorageHelper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInView } from "@/lib/hooks";
import { useAuth } from "@/components/providers/AuthProvider";

export type CourseDetailClientProps = {
  course: (typeof dummyCourses)[number];
};

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<CourseSubscription | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<"lifetime" | "subscription" | null>(null);
  const [successType, setSuccessType] = useState<"lifetime" | "subscription" | null>(null);
  const [successExpiresAt, setSuccessExpiresAt] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: mainRef, inView: mainInView } = useInView({ threshold: 0.15 });
  const { ref: asideRef, inView: asideInView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    const list = getPurchases();
    setAlreadyPurchased(list.some((c) => c.id === String(course.id)));
  }, [course.id]);

  useEffect(() => {
    const subscription = getSubscriptionByCourseId(String(course.id));
    setActiveSubscription(subscription);
  }, [course.id]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const monthlyPrice = useMemo(() => {
    const base = Math.round(course.price * 0.35);
    const normalized = Math.max(99000, base);
    return Math.round(normalized / 1000) * 1000;
  }, [course.price]);

  const hasMonthlyAccess = Boolean(activeSubscription);
  const isSubscriptionFlow = checkoutMode === "subscription";
  const dialogTitle = isSubscriptionFlow ? "Aktivasi Langganan 1 Bulan" : "Selesaikan Pembelian";
  const dialogDescription = isSubscriptionFlow
    ? "Akses kursus akan aktif selama 30 hari setelah pembayaran dikonfirmasi."
    : "Bayar sekali untuk memiliki akses kursus ini selamanya.";
  const dialogTotal = isSubscriptionFlow ? monthlyPrice : course.price;
  const dialogCta = isSubscriptionFlow ? "Aktifkan Langganan" : "Lanjutkan Pembayaran";

  const formatDate = (value: string | null, fallback = "") => {
    if (!value) return fallback;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  };

  const subscriptionExpiryText = hasMonthlyAccess
    ? formatDate(activeSubscription?.expiresAt ?? null, "30 hari ke depan")
    : "";

  const getFirstLessonPath = () => {
    const firstModule = course.modules?.[0];
    const firstItem = firstModule?.items[0];
    if (!firstModule || !firstItem) return null;
    return `/learn/${course.id}/${firstModule.id}/${firstItem.id}`;
  };

  const handleContinueLearning = () => {
    const path = getFirstLessonPath();
    if (path) {
      router.push(path);
    }
  };

  const triggerSuccessRedirect = () => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = setTimeout(() => {
      setShowSuccess(false);
      setSuccessType(null);
      setSuccessExpiresAt(null);
      router.push("/dashboard");
    }, 1500);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCheckoutMode(null);
    }
    setOpen(nextOpen);
  };

  const handleBuyClick = () => {
    if (!user) {
      window.alert("Anda harus login terlebih dahulu untuk membeli kursus ini.");
      router.push("/login");
      return;
    }
    setCheckoutMode("lifetime");
    setOpen(true);
  };

  const handleSubscriptionClick = () => {
    if (!user) {
      window.alert("Anda harus login terlebih dahulu untuk bergabung dengan langganan.");
      router.push("/login");
      return;
    }
    setCheckoutMode("subscription");
    setOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!checkoutMode) return;
    const mode = checkoutMode;

    if (mode === "subscription") {
      const subscription = addMonthlySubscription({ id: String(course.id), title: course.title });
      if (!subscription) return;
      setActiveSubscription(subscription);
      setSuccessType("subscription");
      setSuccessExpiresAt(subscription.expiresAt);
    } else {
      addPurchase({ id: String(course.id), title: course.title, price: course.price });
      setAlreadyPurchased(true);
      setSuccessType("lifetime");
      setSuccessExpiresAt(null);
    }

    handleDialogChange(false);
    setShowSuccess(true);
    triggerSuccessRedirect();
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
        <main
          ref={mainRef}
          className={`lg:col-span-2 transition-all duration-500 ease-out transform ${
            mainInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
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

        <aside
          ref={asideRef}
          className={`transition-all duration-500 ease-out transform delay-100 ${
            asideInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
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
              {hasMonthlyAccess && (
                <p className="text-xs text-emerald-600 mt-2">
                  Langganan 1 bulan aktif hingga <strong>{subscriptionExpiryText}</strong>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {alreadyPurchased && (
                <button
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                  onClick={handleContinueLearning}
                >
                  Lanjutkan Pembelajaran
                </button>
              )}

              {!alreadyPurchased && hasMonthlyAccess && (
                <>
                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    onClick={handleContinueLearning}
                  >
                    <span className="font-semibold block">Masuk ke Modul Pembelajaran</span>
                    <span className="text-[11px] text-blue-100 font-normal">
                      Langganan aktif sampai {subscriptionExpiryText}
                    </span>
                  </button>
                  <button
                    className="w-full bg-red-50 border border-red-200 text-red-700 py-3 rounded-lg hover:bg-red-100"
                    onClick={handleBuyClick}
                  >
                    Upgrade ke Akses Lifetime
                  </button>
                  <button
                    className="self-start text-xs text-blue-600 underline decoration-dashed underline-offset-4"
                    onClick={handleSubscriptionClick}
                  >
                    Perpanjang Langganan 1 Bulan
                  </button>
                </>
              )}

              {!alreadyPurchased && !hasMonthlyAccess && (
                <>
                  <button
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                    onClick={handleBuyClick}
                  >
                    Beli Lifetime
                  </button>
                  <button
                    className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
                    onClick={handleSubscriptionClick}
                  >
                    <span className="font-semibold block">Gabung Langganan 1 Bulan</span>
                    <span className="text-xs text-neutral-500">
                      Rp {monthlyPrice.toLocaleString("id-ID")} / 30 hari
                    </span>
                  </button>
                </>
              )}
            </div>

            <ul className="mt-6 text-sm text-neutral-700 space-y-2">
              <li>25 Jam video on-demand</li>
              <li>Studi kasus dunia nyata</li>
              <li>Akses di mobile dan desktop</li>
              <li>Sertifikat kelulusan</li>
            </ul>

            {hasMonthlyAccess && (
              <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                <p className="font-semibold text-sm text-emerald-800">Langganan aktif</p>
                <p>Kursus tersedia selama 1 bulan dengan akses sampai {subscriptionExpiryText}.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <p className="text-sm text-neutral-500">{dialogDescription}</p>
          </DialogHeader>

          <div className="border rounded-lg p-4 mb-4 bg-neutral-50 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Kursus</span>
              <span className="text-right font-medium">{course.title}</span>
            </div>
            {isSubscriptionFlow && (
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Durasi akses</span>
                <span>30 hari</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1 border-t border-dashed border-neutral-200">
              <span>Total</span>
              <span>Rp {dialogTotal.toLocaleString("id-ID")}</span>
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

          {isSubscriptionFlow && (
            <p className="text-xs text-neutral-500 mb-4">
              Tagihan tidak diperpanjang otomatis. Anda dapat memperpanjang kapan saja setelah langganan berakhir.
            </p>
          )}

          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold mt-2"
            onClick={handleConfirmPurchase}
          >
            {dialogCta}
          </button>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-2">
              {successType === "subscription" ? "Langganan Aktif" : "Pembayaran Berhasil"}
            </h3>
            {successType === "subscription" ? (
              <p className="text-sm text-neutral-600 mb-4">
                Langganan 1 bulan untuk <span className="font-medium">{course.title}</span> aktif hingga{" "}
                <span className="font-medium">{formatDate(successExpiresAt, "30 hari ke depan")}</span>.
              </p>
            ) : (
              <p className="text-sm text-neutral-600 mb-4">
                Kursus <span className="font-medium">{course.title}</span> berhasil ditambahkan ke akun Anda.
              </p>
            )}
            <p className="text-xs text-neutral-500">
              {successType === "subscription"
                ? "Menyiapkan langganan Anda..."
                : "Mengarahkan ke dashboard Anda..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
