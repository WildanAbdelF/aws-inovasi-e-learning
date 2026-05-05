import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Pengembalian Dana | AWS Inovasi E-Learning",
  description: "Kebijakan pengembalian dana (Refund Policy) kursus AWS Inovasi E-Learning.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold mb-8 text-neutral-900">Kebijakan Pengembalian Dana (Refund Policy)</h1>
        
        <div className="space-y-6 text-neutral-600 leading-relaxed">
          <section>
            <p className="font-semibold text-neutral-900 mb-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>
              Sebagai platform pendidikan digital, tujuan utama kami adalah kepuasan dan kualitas pembelajaran siswa. 
              Namun, karena produk yang kami jual berbentuk digital (video dan dokumen yang dapat langsung diakses), 
              kami menerapkan kebijakan pengembalian dana (refund) yang tegas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. Masa Garansi Pengembalian</h2>
            <p>
              Jika Anda merasa materi kursus tidak sesuai dengan yang diiklankan, 
              Anda dapat mengajukan permohonan pengembalian dana secara penuh dalam waktu <strong>7 (tujuh) hari</strong> sejak 
              tanggal pembayaran berhasil.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. Syarat Pengajuan Refund</h2>
            <p className="mb-2">Agar memenuhi syarat untuk pengembalian dana, Anda <strong>harus memenuhi semua</strong> kriteria berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Permintaan diajukan dalam waktu maksimal 7 hari kalender sejak tanggal transaksi.</li>
              <li>Anda <strong>belum menonton lebih dari 20%</strong> dari total modul video kursus tersebut.</li>
              <li>Anda <strong>belum mengunduh</strong> materi pendamping apa pun (PDF, Source Code, dll).</li>
              <li>Anda <strong>belum menyelesaikan</strong> atau mendapatkan sertifikat untuk kursus tersebut.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. Kondisi Pembatalan Refund</h2>
            <p>
              Kami berhak menolak permohonan pengembalian dana jika kami menemukan, atas diskresi tunggal kami, 
              adanya indikasi penyalahgunaan atau kecurangan atas kebijakan refund ini (seperti pengguna yang sering kali 
              membeli lalu meminta pengembalian dana untuk berbagai kursus).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. Proses Pengajuan</h2>
            <p>
              Untuk mengajukan pengembalian dana, silakan kirimkan email ke <strong>support@awsinovasi.com</strong> dengan format:
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg mt-4 text-sm font-mono text-neutral-800">
              <p>Subjek: Permohonan Refund - [Nama Anda]</p>
              <p>Email Terdaftar: [Email Akun]</p>
              <p>Nama Kursus: [Nama Kelas]</p>
              <p>Nomor Invoice / Bukti Pembayaran: [Nomor Invoice]</p>
              <p>Alasan Refund: [Jelaskan secara singkat]</p>
            </div>
            <p className="mt-4">
              Tim dukungan kami akan mengatasi permintaan Anda dalam waktu 3-5 hari kerja. Jika disetujui, dana akan dikembalikan ke metode pembayaran awal Anda (dapat memakan waktu tambahan dari pihak bank).
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium hover:underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
