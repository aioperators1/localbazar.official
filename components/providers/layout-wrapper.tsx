"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Maintenance } from "@/components/store/Maintenance";

import { WelcomePage } from "@/components/store/WelcomePage";

export function LayoutWrapper({ 
  children, 
  settings 
}: { 
  children: React.ReactNode;
  settings: any;
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
        <Toaster />
      </>
    );
  }

  // Hide global layout for success page to avoid double header/footer
  if (isSuccess) {
    return (
      <div className="bg-transparent min-h-screen">
        <main>{children}</main>
        <Toaster />
      </div>
    );
  }

  // Maintenance Mode Check
  if (settings?.maintenanceMode === "true" && pathname !== "/maintenance" && !pathname?.startsWith("/login") && !pathname?.startsWith("/api/auth")) {
    return <Maintenance />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-white">
      <WelcomePage />
      <ScrollProgress />
      <Header settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
      <Toaster />
    </div>
  );
}
