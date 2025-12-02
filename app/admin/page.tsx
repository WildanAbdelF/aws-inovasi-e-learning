"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/localStorageHelper";
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
			<div className="min-h-[80vh] flex items-center justify-center">
				<p className="text-sm text-neutral-500">Memuat halaman admin...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex bg-neutral-50">
			{/* Sidebar kiri */}
			<aside className="w-60 border-r bg-white flex flex-col justify-between">
				<div>
					<div className="h-16 border-b flex items-center px-4 gap-2">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
							L
						</div>
						<div>
							<p className="text-sm font-semibold">LMS Admin</p>
							<p className="text-[11px] text-neutral-500">Course Management</p>
						</div>
					</div>

					<nav className="px-3 py-4 text-sm space-y-1">
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
							<span>📊</span>
							<span>Dashboard</span>
						</button>
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white">
							<span>📚</span>
							<span>Course Management</span>
						</button>
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
							<span>👥</span>
							<span>User Management</span>
						</button>
					</nav>
				</div>

				<button
					className="flex items-center gap-2 px-4 py-3 text-xs text-neutral-500 hover:text-neutral-800 border-t"
					onClick={() => router.push("/dashboard")}
				>
					<span>← Kembali ke Dashboard</span>
				</button>
			</aside>

			{/* Konten utama */}
			<main className="flex-1 p-8">
				<div className="flex items-center justify-between mb-6" data-aos="fade-down" data-aos-duration="500">
					<div>
						<h1 className="text-2xl font-bold">Manajemen Kursus</h1>
						<p className="text-sm text-neutral-500 mt-1">
							Kelola semua kursus yang Anda buat. Tambah, edit, atau hapus kursus.
						</p>
					</div>
					<Link
						href="/admin/courses/new"
						className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
					>
						<span>+</span>
						<span>Buat Kursus Baru</span>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="bg-white rounded-xl border p-5" data-aos="fade-up" data-aos-duration="500" data-aos-delay="0">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
								📚
							</div>
							<div>
								<p className="text-2xl font-bold">{courses.length}</p>
								<p className="text-xs text-neutral-500">Total Kursus</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl border p-5" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
								✅
							</div>
							<div>
								<p className="text-2xl font-bold">
									{courses.filter((c) => c.title && c.modules.length > 0).length}
								</p>
								<p className="text-xs text-neutral-500">Kursus Aktif</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl border p-5" data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
								📖
							</div>
							<div>
								<p className="text-2xl font-bold">
									{courses.reduce((acc, c) => acc + c.modules.length, 0)}
								</p>
								<p className="text-xs text-neutral-500">Total Modul</p>
							</div>
						</div>
					</div>
				</div>

				{/* Course List */}
				<section className="bg-white rounded-xl border shadow-sm" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
					<div className="p-5 border-b">
						<h2 className="text-sm font-semibold">Daftar Kursus</h2>
					</div>

					{courses.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-2xl">
								📚
							</div>
							<h3 className="text-lg font-semibold mb-2">Belum ada kursus</h3>
							<p className="text-sm text-neutral-500 mb-4">
								Mulai buat kursus pertama Anda untuk memulai
							</p>
							<Link
								href="/admin/courses/new"
								className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
							>
								<span>+</span>
								<span>Buat Kursus Baru</span>
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
										<div className="w-16 h-12 rounded-lg bg-neutral-100 overflow-hidden">
											{course.image ? (
												<img
													src={course.image}
													alt={course.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg">
													📖
												</div>
											)}
										</div>
										<div>
											<h3 className="font-semibold text-sm">
												{course.title || "Untitled Course"}
											</h3>
											<p className="text-xs text-neutral-500 mt-0.5">
												{course.modules.length} modul •{" "}
												{course.modules.reduce((acc, m) => acc + m.items.length, 0)}{" "}
												materi
											</p>
											<p className="text-xs text-neutral-400 mt-0.5">
												{course.price > 0
													? `Rp ${course.price.toLocaleString("id-ID")}`
													: "Gratis"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Link
											href={`/admin/courses/${course.id}`}
											className="px-3 py-1.5 text-xs rounded-md border text-neutral-700 hover:bg-neutral-100 transition-colors"
										>
											Edit
										</Link>
										<button
											onClick={() => confirmDelete(course.id)}
											className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
										>
											Hapus
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</main>

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
							className="px-4 py-2 text-sm rounded-md border text-neutral-700 hover:bg-neutral-100"
						>
							Batal
						</button>
						<button
							onClick={handleDeleteCourse}
							className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
						>
							Hapus
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

