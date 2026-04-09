import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelas Binet | The Academic Atelier",
  description: "Website resmi kelas kami — sebuah ruang untuk rasa ingin tahu intelektual dan penemuan bersama. Dirancang untuk pelajar modern.",
  keywords: ["kelas", "sekolah", "akademik", "jadwal", "galeri", "prestasi"],
  openGraph: {
    title: "Kelas Binet | The Academic Atelier",
    description: "Website resmi kelas kami — ruang untuk eksplorasi dan kebersamaan.",
    type: "website",
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
