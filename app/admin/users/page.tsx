"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getRegisteredUsers, clearUser, clearPurchases, StoredUser, updateRegisteredUser } from "@/lib/localStorageHelper";
import { useAuth } from "@/components/providers/AuthProvider";
import { dummyCourses } from "@/lib/data/courses.data";

type EditingUser = StoredUser & {
  lifetimeCourses?: { id: string; title: string }[];
  subscriptionStatus?: "active" | "inactive" | "pending";
};

export default function UserManagementPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSubscriptionStatus, setEditSubscriptionStatus] = useState<"active" | "inactive" | "pending">("active");
  const [editLifetimeCourses, setEditLifetimeCourses] = useState<{ id: string; title: string }[]>([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  
  // Success dialog state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [savedUserName, setSavedUserName] = useState("");

  const openEditModal = (user: StoredUser) => {
    setEditingUser(user as EditingUser);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditSubscriptionStatus((user as EditingUser).subscriptionStatus || "active");
    setEditLifetimeCourses((user as EditingUser).lifetimeCourses || []);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    setShowCourseDropdown(false);
  };

  const handleAddCourse = (course: { id: string; title: string }) => {
    if (!editLifetimeCourses.some((c) => c.id === course.id)) {
      setEditLifetimeCourses([...editLifetimeCourses, course]);
    }
    setShowCourseDropdown(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    setEditLifetimeCourses(editLifetimeCourses.filter((c) => c.id !== courseId));
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    const success = updateRegisteredUser(editingUser.email, {
      name: editName,
      subscriptionStatus: editSubscriptionStatus,
      lifetimeCourses: editLifetimeCourses,
    });

    if (success) {
      // Refresh users list
      const registeredUsers = getRegisteredUsers();
      setUsers(registeredUsers);
      setSavedUserName(editName);
      closeEditModal();
      // Show success dialog with slight delay for animation
      setTimeout(() => {
        setSuccessDialogOpen(true);
      }, 200);
    }
  };

  const availableCourses = dummyCourses.filter(
    (course) => !editLifetimeCourses.some((c) => c.id === course.id)
  );

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
              <span className="font-semibold text-neutral-800">LMS Admin</span>
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
                      <th className="text-left py-3 px-5 text-sm font-medium text-neutral-600">Aksi</th>
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
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            (user as EditingUser).subscriptionStatus === "inactive"
                              ? "bg-red-100 text-red-700"
                              : (user as EditingUser).subscriptionStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {(user as EditingUser).subscriptionStatus === "inactive"
                              ? "Tidak Aktif"
                              : (user as EditingUser).subscriptionStatus === "pending"
                              ? "Pending"
                              : "Aktif"}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <button
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
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

      {/* Edit User Modal */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-modal-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-neutral-900">Edit Data Pengguna</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {editingUser.name} ({editingUser.email})
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Informasi Pribadi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      disabled
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Account Management */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Manajemen Akun</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Status Langganan
                    </label>
                    <div className="relative">
                      <select
                        value={editSubscriptionStatus}
                        onChange={(e) => setEditSubscriptionStatus(e.target.value as "active" | "inactive" | "pending")}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="pending">Pending</option>
                      </select>
                      <svg className="w-5 h-5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Lifetime Course Access */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Akses Kursus Lifetime
                    </label>
                    
                    {/* List of assigned courses */}
                    <div className="space-y-2 mb-3">
                      {editLifetimeCourses.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic py-2">
                          Belum ada kursus yang ditambahkan
                        </p>
                      ) : (
                        editLifetimeCourses.map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center justify-between px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                          >
                            <span className="text-sm font-medium text-neutral-800">{course.title}</span>
                            <button
                              onClick={() => handleRemoveCourse(course.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Course Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Akses Kursus
                      </button>

                      {showCourseDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {availableCourses.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                              Semua kursus sudah ditambahkan
                            </div>
                          ) : (
                            availableCourses.map((course) => (
                              <button
                                key={course.id}
                                onClick={() => handleAddCourse({ id: course.id, title: course.title })}
                                className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b last:border-b-0"
                              >
                                <span className="text-sm font-medium text-neutral-800">{course.title}</span>
                                <span className="block text-xs text-neutral-500 mt-0.5">{course.author}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-neutral-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveUser}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {successDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl transform animate-bounce-in"
          >
            <div className="p-8 text-center">
              {/* Animated Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-success-circle">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    className="animate-check-draw"
                    style={{
                      strokeDasharray: 24,
                      strokeDashoffset: 24,
                      animation: 'checkDraw 0.5s ease-out 0.3s forwards'
                    }}
                  />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Berhasil!
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                Data pengguna <strong>{savedUserName}</strong> berhasil diperbarui.
              </p>
              
              <button
                onClick={() => setSuccessDialogOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes successCircle {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-modal-slide-up {
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-success-circle {
          animation: successCircle 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-check-draw {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkDraw 0.5s ease-out 0.3s forwards;
        }
      `}</style>
    </div>
  );
}
