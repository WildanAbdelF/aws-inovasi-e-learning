"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, saveUser, findRegisteredUser, StoredUser } from "@/lib/localStorageHelper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPurchases } from "@/lib/localStorageHelper";

type TabType = "profil" | "langganan" | "lifetime" | "riwayat" | "sertifikat";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("profil");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    // If admin, redirect to admin dashboard
    if (stored.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
    setUser(stored);
    setFormData((prev) => ({
      ...prev,
      name: stored.name,
      email: stored.email,
    }));
    setPurchases(getPurchases());
    setLoading(false);
  }, [router]);

  const handleSaveProfile = () => {
    if (!user) return;

    // Validate current password if changing password
    if (formData.newPassword) {
      if (formData.currentPassword !== user.password) {
        window.alert("Kata sandi saat ini tidak sesuai.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        window.alert("Konfirmasi kata sandi baru tidak sesuai.");
        return;
      }
    }

    const updatedUser: StoredUser = {
      ...user,
      name: formData.name,
      password: formData.newPassword || user.password,
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    window.alert("Perubahan berhasil disimpan.");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "profil", label: "Profil" },
    { key: "langganan", label: "Status Langganan" },
    { key: "lifetime", label: "Kursus Lifetime" },
    { key: "riwayat", label: "Riwayat Pembayaran" },
    { key: "sertifikat", label: "Sertifikat" },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <h1
          className="text-2xl font-bold text-neutral-900 mb-6"
          data-aos="fade-down"
          data-aos-duration="500"
        >
          Pengaturan Akun
        </h1>

        {/* Tabs */}
        <div
          className="flex gap-6 border-b mb-8"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="bg-white rounded-xl border p-6"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-delay="100"
        >
          {activeTab === "profil" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Profil</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-slate-100 border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Alamat Email
                  </label>
                  <Input
                    value={formData.email}
                    disabled
                    className="bg-slate-100 border-slate-200 text-neutral-500"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Ganti Kata Sandi
              </h3>

              <div className="space-y-4 mb-6">
                <div className="md:w-1/2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kata Sandi Saat Ini
                  </label>
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="bg-slate-100 border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Kata Sandi Baru
                    </label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="bg-slate-100 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="bg-slate-100 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-blue-900 hover:bg-blue-950"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}

          {activeTab === "langganan" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Status Langganan
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <p className="text-neutral-600 mb-2">Belum ada langganan aktif</p>
                <p className="text-sm text-neutral-500 mb-4">
                  Berlangganan untuk akses ke semua kursus premium
                </p>
                <Link
                  href="/katalog"
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Lihat Paket Langganan
                </Link>
              </div>
            </div>
          )}

          {activeTab === "lifetime" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Kursus Lifetime
              </h2>
              {purchases.length > 0 ? (
                <div className="space-y-3">
                  {purchases.map((purchase, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">{purchase.title}</p>
                        <p className="text-sm text-neutral-500">
                          Rp {purchase.price?.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Link
                        href={`/learn/${purchase.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Lanjutkan Belajar →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-6 text-center">
                  <p className="text-neutral-600 mb-2">Belum ada kursus lifetime</p>
                  <p className="text-sm text-neutral-500 mb-4">
                    Kursus yang Anda beli secara lifetime akan muncul di sini
                  </p>
                  <Link
                    href="/katalog"
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Jelajahi Kursus
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "riwayat" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Riwayat Pembayaran
              </h2>
              {purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium text-neutral-600">
                          Kursus
                        </th>
                        <th className="text-left py-3 font-medium text-neutral-600">
                          Harga
                        </th>
                        <th className="text-left py-3 font-medium text-neutral-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{purchase.title}</td>
                          <td className="py-3">
                            Rp {purchase.price?.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Sukses
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-6 text-center">
                  <p className="text-neutral-600">Belum ada riwayat pembayaran</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "sertifikat" && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Sertifikat</h2>
              <div className="bg-neutral-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="text-neutral-600 mb-2">Belum ada sertifikat</p>
                <p className="text-sm text-neutral-500">
                  Selesaikan kursus untuk mendapatkan sertifikat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
