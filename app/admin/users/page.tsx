"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getRegisteredUsers, clearUser, clearPurchases, StoredUser } from "@/lib/localStorageHelper";
import { useAuth } from "@/components/providers/AuthProvider";

export default function UserManagementPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    const stored = getUser() as any;
    if (!stored || stored.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    setAdmin(stored);

    const registeredUsers = getRegisteredUsers();
    setUsers(registeredUsers);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Memuat halaman...</p>
      </div>
    );
  }

  const adminUsers = users.filter((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white border-b flex items-center px-4 sticky top-0 z-30 gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-bold text-neutral-900">User Management</h1>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 w-56 bg-white border-r flex flex-col justify-between h-screen top-0 lg:top-auto z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            {/* Logo */}
            <div className="h-16 border-b flex items-center px-4 gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z" />
                </svg>
              </div>
              <span className="font-semibold text-neutral-800">Admin LMS</span>
            </div>

            {/* Nav */}
            <nav className="p-3 space-y-1 text-sm">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Course Management
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                User Management
              </Link>
            </nav>
          </div>

          {/* User info di bawah */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-sm">
                {admin?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="text-sm">
                <p className="font-medium text-neutral-800">{admin?.name || "Admin User"}</p>
                <p className="text-xs text-neutral-500">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {/* Header */}
          <div className="mb-8" data-aos="fade-down" data-aos-duration="500">
            <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
            <p className="text-neutral-500 text-sm">Kelola semua pengguna yang terdaftar di platform.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
              className="bg-white rounded-xl border p-5"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <p className="text-sm text-neutral-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-neutral-900">{users.length}</p>
              <p className="text-xs text-green-600 mt-1">Semua pengguna</p>
            </div>
            <div
              className="bg-white rounded-xl border p-5"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-delay="50"
            >
              <p className="text-sm text-neutral-500 mb-1">Administrators</p>
              <p className="text-2xl font-bold text-neutral-900">{adminUsers.length}</p>
              <p className="text-xs text-blue-600 mt-1">Admin role</p>
            </div>
            <div
              className="bg-white rounded-xl border p-5"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-delay="100"
            >
              <p className="text-sm text-neutral-500 mb-1">Regular Users</p>
              <p className="text-2xl font-bold text-neutral-900">{regularUsers.length}</p>
              <p className="text-xs text-green-600 mt-1">User role</p>
            </div>
          </div>

          {/* Users Table */}
          <div
            className="bg-white rounded-xl border"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            <div className="p-5 border-b">
              <h3 className="font-semibold text-neutral-900">Daftar Pengguna</h3>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Belum ada pengguna</h3>
                <p className="text-sm text-neutral-500">
                  Pengguna yang mendaftar akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-neutral-50">
                      <th className="text-left py-3 px-5 text-sm font-medium text-neutral-600">User</th>
                      <th className="text-left py-3 px-5 text-sm font-medium text-neutral-600">Email</th>
                      <th className="text-left py-3 px-5 text-sm font-medium text-neutral-600">Role</th>
                      <th className="text-left py-3 px-5 text-sm font-medium text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((user, index) => (
                      <tr key={index} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                              user.role === "admin" ? "bg-blue-500" : "bg-amber-400"
                            }`}
                            >
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-medium text-neutral-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-neutral-600">{user.email}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
