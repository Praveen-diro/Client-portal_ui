import type React from "react";
import { MainLayout } from "./components/MainLayout";
import "./globals.css"; // Add this if it's not already imported
import { Inter } from "next/font/google";
import { inter } from "./fonts";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${interFont.variable} font-sans`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
