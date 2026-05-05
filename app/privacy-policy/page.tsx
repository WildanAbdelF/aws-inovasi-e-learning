import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi | AWS Inovasi E-Learning",
  description: "Kebijakan privasi dan perlindungan data pengguna AWS Inovasi E-Learning.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold mb-8 text-neutral-900">Kebijakan Privasi</h1>
        
        <div className="space-y-6 text-neutral-600 leading-relaxed">
          <section>
            <p className="font-semibold text-neutral-900 mb-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>
              Kami di AWS Inovasi E-Learning sangat menghargai privasi dan keamanan data Anda. 
              Dokumen ini menguraikan jenis informasi pribadi yang kami terima dan kumpulkan, 
              serta bagaimana informasi tersebut digunakan secara aman.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p className="mb-2">Saat Anda menggunakan platform kami, kami mungkin mengumpulkan data berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informasi Profil:</strong> Nama lengkap, alamat email, dan kata sandi saat pendaftaran.</li>
              <li><strong>Informasi Pembayaran:</strong> Data yang diproses oleh gateway pembayaran pihak ketiga yang aman (kami tidak menyimpan nomor kartu kredit/debit Anda di server kami).</li>
              <li><strong>Data Aktivitas:</strong> Progres kursus, hasil kuis, dan interaksi dalam platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p className="mb-2">Kami menggunakan data tersebut secara ketat untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menyediakan dan memelihara akses ke akun dan kursus Anda.</li>
              <li>Menerbitkan sertifikat penyelesaian atas nama Anda.</li>
              <li>Mengirimkan informasi transaksi (seperti invoice pembayaran).</li>
              <li>Mengirimkan informasi terkait pembaruan sistem dan rekomendasi materi yang mungkin relevan untuk Anda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">3. Keamanan Data</h2>
            <p>
              Kami mengimplementasikan berbagai protokol standar industri untuk menjaga keamanan informasi pribadi Anda. 
              Semua kata sandi dienkripsi menggunakan teknologi hashing modern yang aman sebelum disimpan di database kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mt-8 mb-4">4. Berbagi Informasi Pihak Ketiga</h2>
            <p>
              Kami <strong>tidak pernah menjual, memperdagangkan, atau mentransfer</strong> informasi identitas pribadi Anda 
              kepada pihak luar (kecuali layanan pihak pembantu yang penting seperti Payment Gateway dan penyedia layanan Cloud Hosting 
              yang terikat dengan kewajiban menjaga kerahasiaan informasi).
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
