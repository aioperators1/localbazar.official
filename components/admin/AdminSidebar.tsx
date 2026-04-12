"use client";

import { 
    Home,
    ShoppingCart,
    Tag,
    Users,
    BarChart2,
    Settings,
    Menu,
    X,
    LogOut,
    Store,
    Megaphone,
    Percent,
    Monitor,
    Layout,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { motion } from "framer-motion";

const menuItems = [
    { id: "dashboard", name: "Home", href: "/admin", icon: Home },
    { id: "orders", name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { id: "products", name: "Products", href: "/admin/products", icon: Tag },
    { id: "categories", name: "Categories", href: "/admin/categories", icon: Layout },
    { id: "customers", name: "Customers", href: "/admin/customers", icon: Users },
    { id: "banners", name: "Banners", href: "/admin/banners", icon: Megaphone },
    { id: "brands", name: "Brands", href: "/admin/brands", icon: Tag },
    { id: "vouchers", name: "Vouchers", href: "/admin/vouchers", icon: Percent },
    { id: "logo", name: "Logo", href: "/admin/logo", icon: Monitor },
];

const secondaryItems = [
    { id: "team", name: "Team", href: "/admin/team", icon: Shield },
    { id: "settings", name: "Settings", href: "/admin/settings", icon: Settings },
];

const SidebarContent = ({
    setIsMobileOpen
}: {
    setIsMobileOpen: (open: boolean) => void
}) => {
    const pathname = usePathname();
    const { canView } = usePermissions();
    
    return (
        <div className="h-full flex flex-col py-8 overflow-hidden relative">
            {/* Ultra Pro Background Architecture */}
            <div className="absolute inset-0 bg-[#0A0A0A] noisy-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            
            <Link href="/admin" className="relative px-8 mb-12 flex items-center gap-4 group cursor-pointer no-underline">
                <div className="relative">
                    <div className="absolute -inset-2 bg-white/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative w-12 h-12 bg-white text-[#0A0A0A] rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden transition-transform duration-700 group-hover:scale-105">
                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="font-black text-xl tracking-tighter">LB</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-black text-[17px] uppercase tracking-[-0.04em] leading-tight">Local Bazar</span>
                    <span className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] leading-none mt-1">Command Center</span>
                </div>
            </Link>

            <nav className="relative flex-1 px-4 space-y-10 overflow-y-auto no-scrollbar">
                <div className="space-y-3">
                    <div className="px-4 mb-4">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em]">Core Operations</span>
                    </div>
                    <div className="space-y-1.5">
                        {menuItems.filter(item => item.id === "dashboard" || canView(item.id)).map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-500 group relative overflow-hidden",
                                        isActive 
                                            ? "bg-white text-[#0A0A0A] shadow-[0_10px_30px_-5px_rgba(255,255,255,0.2)]" 
                                            : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-transform duration-500",
                                        isActive ? "scale-110" : "group-hover:scale-110"
                                    )} />
                                    <span className="flex-1 truncate uppercase tracking-[0.1em]">{item.name}</span>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-6 bg-[#0A0A0A] rounded-full" 
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="px-4 mb-4">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em]">Intelligence Matrix</span>
                    </div>
                    <div className="space-y-1.5">
                        {secondaryItems.filter(item => canView(item.id)).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-500 group relative overflow-hidden",
                                        isActive 
                                            ? "bg-white text-[#0A0A0A] shadow-[0_10px_30px_-5px_rgba(255,255,255,0.2)]" 
                                            : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-transform duration-500",
                                        isActive ? "scale-110" : "group-hover:scale-110"
                                    )} />
                                    <span className="flex-1 truncate uppercase tracking-[0.1em]">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 mx-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[12px] font-black text-white/30 hover:text-white transition-all duration-500 group bg-white/[0.02] border border-transparent hover:border-white/5"
                    >
                        <Monitor className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        <span className="flex-1 truncate uppercase tracking-[0.3em]">Main Boutique</span>
                    </Link>
                </div>
            </nav>

            <div className="relative mt-auto px-6 py-8">
                <button 
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 hover:text-white bg-rose-500/5 hover:bg-rose-500 rounded-2xl transition-all duration-700 group border border-rose-500/10"
                >
                    <LogOut className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    Terminate Session
                </button>
            </div>
        </div>
    );
};

export function AdminSidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-50 border-r border-white/5"
                style={{ width: '280px', background: '#050505' }}
            >
                <SidebarContent setIsMobileOpen={() => {}} />
            </aside>

            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] bg-white text-black shadow-2xl rounded-2xl h-14 w-14"
            >
                <Menu className="w-6 h-6" />
            </Button>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <aside className="absolute inset-y-0 left-0 w-80 bg-[#050505] flex flex-col shadow-2xl border-r border-white/5">
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-6 right-6 z-10 p-3 text-white/40 hover:text-white transition-all bg-white/5 rounded-2xl"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <SidebarContent setIsMobileOpen={setIsMobileOpen} />
                    </aside>
                </div>
            )}
        </>
    );
}
