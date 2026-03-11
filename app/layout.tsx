import type { Metadata } from "next";
import { Outfit, Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const font = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});
const arabicFont = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: {
    default: "Local Bazar | L'Excellence du Luxe & de l'Héritage",
    template: "%s | Local Bazar",
  },
  description: "Découvrez Local Bazar, la destination privilégiée pour le luxe masculin au Qatar. Parfums d'Orient, couture raffinée et héritage traditionnel depuis 2013.",
  keywords: ["luxe", "fashion", "qatar", "parfums", "menswear", "local bazar"],
  authors: [{ name: "Local Bazar" }],
  creator: "Local Bazar",
  metadataBase: new URL('https://localbazar.gq'),
  openGraph: {
    type: "website",
    locale: "fr_QA",
    url: "https://localbazar.gq",
    title: "Local Bazar | L'Excellence du Luxe & de l'Héritage",
    description: "La destination privilégiée pour le luxe masculin au Qatar.",
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
    title: "Local Bazar | L'Excellence du Luxe & de l'Héritage",
    description: "Le meilleur du luxe masculin au Qatar.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAdminSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${font.className} ${arabicFont.variable} bg-[#f3f5f6]`}>
        <Providers>
          <LayoutWrapper settings={settings}>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
