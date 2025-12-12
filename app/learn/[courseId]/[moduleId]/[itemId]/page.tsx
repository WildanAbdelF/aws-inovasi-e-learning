"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { dummyCourses } from "@/lib/data/courses.data";
import { getPurchases, getSubscriptionByCourseId } from "@/lib/localStorageHelper";
import type { QuizQuestion } from "@/types/course";

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

	// Quiz state
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
	const [quizSubmitted, setQuizSubmitted] = useState(false);

	// Sidebar toggle state
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const quizQuestions: QuizQuestion[] = currentItem?.quizQuestions || [];
	const isQuizItem = currentItem?.type === "quiz" && quizQuestions.length > 0;

	useEffect(() => {
		if (!course) return;
		const purchases = getPurchases();
		const hasLifetime = purchases.some((p) => p.id === course.id);
		const hasSubscription = Boolean(getSubscriptionByCourseId(course.id));
		const hasAccess = hasLifetime || hasSubscription;
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

	// Quiz handlers
	const currentQuestion = quizQuestions[currentQuestionIndex];
	const totalQuestions = quizQuestions.length;

	const handleSelectAnswer = (questionId: string, optionId: string) => {
		if (quizSubmitted) return;
		setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
	};

	const handlePrevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleNextQuestion = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	};

	const handleSubmitQuiz = () => {
		setQuizSubmitted(true);
	};

	const calculateScore = () => {
		let correct = 0;
		quizQuestions.forEach((q) => {
			if (selectedAnswers[q.id] === q.correctOptionId) {
				correct++;
			}
		});
		return correct;
	};

	// Render Quiz UI
	const renderQuiz = () => {
		if (!currentQuestion) return null;

		const selectedOptionId = selectedAnswers[currentQuestion.id] || "";

		if (quizSubmitted) {
			const score = calculateScore();
			const percentage = Math.round((score / totalQuestions) * 100);
			const passed = percentage >= 70;

			return (
				<div className="max-w-2xl mx-auto py-10 text-center">
					<div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
						{passed ? (
							<svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						) : (
							<svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						)}
					</div>
					<h2 className="text-2xl font-bold mb-2">
						{passed ? "Selamat! Anda Lulus!" : "Coba Lagi!"}
					</h2>
					<p className="text-neutral-600 mb-4">
						Skor Anda: <span className="font-bold text-xl">{score}/{totalQuestions}</span> ({percentage}%)
					</p>
					<p className="text-sm text-neutral-500 mb-6">
						{passed
							? "Anda telah berhasil menyelesaikan kuis ini."
							: "Anda membutuhkan minimal 70% untuk lulus. Silakan coba lagi."}
					</p>
					<div className="flex gap-3 justify-center">
						<button
							onClick={() => {
								setQuizSubmitted(false);
								setCurrentQuestionIndex(0);
								setSelectedAnswers({});
							}}
							className="px-6 py-3 border rounded-lg text-sm font-medium hover:bg-neutral-50"
						>
							Ulangi Kuis
						</button>
						{passed && nextLesson && (
							<button
								onClick={() => handleNavigate(nextLesson)}
								className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
							>
								Lanjut ke Materi Berikutnya
							</button>
						)}
					</div>
				</div>
			);
		}

		return (
			<div className="max-w-2xl mx-auto">
				{/* Quiz Header */}
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-neutral-900 mb-2">
						{currentItem.title}
					</h1>
					<p className="text-neutral-500">
						Soal {currentQuestionIndex + 1} dari {totalQuestions}
					</p>
				</div>

				{/* Question Card */}
				<div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-neutral-900 text-center mb-6">
						{currentQuestion.questionText}
					</h2>

					{/* Options */}
					<div className="space-y-3">
						{currentQuestion.options.map((option) => {
							const isSelected = selectedOptionId === option.id;
							return (
								<button
									key={option.id}
									onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
									className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
										isSelected
											? "border-red-400 bg-red-50"
											: "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
									}`}
								>
									<div
										className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
											isSelected
												? "border-red-500 bg-red-500"
												: "border-neutral-300"
										}`}
									>
										{isSelected && (
											<div className="w-2 h-2 rounded-full bg-white" />
										)}
									</div>
									<span className={`text-sm ${isSelected ? "text-red-700 font-medium" : "text-neutral-700"}`}>
										{option.text}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Navigation */}
				<div className="flex justify-between items-center">
					<button
						onClick={handlePrevQuestion}
						disabled={currentQuestionIndex === 0}
						className="px-6 py-3 border rounded-lg text-sm font-medium text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
					>
						Previous
					</button>

					{currentQuestionIndex === totalQuestions - 1 ? (
						<button
							onClick={handleSubmitQuiz}
							disabled={Object.keys(selectedAnswers).length < totalQuestions}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
						>
							Submit Kuis
						</button>
					) : (
						<button
							onClick={handleNextQuestion}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
						>
							Next
						</button>
					)}
				</div>
			</div>
		);
	};

	// Render sidebar for quiz view
	const renderQuizSidebar = () => (
		<aside
			className={`bg-white border-r shadow-sm transition-all duration-300 overflow-hidden flex-shrink-0 ${
				sidebarOpen ? "w-72 p-5" : "w-0 p-0"
			}`}
		>
			<div className={`transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
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
											className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition flex items-center gap-2 ${
												isActive
													? "border-rose-500 bg-rose-50 text-rose-600"
													: "border-transparent bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
											}`}
										>
											{item.type === "quiz" ? (
												<span className="text-amber-500">📝</span>
											) : (
												<span className="text-blue-500">📄</span>
											)}
											<span className="flex-1 truncate">{item.title}</span>
											{isCompleted && (
												<span className="text-green-600 text-xs">✓</span>
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</aside>
	);

	return (
		<div className="min-h-screen bg-neutral-50">
			{isQuizItem ? (
				/* ========== QUIZ VIEW WITH COLLAPSIBLE SIDEBAR ========== */
				<div className="flex min-h-screen">
					{/* Sidebar Toggle Button - Bottom Left */}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-white border rounded-full shadow-lg hover:bg-neutral-50 transition-colors"
						title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
					>
						{sidebarOpen ? (
							<svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
							</svg>
						) : (
							<svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						)}
						<span className="text-sm font-medium text-neutral-700">
							{sidebarOpen ? "Sembunyikan" : "Modul"}
						</span>
					</button>

					{/* Collapsible Sidebar */}
					{renderQuizSidebar()}

					{/* Quiz Content */}
					<div className="flex-1 py-10 px-4">
						{renderQuiz()}
					</div>
				</div>
			) : (
				/* ========== REGULAR LESSON VIEW ========== */
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
			)}
		</div>
	);
}
