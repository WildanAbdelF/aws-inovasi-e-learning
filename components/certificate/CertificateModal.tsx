"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Certificate } from "@/lib/localStorageHelper";

interface CertificateModalProps {
	open: boolean;
	onClose: () => void;
	certificate: Certificate | null;
}

export default function CertificateModal({ open, onClose, certificate }: CertificateModalProps) {
	const certificateRef = useRef<HTMLDivElement>(null);

	if (!certificate) return null;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const handleDownloadPDF = async () => {
		const { jsPDF } = await import("jspdf");

		try {
			const pdf = new jsPDF({
				orientation: "landscape",
				unit: "mm",
				format: "a4",
			});

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const centerX = pageWidth / 2;

			// Background
			pdf.setFillColor(255, 255, 255);
			pdf.rect(0, 0, pageWidth, pageHeight, "F");

			// Border
			pdf.setDrawColor(200, 200, 200);
			pdf.setLineWidth(0.5);
			pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

			// Logo (graduation cap icon as text)
			pdf.setFontSize(40);
			pdf.setTextColor(30, 58, 95);
			pdf.text("🎓", centerX, 40, { align: "center" });

			// Title
			pdf.setFontSize(24);
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(30, 58, 95);
			pdf.text("SERTIFIKAT PENYELESAIAN", centerX, 60, { align: "center" });

			// Subtitle
			pdf.setFontSize(12);
			pdf.setFont("helvetica", "normal");
			pdf.setTextColor(100, 100, 100);
			pdf.text("Diberikan kepada:", centerX, 75, { align: "center" });

			// User Name
			pdf.setFontSize(28);
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(30, 64, 175);
			pdf.text(certificate.userName.toUpperCase(), centerX, 95, { align: "center" });

			// Description
			pdf.setFontSize(12);
			pdf.setFont("helvetica", "normal");
			pdf.setTextColor(100, 100, 100);
			pdf.text("Atas keberhasilannya telah menyelesaikan kursus", centerX, 115, { align: "center" });

			// Course Title
			pdf.setFontSize(18);
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(23, 23, 23);
			pdf.text(certificate.courseTitle, centerX, 130, { align: "center" });

			// Divider line
			pdf.setDrawColor(180, 180, 180);
			pdf.setLineWidth(0.3);
			pdf.line(centerX - 30, 145, centerX + 30, 145);

			// Footer - Instructor
			pdf.setFontSize(12);
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(50, 50, 50);
			pdf.text(certificate.instructorName, centerX - 50, 165, { align: "center" });
			pdf.setFontSize(10);
			pdf.setFont("helvetica", "normal");
			pdf.setTextColor(120, 120, 120);
			pdf.text("Instruktur", centerX - 50, 172, { align: "center" });

			// Footer - Date
			pdf.setFontSize(12);
			pdf.setFont("helvetica", "bold");
			pdf.setTextColor(50, 50, 50);
			pdf.text(formatDate(certificate.completedAt), centerX + 50, 165, { align: "center" });
			pdf.setFontSize(10);
			pdf.setFont("helvetica", "normal");
			pdf.setTextColor(120, 120, 120);
			pdf.text("Tanggal", centerX + 50, 172, { align: "center" });

			pdf.save(`Sertifikat-${certificate.courseTitle.replace(/\s+/g, "-")}.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Gagal mengunduh sertifikat. Silakan coba lagi.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Pratinjau Sertifikat</DialogTitle>
				</DialogHeader>

				{/* Certificate Preview */}
				<div className="p-4">
					<div
						ref={certificateRef}
						style={{
							backgroundColor: "#ffffff",
							border: "2px solid #e5e5e5",
							borderRadius: "8px",
							padding: "48px",
							aspectRatio: "1.414 / 1",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center",
							minHeight: "500px",
						}}
					>
						{/* Logo */}
						<div style={{ marginBottom: "24px" }}>
							<svg
								width="64"
								height="64"
								viewBox="0 0 24 24"
								fill="#1e3a5f"
							>
								<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
							</svg>
						</div>

						{/* Title */}
						<h1 style={{
							fontSize: "28px",
							fontWeight: "bold",
							color: "#1e3a5f",
							letterSpacing: "2px",
							marginBottom: "16px",
						}}>
							SERTIFIKAT PENYELESAIAN
						</h1>

						{/* Subtitle */}
						<p style={{ color: "#525252", marginBottom: "8px", fontSize: "16px" }}>
							Diberikan kepada:
						</p>

						{/* User Name */}
						<h2 style={{
							fontSize: "36px",
							fontWeight: "bold",
							color: "#1e40af",
							marginBottom: "16px",
						}}>
							{certificate.userName.toUpperCase()}
						</h2>

						{/* Description */}
						<p style={{ color: "#525252", marginBottom: "8px", fontSize: "16px" }}>
							Atas keberhasilannya telah menyelesaikan kursus
						</p>

						{/* Course Title */}
						<h3 style={{
							fontSize: "20px",
							fontWeight: "bold",
							color: "#171717",
							marginBottom: "24px",
						}}>
							{certificate.courseTitle}
						</h3>

						{/* Divider */}
						<div style={{
							width: "96px",
							height: "2px",
							backgroundColor: "#d4d4d4",
							marginBottom: "32px",
						}}></div>

						{/* Footer Info */}
						<div style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "80px",
						}}>
							<div style={{ textAlign: "center" }}>
								<p style={{ fontWeight: "bold", color: "#262626", fontSize: "16px" }}>
									{certificate.instructorName}
								</p>
								<p style={{ fontSize: "14px", color: "#737373" }}>Instruktur</p>
							</div>
							<div style={{ textAlign: "center" }}>
								<p style={{ fontWeight: "bold", color: "#262626", fontSize: "16px" }}>
									{formatDate(certificate.completedAt)}
								</p>
								<p style={{ fontSize: "14px", color: "#737373" }}>Tanggal</p>
							</div>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-center gap-3 pt-4 border-t">
					<button
						onClick={onClose}
						className="px-6 py-2.5 text-sm border rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
					>
						Tutup
					</button>
					<button
						onClick={handleDownloadPDF}
						className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
					>
						Unduh PDF
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
