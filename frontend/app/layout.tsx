import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  themeColor: "#00AEEF",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
