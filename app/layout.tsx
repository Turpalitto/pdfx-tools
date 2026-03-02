import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfx.tools"),
  title: "PDF X — Бесплатные онлайн-инструменты для PDF",
  description:
    "Сжимай, объединяй, конвертируй PDF бесплатно. Без серверов — все файлы обрабатываются в браузере. 12 инструментов для работы с PDF.",
  keywords: [
    "pdf",
    "pdf сжать",
    "pdf объединить",
    "pdf в jpg",
    "jpg в pdf",
    "pdf онлайн",
    "бесплатно pdf",
  ],
  openGraph: {
    title: "PDF X — Бесплатные онлайн-инструменты для PDF",
    description: "Сжимай, объединяй, конвертируй PDF бесплатно. Без серверов.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070809] text-[#e8e3db] min-h-screen`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
