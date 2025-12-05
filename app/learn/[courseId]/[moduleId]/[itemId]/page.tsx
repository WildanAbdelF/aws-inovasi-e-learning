"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { dummyCourses } from "@/lib/data/courses.data";
import { getPurchases } from "@/lib/localStorageHelper";

type ProgressMap = Record<string, string[]>;

const PROGRESS_KEY = "lms_dummy_course_progress";

export default function LearnDetailPage() {
	const router = useRouter();
	const params = useParams();
	const courseId = params?.courseId as string;
	const moduleId = params?.moduleId as string;
	const itemId = params?.itemId as string;
	const course = dummyCourses.find((c) => c.id === courseId);
	const modules = course?.modules ?? [];
	const [progress, setProgress] = useState<string[]>([]);
	const [isAuthorized, setIsAuthorized] = useState(false);

	const currentModule = modules.find((module) => module.id === moduleId);
	const currentItem = currentModule?.items.find((item) => item.id === itemId);

	useEffect(() => {
		if (!course) return;
		const purchases = getPurchases();
		const hasAccess = purchases.some((p) => p.id === course.id);
		if (!hasAccess) {
			router.replace("/dashboard");
			return;
		}
		setIsAuthorized(true);
	}, [course, router]);

	useEffect(() => {
		if (!isAuthorized || !course) return;
		const raw = window.localStorage.getItem(PROGRESS_KEY);
		let parsed: ProgressMap = {};
		if (raw) {
			try {
				parsed = JSON.parse(raw) as ProgressMap;
			} catch {
				parsed = {};
			}
		}
		const list = parsed[course.id] ?? [];
		if (!list.includes(itemId)) {
			const updated = [...list, itemId];
			parsed[course.id] = updated;
			window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(parsed));
			setProgress(updated);
		} else {
			setProgress(list);
		}
	}, [isAuthorized, course, itemId]);

	const flattenedLessons = useMemo(() => {
		return modules.flatMap((module) =>
			module.items.map((item) => ({
				moduleId: module.id,
				moduleTitle: module.title,
				itemId: item.id,
				itemTitle: item.title,
			}))
		);
	}, [modules]);

	const totalLessons = flattenedLessons.length;
	const completedLessons = progress.length;
	const progressPercent = totalLessons
		? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
		: 0;

	const currentIndex = flattenedLessons.findIndex((entry) => entry.itemId === itemId);
	const prevLesson = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
	const nextLesson =
		currentIndex !== -1 && currentIndex < flattenedLessons.length - 1
			? flattenedLessons[currentIndex + 1]
			: null;

	if (!course) {
		return <div className="max-w-4xl mx-auto py-10 px-6">Course tidak ditemukan.</div>;
	}

	if (!currentModule || !currentItem) {
		return (
			<div className="max-w-4xl mx-auto py-10 px-6">
				Konten kursus tidak ditemukan. Pilih modul lain dari dashboard.
			</div>
		);
	}

	const handleNavigate = (target?: typeof flattenedLessons[number] | null) => {
		if (!target) return;
		router.push(`/learn/${course.id}/${target.moduleId}/${target.itemId}`);
	};

	const renderMedia = () => {
		if (!currentItem.mediaUrl) return null;
		if (currentItem.mediaUrl.includes("youtube")) {
			return (
				<div className="aspect-video rounded-2xl overflow-hidden bg-black">
					<iframe
						src={currentItem.mediaUrl}
						title={currentItem.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="w-full h-full"
					/>
				</div>
			);
		}
		return (
			<div className="rounded-2xl overflow-hidden border">
				<img src={currentItem.mediaUrl} alt={currentItem.title} className="w-full h-auto" />
			</div>
		);
	};

	const paragraphs = currentItem.content
		.split("\n")
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-6xl mx-auto flex flex-col gap-8 py-10 px-4 lg:flex-row lg:gap-10">
				<aside className="w-full lg:max-w-xs bg-white rounded-2xl border shadow-sm p-6 h-fit" data-aos="fade-right" data-aos-duration="600">
					<p className="text-sm text-neutral-500 mb-2">{course.title}</p>
					<h2 className="text-lg font-bold mb-4">Progress Keseluruhan</h2>
					<div className="mb-6">
						<div className="flex justify-between text-xs text-neutral-500 mb-2">
							<span>{progressPercent}%</span>
							<span>
								{completedLessons}/{totalLessons} pelajaran
							</span>
						</div>
						<div className="h-2 rounded-full bg-neutral-200">
							<div
								className="h-full rounded-full bg-rose-500 transition-all"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
					<div className="space-y-4">
						{modules.map((module) => (
							<div key={module.id}>
								<p className="text-sm font-semibold text-neutral-800 mb-2">
									{module.title}
								</p>
								<div className="space-y-1">
									{module.items.map((item) => {
										const isActive = item.id === currentItem.id;
										const isCompleted = progress.includes(item.id);
										return (
											<button
												key={item.id}
												onClick={() => handleNavigate({
													moduleId: module.id,
													moduleTitle: module.title,
													itemId: item.id,
													itemTitle: item.title,
												})}
												className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition ${
													isActive
														? "border-rose-500 bg-rose-50 text-rose-600"
														: "border-transparent bg-neutral-100 text-neutral-700"
												}`}
											>
												<span>{item.title}</span>
												{isCompleted && <span className="ml-2 text-xs text-green-600">Selesai</span>}
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</aside>
				<main className="flex-1" data-aos="fade-left" data-aos-duration="600" data-aos-delay="100">
					<nav className="text-xs text-neutral-500 mb-4">
						Katalog Kursus / {course.title} / {currentModule.title}
					</nav>
					<h1 className="text-3xl font-extrabold mb-3" data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">{currentItem.title}</h1>
					{renderMedia()}
					<div className="space-y-4 text-neutral-700 leading-relaxed mt-6">
						{paragraphs.map((paragraph, index) => (
							<p key={`${currentItem.id}-${index}`}>{paragraph}</p>
						))}
					</div>
					<div className="flex justify-between mt-10">
						<button
							onClick={() => handleNavigate(prevLesson)}
							disabled={!prevLesson}
							className="px-5 py-3 rounded-full border text-sm font-medium disabled:opacity-40"
						>
							Sebelumnya
						</button>
						<button
							onClick={() => handleNavigate(nextLesson)}
							disabled={!nextLesson}
							className="px-5 py-3 rounded-full bg-rose-600 text-white text-sm font-semibold disabled:bg-neutral-300"
						>
							{nextLesson ? "Selesai & Lanjutkan" : "Selesai"}
						</button>
					</div>
				</main>
			</div>
		</div>
	);
}
