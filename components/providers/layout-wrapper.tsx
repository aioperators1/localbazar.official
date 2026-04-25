"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Maintenance } from "@/components/store/Maintenance";

import { WelcomePage } from "@/components/store/WelcomePage";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";

export function LayoutWrapper({ 
  children, 
  settings,
  categories 
}: { 
  children: React.ReactNode;
  settings: any;
  categories: any[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isSuccess = pathname?.startsWith("/success");

  useEffect(() => {
    // Force scroll to top with a small delay to override default Next.js or browser restoration
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);
 
  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  // Hide global layout for success page to avoid double header/footer
  if (isSuccess) {
    return (
      <div className="bg-transparent min-h-screen">
        <main>{children}</main>
        <Toaster position="top-center" />
      </div>
    );
  }

  // Maintenance Mode Check
  if (settings?.maintenanceMode === "true" && pathname !== "/maintenance" && !pathname?.startsWith("/login") && !pathname?.startsWith("/api/auth")) {
    return <Maintenance />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-white overflow-x-hidden max-w-[100vw]">
      <AnnouncementBar 
        text={settings?.notice_bar_text || ""} 
        active={settings?.notice_bar_active === "true"} 
        bgColor={settings?.notice_bar_bg_color}
        textColor={settings?.notice_bar_text_color}
      />
      <WelcomePage />
      <ScrollProgress />
      <Header settings={settings} categories={categories} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} categories={categories} />
      <Toaster position="top-center" />
    </div>
  );
}
