import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppProviders from "../components/AppProviders";

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
  title: {
    default: "PDF X - Бесплатные онлайн-инструменты для PDF",
    template: "%s | PDF X",
  },
  description:
    "Сжимай, объединяй, конвертируй и анализируй PDF бесплатно. Обработка в браузере: файлы не уходят на сервер.",
  keywords: [
    "pdf",
    "сжать pdf",
    "объединить pdf",
    "pdf в jpg",
    "jpg в pdf",
    "pdf онлайн",
    "бесплатно pdf",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "PDF X",
    title: "PDF X - Бесплатные онлайн-инструменты для PDF",
    description: "Сжимай, объединяй и конвертируй PDF в браузере. Быстро и конфиденциально.",
    url: "https://pdfx.tools",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF X - Бесплатные онлайн-инструменты для PDF",
    description: "12 инструментов для работы с PDF прямо в браузере.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070809] text-[#e8e3db] min-h-screen`}>
        <AppProviders>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProviders>

        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        {yandexMetrikaId ? (
          <>
            <Script id="yandex-metrika" strategy="afterInteractive">
              {`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(${yandexMetrikaId}, "init", {
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true,
                  webvisor: true
                });
              `}
            </Script>
            <noscript>
              <div>
                <img src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
              </div>
            </noscript>
          </>
        ) : null}

        {adsenseClient ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  );
}
