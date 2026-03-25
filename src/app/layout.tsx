import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rate My Life AI",
  description: "Dapatkan insight dan skor kehidupanmu dari AI dengan gaya santai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  );
}
