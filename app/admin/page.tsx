"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/localStorageHelper";
import {
	AdminCourse,
	createEmptyAdminCourse,
	getAdminCourses,
	saveAdminCourses,
} from "@/lib/adminCoursesStorage";

export default function AdminPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<AdminCourse | null>(null);
	const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

	// Protect route: only admin can access
	useEffect(() => {
		const stored = getUser() as any;
		if (!stored || stored.role !== "admin") {
			router.replace("/dashboard");
			return;
		}

		const existing = getAdminCourses();
		if (existing.length > 0) {
			const first = existing[0];
			setCourse(first);
			const firstModule = first.modules?.[0];
			setSelectedModuleId(firstModule ? firstModule.id : null);
			const firstItem = firstModule?.items?.[0];
			setSelectedItemId(firstItem ? firstItem.id : null);
		} else {
			const empty = createEmptyAdminCourse();
			setCourse(empty);
			setSelectedModuleId(empty.modules[0].id);
			setSelectedItemId(empty.modules[0].items[0].id);
			saveAdminCourses([empty]);
		}

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
			const updated = updater(prev);
			saveAdminCourses([updated]);
			return updated;
		});
	};

	const handleSave = () => {
		if (course) {
			saveAdminCourses([course]);
			window.alert("Perubahan course berhasil disimpan.");
		}
	};

	if (loading || !course) {
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
							<span>Dashboard</span>
						</button>
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white">
							<span>Course Management</span>
						</button>
						<button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
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
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Manajemen Kursus</h1>
						<p className="text-sm text-neutral-500 mt-1">
							Kelola struktur kursus, modules, dan konten materi.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => router.push("/katalog")}
							className="px-4 py-2 text-sm border rounded-md text-neutral-700 hover:bg-neutral-100"
						>
							Back to Courses
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
						>
							Simpan
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
									<label className="block text-xs font-medium mb-1">Judul Kursus</label>
									<input
										className="w-full border rounded-md px-3 py-2 text-sm"
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
										value={course.description || ""}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, description: e.target.value }))
										}
									/>
								</div>

								<div>
									<label className="block text-xs font-medium mb-1">Thumbnail Kursus (URL)</label>
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
									<label className="block text-xs font-medium mb-1">Harga Lifetime (IDR)</label>
									<input
										type="number"
										className="w-full border rounded-md px-3 py-2 text-sm"
										value={course.price}
										onChange={(e) =>
											updateCourse((c) => ({ ...c, price: Number(e.target.value) || 0 }))
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
											<button
												className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs ${
													isActive ? "bg-blue-50" : "bg-neutral-50 hover:bg-neutral-100"
												}`}
												onClick={() => {
													setSelectedModuleId(mod.id);
													const firstItem = mod.items[0];
													setSelectedItemId(firstItem ? firstItem.id : null);
												}}
											>
												<span className="font-medium flex items-center gap-2">
													<span className="text-[11px] text-neutral-500">
														{idx + 1}.
													</span>
													{mod.title || "Untitled Module"}
												</span>
											</button>

											{isActive && (
												<div className="bg-white border-t px-3 py-2 space-y-1">
													{mod.items.map((item) => (
														<button
															key={item.id}
															className={`w-full flex items-center gap-2 rounded-md px-2 py-1 text-xs text-left ${
																item.id === selectedItemId
																	? "bg-blue-50 text-blue-700"
																	: "text-neutral-700 hover:bg-neutral-50"
															}`}
															onClick={() => setSelectedItemId(item.id)}
														>
															<span>
																{item.type === "quiz" ? "📄 Quiz" : "📄 Halaman Materi"}
															</span>
														</button>
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
																					type: "page",
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
																					type: "quiz",
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
									<label className="block text-xs font-medium mb-1">Judul Halaman</label>
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
															it.id === selectedItem.id ? { ...it, title: value } : it
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
															it.id === selectedItem.id ? { ...it, content: value } : it
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
																it.id === selectedItem.id ? { ...it, mediaUrl: value } : it
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
										<p className="text-[11px] text-neutral-400 mt-1">
											Untuk demo, kita simpan sebagai URL biasa di localStorage.
										</p>
									</div>
								</div>
							</div>
						) : (
							<p className="text-sm text-neutral-500">
								Pilih module dan halaman materi untuk mulai mengedit.
							</p>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}

