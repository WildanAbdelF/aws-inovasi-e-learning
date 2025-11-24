import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { AOSProvider } from "@/components/AOSProvider";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "AWS Inovasi E-Learning",
  description: "Platform pembelajaran modern untuk meningkatkan keahlian Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={montserrat.className + " bg-white text-neutral-900"}>
        <AuthProvider>
          <AOSProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AOSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
