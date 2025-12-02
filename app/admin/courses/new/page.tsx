"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/localStorageHelper";
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
			<div className="min-h-[80vh] flex items-center justify-center">
				<p className="text-sm text-neutral-500">Memuat halaman...</p>
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
							<p className="text-[11px] text-neutral-500">Course Builder</p>
						</div>
					</div>

					<nav className="px-3 py-4 text-sm space-y-1">
						<Link
							href="/admin"
							className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100"
						>
							<span>📊</span>
							<span>Course Management</span>
						</Link>
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white">
							<span>➕</span>
							<span>Buat Kursus Baru</span>
						</button>
					</nav>
				</div>

				<button
					className="flex items-center gap-2 px-4 py-3 text-xs text-neutral-500 hover:text-neutral-800 border-t"
					onClick={() => router.push("/admin")}
				>
					<span>← Kembali ke Management</span>
				</button>
			</aside>

			{/* Konten utama */}
			<main className="flex-1 p-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Buat Kursus Baru</h1>
						<p className="text-sm text-neutral-500 mt-1">
							Atur struktur kursus, modules, dan konten materi.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Link
							href="/admin"
							className="px-4 py-2 text-sm border rounded-md text-neutral-700 hover:bg-neutral-100"
						>
							Batal
						</Link>
						<button
							onClick={handleSave}
							className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
						>
							Simpan Kursus
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					{/* Panel kiri: Course Details + Modules */}
					<div className="space-y-6">
						<section className="bg-white rounded-xl border shadow-sm p-5">
							<h2 className="text-sm font-semibold mb-4">Course Details</h2>

							<div className="space-y-3 text-sm">
								<div>
									<label className="block text-xs font-medium mb-1">
										Judul Kursus <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full border rounded-md px-3 py-2 text-sm"
										placeholder="Masukkan judul kursus"
										value={course.title}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, title: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium mb-1">Deskripsi</label>
									<textarea
										className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
										placeholder="Deskripsi singkat tentang kursus ini"
										value={course.description || ""}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, description: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium mb-1">
										Thumbnail Kursus (URL)
									</label>
									<input
										className="w-full border rounded-md px-3 py-2 text-sm"
										placeholder="https://..."
										value={course.image}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, image: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium mb-1">
										Harga Lifetime (IDR)
									</label>
									<input
										type="number"
										className="w-full border rounded-md px-3 py-2 text-sm"
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
						<section className="bg-white rounded-xl border shadow-sm p-5">
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
									className="w-full mt-2 border-dashed border rounded-md px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
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
					<section className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5 min-h-[400px]">
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
									<label className="block text-xs font-medium mb-1">
										Judul Halaman
									</label>
									<input
										className="w-full border rounded-md px-3 py-2 text-sm"
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
									<label className="block text-xs font-medium mb-1">Konten</label>
									<textarea
										className="w-full border rounded-md px-3 py-2 text-sm min-h-[160px]"
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
										<label className="block text-xs font-medium mb-1">
											URL Gambar / Thumbnail (opsional)
										</label>
										<input
											className="w-full border rounded-md px-3 py-2 text-sm"
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
										<label className="block text-xs font-medium mb-1">
											URL Video (opsional)
										</label>
										<input
											className="w-full border rounded-md px-3 py-2 text-sm"
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
								<div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-2xl mb-4">
									📝
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
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl">
							🎉
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
							className="px-4 py-2 text-sm rounded-md border text-neutral-700 hover:bg-neutral-100"
						>
							Buat Kursus Lagi
						</button>
						<button
							onClick={handleSuccessClose}
							className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
						>
							Ke Management Courses
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
