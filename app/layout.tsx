import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AOSProvider } from "@/components/providers/AOSProvider";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "AWS Inovasi E-Learning",
  description: "Platform pembelajaran modern untuk meningkatkan keahlian Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-poppins bg-white text-neutral-900`} suppressHydrationWarning>
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
