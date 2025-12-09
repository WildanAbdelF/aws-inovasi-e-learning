"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, clearUser, clearPurchases } from "@/lib/localStorageHelper";
import {
	AdminCourse,
	getAdminCourses,
	saveAdminCourses,
} from "@/lib/adminCoursesStorage";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function AdminManagementPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [user, setUser] = useState<any>(null);
	const [courses, setCourses] = useState<AdminCourse[]>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

	// Protect route: only admin can access
	useEffect(() => {
		const stored = getUser() as any;
		if (!stored || stored.role !== "admin") {
			router.replace("/dashboard");
			return;
		}
		setUser(stored);

		const existing = getAdminCourses();
		setCourses(existing);
		setLoading(false);
	}, [router]);

	const handleDeleteCourse = () => {
		if (!courseToDelete) return;
		const updated = courses.filter((c) => c.id !== courseToDelete);
		saveAdminCourses(updated);
		setCourses(updated);
		setDeleteDialogOpen(false);
		setCourseToDelete(null);
	};

	const confirmDelete = (courseId: string) => {
		setCourseToDelete(courseId);
		setDeleteDialogOpen(true);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-sm text-neutral-500">Memuat halaman admin...</p>
			</div>
		);
	}

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
				<h1 className="text-lg font-bold text-neutral-900">Course Management</h1>
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
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium"
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
					<div className="border-t p-4">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-sm">
								{user?.name?.charAt(0).toUpperCase() || "A"}
							</div>
							<div className="text-sm">
								<p className="font-medium text-neutral-800">{user?.name || "Admin User"}</p>
								<p className="text-xs text-neutral-500">{user?.email}</p>
							</div>
						</div>
						<button
							onClick={() => {
								clearUser();
								clearPurchases();
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
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8" data-aos="fade-down" data-aos-duration="500">
						<div>
							<h1 className="text-2xl font-bold text-neutral-900">Course Management</h1>
							<p className="text-neutral-500 text-sm">Kelola semua kursus yang Anda buat. Tambah, edit, atau hapus kursus.</p>
						</div>
						<Link
							href="/admin/courses/new"
							className="px-4 py-2.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 font-medium transition-colors"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Buat Kursus Baru
						</Link>
					</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<div
						className="bg-white rounded-xl border p-5"
						data-aos="fade-up"
						data-aos-duration="500"
					>
						<p className="text-sm text-neutral-500 mb-1">Total Kursus</p>
						<p className="text-2xl font-bold text-neutral-900">{courses.length}</p>
						<p className="text-xs text-green-600 mt-1">Semua kursus</p>
					</div>
					<div
						className="bg-white rounded-xl border p-5"
						data-aos="fade-up"
						data-aos-duration="500"
						data-aos-delay="50"
					>
						<p className="text-sm text-neutral-500 mb-1">Kursus Aktif</p>
						<p className="text-2xl font-bold text-neutral-900">
							{courses.filter((c) => c.title && c.modules.length > 0).length}
						</p>
						<p className="text-xs text-green-600 mt-1">Dengan modul</p>
					</div>
					<div
						className="bg-white rounded-xl border p-5"
						data-aos="fade-up"
						data-aos-duration="500"
						data-aos-delay="100"
					>
						<p className="text-sm text-neutral-500 mb-1">Total Modul</p>
						<p className="text-2xl font-bold text-neutral-900">
							{courses.reduce((acc, c) => acc + c.modules.length, 0)}
						</p>
						<p className="text-xs text-green-600 mt-1">Semua materi</p>
					</div>
				</div>

				{/* Course List */}
				<div
					className="bg-white rounded-xl border"
					data-aos="fade-up"
					data-aos-duration="500"
				>
					<div className="p-5 border-b">
						<h3 className="font-semibold text-neutral-900">Daftar Kursus</h3>
					</div>

					{courses.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
								<svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h3 className="font-semibold text-neutral-900 mb-2">Belum ada kursus</h3>
							<p className="text-sm text-neutral-500 mb-4">
								Mulai buat kursus pertama Anda untuk memulai
							</p>
							<Link
								href="/admin/courses/new"
								className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
							>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								Buat Kursus Baru
							</Link>
						</div>
					) : (
						<div className="divide-y">
							{courses.map((course) => (
								<div
									key={course.id}
									className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
								>
									<div className="flex items-center gap-4">
										<div className="w-16 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
											{course.image ? (
												<img
													src={course.image}
													alt={course.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
												</div>
											)}
										</div>
										<div>
											<h3 className="font-medium text-neutral-900">
												{course.title || "Untitled Course"}
											</h3>
											<p className="text-sm text-neutral-500 mt-0.5">
												{course.modules.length} modul •{" "}
												{course.modules.reduce((acc, m) => acc + m.items.length, 0)}{" "}
												materi
											</p>
											<p className="text-sm text-neutral-400 mt-0.5">
												{course.price > 0
													? `Rp ${course.price.toLocaleString("id-ID")}`
													: "Gratis"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Link
											href={`/admin/courses/${course.id}`}
											className="px-4 py-2 text-sm rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors"
										>
											Edit
										</Link>
										<button
											onClick={() => confirmDelete(course.id)}
											className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
										>
											Hapus
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>

		{/* Delete Confirmation Dialog */}
		<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Konfirmasi Hapus</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<p className="text-sm text-neutral-600">
						Apakah Anda yakin ingin menghapus kursus ini? Tindakan ini tidak dapat
						dibatalkan.
					</p>
				</div>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setDeleteDialogOpen(false)}
						className="px-4 py-2 text-sm rounded-lg border text-neutral-700 hover:bg-neutral-100 transition-colors"
					>
						Batal
					</button>
					<button
						onClick={handleDeleteCourse}
						className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
					>
						Hapus
					</button>
				</div>
			</DialogContent>
		</Dialog>
		</div>
	);
}
