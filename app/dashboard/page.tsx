"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getPurchases, PurchasedCourse, StoredUser } from "@/lib/localStorageHelper";
import { dummyCourses } from "@/lib/data/courses.data";

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<StoredUser | null>(null);
	const [myCourses, setMyCourses] = useState<PurchasedCourse[]>([]);

	useEffect(() => {
		const storedUser = getUser();
		if (!storedUser) {
			router.push("/login");
			return;
		}
		setUser(storedUser);
		setMyCourses(getPurchases());
	}, [router]);

	if (!user) {
		return null;
	}

	const name = user.name || user.email;

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
				<button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium whitespace-nowrap">
					Kursus Aktif
				</button>
				<button className="pb-3 text-neutral-500 whitespace-nowrap">Sertifikat Saya</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
				{myCourses.length === 0 && (
					<div className="col-span-1 sm:col-span-2 xl:col-span-4 text-xs sm:text-sm text-neutral-600">
						Belum ada kursus yang Anda beli. Beli kursus terlebih dahulu dari katalog.
					</div>
				)}
				{myCourses.map((course) => (
					<div
						key={course.id}
						className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col"
					>
						<div className="h-32 bg-gradient-to-r from-orange-400 to-lime-400" />
						<div className="p-4 flex-1 flex flex-col">
							<h3 className="font-semibold mb-1 line-clamp-2">{course.title}</h3>
							<p className="text-xs text-neutral-500 mb-3">
								Akses Lifetime — Rp {course.price.toLocaleString("id-ID")}
							</p>
							<button
								onClick={() => handleContinue(course.id)}
								className="mt-auto bg-blue-700 text-white text-sm py-2 rounded-lg disabled:bg-neutral-300"
								disabled={!getFirstLessonPath(course.id)}
							>
								Lanjutkan Belajar
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
