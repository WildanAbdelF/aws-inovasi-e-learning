"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getPurchases, PurchasedCourse } from "@/lib/localStorageHelper";
import { dummyCourses } from "@/lib/data";

export default function DashboardPage() {
	const router = useRouter();
	const [name, setName] = useState<string | null>(null);
	const [myCourses, setMyCourses] = useState<PurchasedCourse[]>([]);

	useEffect(() => {
		const user = getUser();
		if (!user) {
			router.push("/login");
			return;
		}
		setName(user.name || user.email);
		setMyCourses(getPurchases());
	}, [router]);

	if (!name) {
		return null;
	}

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
			<h1 className="text-3xl font-extrabold mb-6">Selamat Datang, {name}!</h1>

			<div className="flex gap-6 border-b mb-6 text-sm">
				<button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium">
					Kursus Aktif
				</button>
				<button className="pb-3 text-neutral-500">Sertifikat Saya</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{myCourses.length === 0 && (
					<div className="md:col-span-2 xl:col-span-4 text-sm text-neutral-600">
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
