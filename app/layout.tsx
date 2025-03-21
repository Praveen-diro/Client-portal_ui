import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import Script from "next/script";

// Optimize font loading for better performance
const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Use 'swap' to prevent blocking font rendering
  preload: true,
  // Removed adjustFontFallback which is not supported in Next.js 15
});

// Add metadata for improved SEO and performance
export const metadata = {
  metadataBase: new URL("https://your-site.com"),
  title: "DIRO Client Portal",
  description: "DIRO Client Portal Application",
};

// Separate viewport export as required by Next.js 15
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Use script with strategy for better loading performance */}
        <Script src="//geoip-js.com/js/apis/geoip2/v2.1/geoip2.js" strategy="lazyOnload" defer />
      </head>
      <body className={cn(interFont.variable, "font-sans min-h-screen")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="diro-theme">
          <Providers>
            <div className="min-h-screen">{children}</div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
