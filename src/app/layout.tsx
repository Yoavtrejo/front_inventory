import type { Metadata } from "next";
import { Poppins, Noto_Sans  } from "next/font/google";
import "./globals.css";

const dmSans = Noto_Sans({
  variable: "--font-noto-sans",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300","400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGELARED",
  description: "Sistema de Gestión de Laboratorios de Red",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
