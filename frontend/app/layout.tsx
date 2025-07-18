import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Head from "next/head"; // <-- Tambahkan ini
import "./globals.css";
import RegisterSW from "./components/utils/RegisterSW";
import PWAInstallHandler from "./components/utils/PWAInstallHandler";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dokter Ikan",
  description: "Aplikasi untuk deteksi penyakit ikan dan konsultasi.",
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      url: "/images/logo/logo_dokterikan192.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/images/logo/logo_dokterikan192.png",
    },
  ],
  appleWebApp: {
    capable: true,
    title: "Dokter Ikan",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#00AEEF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <Head>
        <noscript>
          <link rel="prefetch" href="/fallback.html" />
        </noscript>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RegisterSW />
        <PWAInstallHandler 
          apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
        />
        {children}
      </body>
    </html>
  );
}
