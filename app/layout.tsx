import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelas Binet | The Academic Atelier",
  description: "Website resmi kelas Binet",
  keywords: ["kelas", "sekolah", "akademik", "jadwal", "galeri", "prestasi"],
  openGraph: {
    title: "Kelas Binet | The Academic Atelier",
    description: "Website resmi kelas Binet",
    type: "website",
  },
  icons: {
    icon: "binet.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
