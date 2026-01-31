import type { Metadata } from "next";
import { Outfit, Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const font = Outfit({ subsets: ["latin"] });
const arabicFont = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: {
    default: "Electro Islam | Premium Electronics Store",
    template: "%s | Electro Islam",
  },
  description: "The premier destination for high-end electronics in Morocco. Shop laptops, gaming gear, and accessories with fast shipping and warranty.",
  keywords: ["electronics", "laptops", "gaming", "morocco", "pc parts", "tech store"],
  authors: [{ name: "Electro Islam" }],
  creator: "Electro Islam",
  metadataBase: new URL('https://electro-islam.com'),
  openGraph: {
    type: "website",
    locale: "en_MA",
    url: "https://electro-islam.com",
    title: "Electro Islam | Premium Electronics Store",
    description: "The premier destination for high-end electronics in Morocco.",
    siteName: "Electro Islam",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Electro Islam Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electro Islam | Premium Electronics Store",
    description: "The best place to buy electronics in Morocco.",
    images: ["/og-image.jpg"],
    creator: "@electroislam",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: '/',
  },
};

import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} ${arabicFont.variable}`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ScrollProgress />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
