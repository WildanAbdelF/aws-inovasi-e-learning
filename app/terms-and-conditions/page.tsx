import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan | AWS Inovasi E-Learning",
  description: "Syarat dan ketentuan penggunaan layanan platform AWS Inovasi E-Learning.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold mb-8 text-neutral-900">Syarat & Ketentuan</h1>
        
        <div className="space-y-6 text-neutral-600 leading-relaxed">
          <section>
            <p className="font-semibold text-neutral-900 mb-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>
              Selamat datang di AWS Inovasi E-Learning. Dengan mendaftar dan menggunakan layanan kami, 
              Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan di bawah ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. Definisi Layanan</h2>
            <p>
              AWS Inovasi E-Learning adalah platform pembelajaran online yang menyediakan berbagai kursus video, 
              materi bacaan, dan kuis untuk meningkatkan keahlian digital pengguna.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. Akun Pengguna</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anda harus menggunakan alamat email yang valid saat mendaftar.</li>
              <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda.</li>
              <li>Satu akun hanya boleh digunakan oleh satu pengguna. Membagikan akses akun kepada pihak lain adalah pelanggaran berat yang dapat menyebabkan akun ditangguhkan secara permanen.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. Pembelian & Akses Kursus</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pembelian kursus bersifat final dan akses diberikan segera setelah pembayaran berhasil diverifikasi.</li>
              <li>Akses kursus diberikan selamanya (lifetime access) selama platform kami masih beroperasi, kecuali dinyatakan lain dalam deskripsi kursus tersebut.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. Hak Kekayaan Intelektual</h2>
            <p>
              Seluruh konten, termasuk namun tidak terbatas pada video materi, teks, kuis, desain, 
              dan logo yang ada di dalam platform ini dilindungi oleh hak cipta. 
              Anda tidak diperkenankan untuk mengunduh (kecuali dokumen yang disediakan untuk diunduh), 
              merekam layar, mendistribusikan ulang, atau menjual kembali materi yang ada di platform ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">5. Perubahan Syarat & Ketentuan</h2>
            <p>
              Kami berhak untuk mengubah, memodifikasi, menambah atau menghapus bagian-bagian dari Syarat dan Ketentuan 
              ini kapan saja. Perubahan akan berlaku pada saat diunggah ke halaman ini.
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
