"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getPurchases, getSubscriptions, getCertificates, StoredUser, Certificate } from "@/lib/localStorageHelper";
import { dummyCourses } from "@/lib/data/courses.data";
import CertificateModal from "@/components/certificate/CertificateModal";

type DashboardCourse = {
	id: string;
	title: string;
	price: number | null;
	accessType: "lifetime" | "subscription";
	expiresAt?: string | null;
};

type TabType = "courses" | "certificates";

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<StoredUser | null>(null);
	const [myCourses, setMyCourses] = useState<DashboardCourse[]>([]);
	const [certificates, setCertificates] = useState<Certificate[]>([]);
	const [activeTab, setActiveTab] = useState<TabType>("courses");
	const [isTabAnimating, setIsTabAnimating] = useState(false);
	const [showCertificate, setShowCertificate] = useState(false);
	const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

	useEffect(() => {
		const storedUser = getUser();
		if (!storedUser) {
			router.push("/login");
			return;
		}
		setUser(storedUser);
		setMyCourses(buildAccessibleCourses());
		setCertificates(getCertificates(storedUser.email));
	}, [router]);

	const buildAccessibleCourses = (): DashboardCourse[] => {
		const purchases = getPurchases().map((course) => ({
			id: course.id,
			title: course.title,
			price: course.price,
			accessType: "lifetime" as const,
			expiresAt: null,
		}));
		const subscriptions = getSubscriptions().map((sub) => ({
			id: sub.courseId,
			title: sub.title,
			price: null,
			accessType: "subscription" as const,
			expiresAt: sub.expiresAt,
		}));

		const map = new Map<string, DashboardCourse>();
		purchases.forEach((course) => {
			map.set(course.id, course);
		});
		subscriptions.forEach((sub) => {
			if (!map.has(sub.id)) {
				map.set(sub.id, sub);
			}
		});

		return Array.from(map.values());
	};

	if (!user) {
		return null;
	}

	const name = user.name || user.email;

	const formatDate = (value?: string | null) => {
		if (!value) return "30 hari";
		return new Intl.DateTimeFormat("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(new Date(value));
	};

	const getFirstLessonPath = (courseId: string) => {
		const courseData = dummyCourses.find((course) => course.id === courseId);
		const firstModule = courseData?.modules?.[0];
		const firstItem = firstModule?.items[0];
		if (!firstModule || !firstItem) return null;
		return `/learn/${courseId}/${firstModule.id}/${firstItem.id}`;
	};

	const handleContinue = (courseId: string) => {
		const path = getFirstLessonPath(courseId);
		if (!path) return;
		router.push(path);
	};

	return (
		<div
			className="max-w-7xl mx-auto py-10 px-6"
			data-aos="fade-up"
			data-aos-duration="600"
		>
			{/* Header with profile link */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<h1 className="text-2xl sm:text-3xl font-extrabold">Selamat Datang, {name}!</h1>
				<Link
					href="/settings"
					className="w-full sm:w-auto flex items-center gap-3 px-4 py-2 bg-white border rounded-lg hover:bg-neutral-50 transition-colors"
				>
					<div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
						{name.charAt(0).toUpperCase()}
					</div>
					<div className="text-left min-w-0">
						<p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
						<p className="text-xs text-neutral-500">Pengaturan Akun</p>
					</div>
					<svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			</div>

			<div className="flex gap-4 sm:gap-6 border-b mb-6 text-xs sm:text-sm overflow-x-auto">
				<button
					onClick={() => {
						if (activeTab !== "courses") {
							setIsTabAnimating(true);
							setTimeout(() => {
								setActiveTab("courses");
								setTimeout(() => setIsTabAnimating(false), 50);
							}, 150);
						}
					}}
					className={`pb-3 font-medium whitespace-nowrap transition-colors duration-200 ${
						activeTab === "courses"
							? "border-b-2 border-blue-600 text-blue-600"
							: "text-neutral-500 hover:text-neutral-700"
					}`}
				>
					Kursus Aktif
				</button>
				<button
					onClick={() => {
						if (activeTab !== "certificates") {
							setIsTabAnimating(true);
							setTimeout(() => {
								setActiveTab("certificates");
								setTimeout(() => setIsTabAnimating(false), 50);
							}, 150);
						}
					}}
					className={`pb-3 font-medium whitespace-nowrap transition-colors duration-200 ${
						activeTab === "certificates"
							? "border-b-2 border-blue-600 text-blue-600"
							: "text-neutral-500 hover:text-neutral-700"
					}`}
				>
					Sertifikat Saya
				</button>
			</div>

			{activeTab === "courses" && (
				<div className={`transition-all duration-300 ease-out ${isTabAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
					{myCourses.length === 0 && (
						<div className="col-span-1 sm:col-span-2 xl:col-span-4 text-xs sm:text-sm text-neutral-600">
							Belum ada kursus atau langganan aktif. Mulai dari katalog untuk menambah akses belajar.
						</div>
					)}
					{myCourses.map((course) => (
					<div
						key={course.id}
						className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]"
					>
						<div className="relative h-32 bg-gradient-to-r from-orange-400 to-lime-400">
							<span
								className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
									course.accessType === "lifetime" ? "bg-emerald-600" : "bg-blue-600"
								}`}
							>
								{course.accessType === "lifetime" ? "Lifetime" : "Langganan 1 Bulan"}
							</span>
						</div>
						<div className="p-4 flex-1 flex flex-col">
							<h3 className="font-semibold mb-1 line-clamp-2">{course.title}</h3>
							<p className="text-xs text-neutral-500 mb-3">
								{course.accessType === "lifetime"
									? `Akses Lifetime — Rp ${course.price?.toLocaleString("id-ID")}`
									: `Langganan aktif hingga ${formatDate(course.expiresAt)}`}
							</p>
							<button
								onClick={() => handleContinue(course.id)}
								className="mt-auto bg-white text-blue-700 text-sm py-2 rounded-sm disabled:bg-neutral-300 transition-all duration-200 hover:bg-blue-800 hover:text-white hover:scale-[1.02] hover:cursor-pointer outline outline-blue-700"
								disabled={!getFirstLessonPath(course.id)}
							>
							Lanjutkan Belajar
							</button>
						</div>
					</div>
				))}
				</div>
				</div>
			)}

			{activeTab === "certificates" && (
				<div className={`transition-all duration-300 ease-out ${isTabAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
				<div className="space-y-4">
					{certificates.length === 0 ? (
						<div className="bg-white border rounded-xl p-8 text-center">
							<div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
								<svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
								</svg>
							</div>
							<p className="text-neutral-600 mb-2">Belum ada sertifikat</p>
							<p className="text-sm text-neutral-500">Selesaikan kursus untuk mendapatkan sertifikat</p>
						</div>
					) : (
						certificates.map((cert) => (
							<div
								key={cert.id}
								className="bg-white border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
							>
								<div>
									<h3 className="font-semibold text-neutral-900">{cert.courseTitle}</h3>
									<p className="text-sm text-neutral-500">Oleh: {cert.instructorName}</p>
									<p className="text-sm text-neutral-500">
										Tanggal Selesai: {formatDate(cert.completedAt)}
									</p>
								</div>
								<div className="flex gap-3">
									<button
										onClick={() => {
											setSelectedCertificate(cert);
											setShowCertificate(true);
										}}
										className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-sm hover:bg-blue-600 hover:text-white transition-colors"
									>
										Lihat Sertifikat
									</button>
									<button
										onClick={() => {
											setSelectedCertificate(cert);
											setShowCertificate(true);
										}}
										className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-sm hover:bg-blue-600 hover:text-white transition-colors"
									>
										Unduh PDF
									</button>
								</div>
							</div>
						))
					)}
				</div>
				</div>
			)}

			{/* Certificate Modal */}
			<CertificateModal
				open={showCertificate}
				onClose={() => {
					setShowCertificate(false);
					setSelectedCertificate(null);
				}}
				certificate={selectedCertificate}
			/>
		</div>
	);
}
