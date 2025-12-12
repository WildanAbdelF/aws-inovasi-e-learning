"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/localStorageHelper";
import { getAdminCourses } from "@/lib/adminCoursesStorage";
import { getRegisteredUsers } from "@/lib/localStorageHelper";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRevenue: 120500000,
    activeUsers: 0,
    activeSubscriptions: 850,
    totalEnrollments: 3150,
  });

  // Protect route: only admin can access
  useEffect(() => {
    const stored = getUser() as any;
    if (!stored || stored.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    setUser(stored);

    // Get real user count
    const users = getRegisteredUsers();
    setStats((prev) => ({ ...prev, activeUsers: users.length }));

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Memuat dashboard...</p>
      </div>
    );
  }

  const recentActivity = [
    { name: "Budi Santoso", action: 'enrolled in "React JS"', time: "2m ago", avatar: "🧑" },
    { name: "Siti Aminah", action: "just registered", time: "15m ago", avatar: "👩" },
    { name: "Eko Prasetyo", action: 'enrolled in "Data Science"', time: "1h ago", avatar: "👨" },
  ];

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
        <h1 className="text-lg font-bold text-neutral-900">Admin Dashboard</h1>
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
          <div className="flex flex-col w-full">
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium"
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
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
          <div className="border-t border-l lg:border-l-0 p-3 lg:p-4 flex-shrink-0">
            <div className="flex items-center gap-2 lg:gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="text-xs lg:text-sm hidden lg:block">
                <p className="font-medium text-neutral-800 truncate">{user?.name || "Admin User"}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-2 text-xs lg:text-sm text-neutral-500 hover:text-neutral-800 w-full lg:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
        {/* Header - Hidden on mobile since we have mobile header at top */}
        <div className="hidden lg:block mb-8" data-aos="fade-down" data-aos-duration="500">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500 text-sm">Overview of the platform&apos;s activity and statistics.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className="bg-white rounded-xl border p-4 sm:p-5"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">
              Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-green-600 mt-1">+12.5%</p>
          </div>
          <div
            className="bg-white rounded-xl border p-4 sm:p-5"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="50"
          >
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Active Users</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">
              {stats.activeUsers.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+5.2%</p>
          </div>
          <div
            className="bg-white rounded-xl border p-4 sm:p-5"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="100"
          >
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Active Subscriptions</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">
              {stats.activeSubscriptions.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+2.1%</p>
          </div>
          <div
            className="bg-white rounded-xl border p-4 sm:p-5"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="150"
          >
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Enrollments</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">
              {stats.totalEnrollments.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">+8.0%</p>
          </div>
        </div>

        {/* Chart & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Analytics */}
          <div
            className="lg:col-span-2 bg-white rounded-xl border p-4 sm:p-6"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1">Revenue Analytics</h3>
            <p className="text-xs text-neutral-500 mb-3 sm:mb-4">Last 30 Days</p>
            {/* Simple Chart SVG */}
            <div className="h-40 sm:h-48 flex items-end justify-between gap-1">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 100 Q20 80, 40 70 T80 50 T120 60 T160 30 T200 45 T240 35 T280 55 T320 40 T360 60 T400 50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <path
                  d="M0 100 Q20 80, 40 70 T80 50 T120 60 T160 30 T200 45 T240 35 T280 55 T320 40 T360 60 T400 50 V120 H0 Z"
                  fill="url(#chartGradient)"
                />
              </svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="bg-white rounded-xl border p-4 sm:p-6"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="100"
          >
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/admin/courses/new"
                className="block w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg text-center transition-colors"
              >
                Create New Course
              </Link>
              <Link
                href="/admin/users"
                className="block w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-900 hover:bg-blue-950 text-white text-xs sm:text-sm font-medium rounded-lg text-center transition-colors"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="bg-white rounded-xl border p-4 sm:p-6"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b last:border-b-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <p className="text-xs sm:text-sm min-w-0">
                    <span className="font-medium text-neutral-900 block truncate">{activity.name}</span>{" "}
                    <span className="text-neutral-500 line-clamp-2">{activity.action}</span>
                  </p>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
