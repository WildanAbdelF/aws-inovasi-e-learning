"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, clearUser, clearPurchases } from "@/lib/localStorageHelper";
import {
	AdminCourse,
	createEmptyAdminCourse,
	getAdminCourses,
	saveAdminCourses,
} from "@/lib/adminCoursesStorage";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function NewCoursePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [user, setUser] = useState<any>(null);
	const [course, setCourse] = useState<AdminCourse | null>(null);
	const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [successDialogOpen, setSuccessDialogOpen] = useState(false);

	// Protect route: only admin can access
	useEffect(() => {
		const stored = getUser() as any;
		if (!stored || stored.role !== "admin") {
			router.replace("/dashboard");
			return;
		}
		setUser(stored);

		// Create new empty course
		const empty = createEmptyAdminCourse();
		setCourse(empty);
		setSelectedModuleId(empty.modules[0].id);
		setSelectedItemId(empty.modules[0].items[0].id);
		setLoading(false);
	}, [router]);

	const selectedModule = useMemo(
		() => course?.modules.find((m) => m.id === selectedModuleId) || null,
		[course, selectedModuleId]
	);

	const selectedItem = useMemo(
		() => selectedModule?.items.find((i) => i.id === selectedItemId) || null,
		[selectedModule, selectedItemId]
	);

	const updateCourse = (updater: (c: AdminCourse) => AdminCourse) => {
		setCourse((prev) => {
			if (!prev) return prev;
			return updater(prev);
		});
	};

	const handleSave = () => {
		if (course) {
			// Validasi minimal
			if (!course.title.trim()) {
				window.alert("Judul kursus tidak boleh kosong.");
				return;
			}

			// Simpan ke localStorage
			const existing = getAdminCourses();
			saveAdminCourses([...existing, course]);
			
			// Tampilkan dialog sukses
			setSuccessDialogOpen(true);
		}
	};

	const handleSuccessClose = () => {
		setSuccessDialogOpen(false);
		router.push("/admin");
	};

	const handleDeleteModule = (moduleId: string) => {
		updateCourse((c) => {
			const newModules = c.modules.filter((m) => m.id !== moduleId);
			if (newModules.length === 0) {
				// Jika tidak ada modul tersisa, buat modul kosong
				const newId = `module_${Date.now()}`;
				newModules.push({
					id: newId,
					title: "Module 1",
					items: [],
				});
			}
			// Update selected module jika yang dihapus adalah yang dipilih
			if (selectedModuleId === moduleId) {
				setSelectedModuleId(newModules[0].id);
				setSelectedItemId(newModules[0].items[0]?.id || null);
			}
			return { ...c, modules: newModules };
		});
	};

	const handleDeleteItem = (moduleId: string, itemId: string) => {
		updateCourse((c) => ({
			...c,
			modules: c.modules.map((m) => {
				if (m.id !== moduleId) return m;
				const newItems = m.items.filter((i) => i.id !== itemId);
				// Update selected item jika yang dihapus adalah yang dipilih
				if (selectedItemId === itemId) {
					setSelectedItemId(newItems[0]?.id || null);
				}
				return { ...m, items: newItems };
			}),
		}));
	};

	if (loading || !course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-sm text-neutral-500">Memuat halaman...</p>
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
				<h1 className="text-lg font-bold text-neutral-900">Buat Kursus Baru</h1>
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
				<div className="flex items-center justify-between mb-8" data-aos="fade-down" data-aos-duration="500">
					<div>
						<h1 className="text-2xl font-bold text-neutral-900">Buat Kursus Baru</h1>
						<p className="text-neutral-500 text-sm">Atur struktur kursus, modules, dan konten materi.</p>
					</div>
					<div className="flex items-center gap-3">
						<Link
							href="/admin"
							className="px-4 py-2.5 text-sm border rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
						>
							Batal
						</Link>
						<button
							onClick={handleSave}
							className="px-4 py-2.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
						>
							Simpan Kursus
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					{/* Panel kiri: Course Details + Modules */}
					<div className="space-y-6" data-aos="fade-up" data-aos-duration="500">
						<section className="bg-white rounded-xl border p-5">
							<h2 className="text-sm font-semibold mb-4">Course Details</h2>

							<div className="space-y-3 text-sm">
								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">
										Judul Kursus <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Masukkan judul kursus"
										value={course.title}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, title: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">Deskripsi</label>
									<textarea
										className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Deskripsi singkat tentang kursus ini"
										value={course.description || ""}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, description: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">
										Thumbnail Kursus (URL)
									</label>
									<input
										className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="https://..."
										value={course.image}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, image: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">
										Harga Lifetime (IDR)
									</label>
									<input
										type="number"
										className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="0"
										value={course.price}
										onChange={(e) =>
											updateCourse((c) => ({
												...c,
												price: Number(e.target.value) || 0,
											}))
										}
									/>
								</div>
							</div>
						</section>

						{/* Modules */}
						<section className="bg-white rounded-xl border p-5">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-sm font-semibold">Modules</h2>
							</div>

							<div className="space-y-2 text-sm">
								{course.modules.map((mod, idx) => {
									const isActive = mod.id === selectedModuleId;
									return (
										<div key={mod.id} className="border rounded-md overflow-hidden">
											<div
												className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs ${
													isActive ? "bg-blue-50" : "bg-neutral-50 hover:bg-neutral-100"
												}`}
											>
												<button
													className="flex-1 text-left font-medium flex items-center gap-2"
													onClick={() => {
														setSelectedModuleId(mod.id);
														const firstItem = mod.items[0];
														setSelectedItemId(firstItem ? firstItem.id : null);
													}}
												>
													<span className="text-[11px] text-neutral-500">
														{idx + 1}.
													</span>
													{mod.title || "Untitled Module"}
												</button>
												<button
													className="p-1 text-neutral-400 hover:text-red-500"
													onClick={() => handleDeleteModule(mod.id)}
													title="Hapus modul"
												>
													🗑️
												</button>
											</div>

											{isActive && (
												<div className="bg-white border-t px-3 py-2 space-y-1">
													<div className="mb-2">
														<input
															className="w-full border rounded px-2 py-1 text-xs"
															placeholder="Nama modul"
															value={mod.title}
															onChange={(e) =>
																updateCourse((c) => ({
																	...c,
																	modules: c.modules.map((m) =>
																		m.id === mod.id
																			? { ...m, title: e.target.value }
																			: m
																	),
																}))
															}
														/>
													</div>

													{mod.items.map((item) => (
														<div
															key={item.id}
															className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs ${
																item.id === selectedItemId
																	? "bg-blue-50 text-blue-700"
																	: "text-neutral-700 hover:bg-neutral-50"
															}`}
														>
															<button
																className="flex-1 text-left"
																onClick={() => setSelectedItemId(item.id)}
															>
																{item.type === "quiz"
																	? "📝 " + (item.title || "Quiz")
																	: "📄 " + (item.title || "Halaman Materi")}
															</button>
															<button
																className="p-0.5 text-neutral-400 hover:text-red-500"
																onClick={() => handleDeleteItem(mod.id, item.id)}
																title="Hapus item"
															>
																×
															</button>
														</div>
													))}

													<div className="flex gap-2 pt-2">
														<button
															className="flex-1 border rounded-md px-2 py-1 text-[11px] hover:bg-neutral-50"
															onClick={() =>
																updateCourse((c) => {
																	const modules = c.modules.map((m) => {
																		if (m.id !== mod.id) return m;
																		const newItemId = `item_${Date.now()}`;
																		return {
																			...m,
																			items: [
																				...m.items,
																				{
																					id: newItemId,
																					title: "Halaman Baru",
																					type: "page" as const,
																					content: "",
																				},
																			],
																		};
																	});
																	return { ...c, modules };
																})
															}
														>
															+ Halaman Materi
														</button>
														<button
															className="flex-1 border rounded-md px-2 py-1 text-[11px] hover:bg-neutral-50"
															onClick={() =>
																updateCourse((c) => {
																	const modules = c.modules.map((m) => {
																		if (m.id !== mod.id) return m;
																		const newItemId = `item_${Date.now()}`;
																		return {
																			...m,
																			items: [
																				...m.items,
																				{
																					id: newItemId,
																					title: "Quiz Baru",
																					type: "quiz" as const,
																					content: "",
																				},
																			],
																		};
																	});
																	return { ...c, modules };
																})
															}
														>
															+ Kuis
														</button>
													</div>
												</div>
											)}
										</div>
									);
								})}

								<button
									className="w-full mt-2 border-dashed border-2 rounded-lg px-3 py-2.5 text-xs text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
									onClick={() =>
										updateCourse((c) => {
											const newId = `module_${Date.now()}`;
											const newModule = {
												id: newId,
												title: `Module ${c.modules.length + 1}`,
												items: [],
											};
											return { ...c, modules: [...c.modules, newModule] };
										})
									}
								>
									+ Tambah Modul Baru
								</button>
							</div>
						</section>
					</div>

					{/* Panel kanan: Edit Halaman Materi */}
					<section className="lg:col-span-2 bg-white rounded-xl border p-5 min-h-[400px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-sm font-semibold">Edit Halaman Materi</h2>
								<p className="text-xs text-neutral-500 mt-1">
									Atur judul dan konten untuk halaman materi atau quiz.
								</p>
							</div>
						</div>

						{selectedModule && selectedItem ? (
							<div className="space-y-4 text-sm">
								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">
										Judul Halaman
									</label>
									<input
										className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										value={selectedItem.title}
										onChange={(e) => {
											const value = e.target.value;
											updateCourse((c) => ({
												...c,
												modules: c.modules.map((m) => {
													if (m.id !== selectedModule.id) return m;
													return {
														...m,
														items: m.items.map((it) =>
															it.id === selectedItem.id
																? { ...it, title: value }
																: it
														),
													};
												}),
											}));
										}}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-700 mb-1">Konten</label>
									<textarea
										className="w-full border rounded-lg px-3 py-2 text-sm min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Tulis konten materi di sini..."
										value={selectedItem.content}
										onChange={(e) => {
											const value = e.target.value;
											updateCourse((c) => ({
												...c,
												modules: c.modules.map((m) => {
													if (m.id !== selectedModule.id) return m;
													return {
														...m,
														items: m.items.map((it) =>
															it.id === selectedItem.id
																? { ...it, content: value }
																: it
														),
													};
												}),
											}));
										}}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-neutral-700 mb-1">
											URL Gambar / Thumbnail (opsional)
										</label>
										<input
											className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											placeholder="https://..."
											value={selectedItem.mediaUrl || ""}
											onChange={(e) => {
												const value = e.target.value;
												updateCourse((c) => ({
													...c,
													modules: c.modules.map((m) => {
														if (m.id !== selectedModule.id) return m;
														return {
															...m,
															items: m.items.map((it) =>
																it.id === selectedItem.id
																	? { ...it, mediaUrl: value }
																	: it
															),
														};
													}),
												}));
											}}
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-neutral-700 mb-1">
											URL Video (opsional)
										</label>
										<input
											className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											placeholder="https://youtube.com/... atau embed URL"
											value={selectedItem.videoUrl || ""}
											onChange={(e) => {
												const value = e.target.value;
												updateCourse((c) => ({
													...c,
													modules: c.modules.map((m) => {
														if (m.id !== selectedModule.id) return m;
														return {
															...m,
															items: m.items.map((it) =>
																it.id === selectedItem.id
																	? { ...it, videoUrl: value }
																	: it
															),
														};
													}),
												}));
											}}
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-64 text-center">
								<div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
									<svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</div>
								<p className="text-sm text-neutral-500">
									Pilih module dan halaman materi untuk mulai mengedit.
								</p>
								<p className="text-xs text-neutral-400 mt-1">
									Klik pada module di sebelah kiri untuk melihat konten
								</p>
							</div>
						)}
					</section>
				</div>
			</main>
		</div>

		{/* Success Dialog */}
		<Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<span className="text-green-500">✓</span>
							Kursus Berhasil Dibuat!
						</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
							<svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<p className="text-sm text-neutral-600 text-center">
							Kursus <strong>{course.title}</strong> telah berhasil dibuat dan
							disimpan. Anda dapat melihatnya di halaman Management Courses.
						</p>
					</div>
					<div className="flex justify-center gap-3">
						<button
							onClick={() => {
								setSuccessDialogOpen(false);
								// Reset form untuk membuat kursus baru
								const empty = createEmptyAdminCourse();
								setCourse(empty);
								setSelectedModuleId(empty.modules[0].id);
								setSelectedItemId(empty.modules[0].items[0].id);
							}}
							className="px-4 py-2 text-sm rounded-lg border text-neutral-700 hover:bg-neutral-100 transition-colors"
						>
							Buat Kursus Lagi
						</button>
						<button
							onClick={handleSuccessClose}
							className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
						>
							Ke Management Courses
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
