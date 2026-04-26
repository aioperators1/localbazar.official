import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const font = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit"
});


export const metadata: Metadata = {
  title: {
    default: "Local Bazar | Premium Luxury & Heritage",
    template: "%s | Local Bazar",
  },
  description: "Discover Local Bazar, the premier destination for luxury fashion in Qatar. Exquisite abayas, elegant jalabiyas, and premium oriental perfumes.",
  keywords: ["luxury", "fashion", "qatar", "perfumes", "abayas", "jalabiyas", "local bazar"],
  authors: [{ name: "Local Bazar" }],
  creator: "Local Bazar",
  metadataBase: new URL('https://localbazar.com'),
  openGraph: {
    type: "website",
    locale: "en_QA",
    url: "https://localbazar.com",
    title: "Local Bazar | The Excellence of Luxury & Heritage",
    description: "The premier destination for luxury fashion and heritage in Qatar.",
    siteName: "Local Bazar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Local Bazar Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Bazar | The Excellence of Luxury & Heritage",
    description: "The premier destination for luxury fashion and heritage in Qatar.",
    images: ["/og-image.jpg"],
    creator: "@localbazar",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: '/',
  },
};

import { LayoutWrapper } from "@/components/providers/layout-wrapper";
import { getAdminSettings } from "@/lib/actions/admin";
import { getCategories, getBrands } from "@/lib/actions/product";
import { WatermarkBackground } from "@/components/store/WatermarkBackground";
import { InitialLoader } from "@/components/store/InitialLoader";
import NextTopLoader from 'nextjs-toploader';
import { AnalyticsTracker } from "@/components/store/AnalyticsTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories, brands] = await Promise.all([
    getAdminSettings(),
    getCategories(),
    getBrands()
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${font.className} ${font.variable} bg-[#20080B] text-white relative antialiased selection:bg-white/10 selection:text-white`} suppressHydrationWarning>
        <NextTopLoader
          color="#FFF"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFF,0 0 5px #FFF"
        />
        <WatermarkBackground />
        <Providers>
          <AnalyticsTracker />
          <LayoutWrapper settings={settings} categories={categories} brands={brands}>
            <div className="relative z-10 w-full">
              {children}
            </div>
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
