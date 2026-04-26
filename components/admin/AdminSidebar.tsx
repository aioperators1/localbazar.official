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
    Shield,
    Truck,
    ChevronRight,
    Search as SearchIcon,
    Terminal,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { id: "dashboard", name: "Home", href: "/admin", icon: Home },
    { id: "orders", name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { id: "checkouts", name: "Checkouts", href: "/admin/checkouts", icon: ShoppingCart },
    { id: "products", name: "Products", href: "/admin/products", icon: Tag },
    { id: "categories", name: "Categories", href: "/admin/categories", icon: Layout },
    { id: "customers", name: "Customers", href: "/admin/customers", icon: Users },
    { id: "drivers", name: "Drivers", href: "/admin/drivers", icon: Truck },
    { id: "store", name: "Store", href: "/admin/store", icon: Store },
    { id: "banners", name: "Banners", href: "/admin/banners", icon: Megaphone },
    { id: "notice", name: "Notice Bar", href: "/admin/notice", icon: Terminal },
    { id: "brands", name: "Brands", href: "/admin/brands", icon: Tag },
    { id: "vouchers", name: "Vouchers", href: "/admin/vouchers", icon: Percent },
    { id: "logo", name: "Logo", href: "/admin/logo", icon: Monitor },
];

const secondaryItems = [
    { id: "team", name: "Team", href: "/admin/team", icon: Shield },
    { id: "settings", name: "Settings", href: "/admin/settings", icon: Settings },
];

const SidebarItem = ({ 
    item, 
    isActive, 
    onClick 
}: { 
    item: any; 
    isActive: boolean; 
    onClick: () => void 
}) => {
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className="relative group block"
        >
            <div className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative z-10",
                isActive 
                    ? "text-black" 
                    : "text-white/40 hover:text-white"
            )}>
                {isActive && (
                    <motion.div 
                        layoutId="active-nav-dark"
                        className="absolute inset-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
                
                <item.icon className={cn(
                    "w-4 h-4 transition-transform duration-500",
                    isActive ? "text-black scale-110" : "text-white/20 group-hover:text-white"
                )} />
                <span className="flex-1 truncate">{item.name}</span>
                
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-black/20"
                    />
                )}
            </div>
            
            {!isActive && (
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
        </Link>
    );
};

const SidebarContent = ({
    setIsMobileOpen
}: {
    setIsMobileOpen: (open: boolean) => void;
}) => {
    const pathname = usePathname();
    const { canView } = usePermissions();
    
    return (
        <div className="h-full flex flex-col py-8 overflow-hidden relative bg-[#0A0A0A] border-r border-white/5">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-white/[0.02] blur-[100px] pointer-events-none" />

            {/* Logo Section */}
            <div className="px-8 mb-10 flex flex-col gap-6 relative z-10">
                <Link href="/admin" className="flex flex-col items-center group no-underline text-center">
                    <div className="relative h-16 w-full">
                        <Image 
                            src="/logo-white-transparent.png" 
                            alt="Local Bazar Admin" 
                            fill 
                            className="object-contain transition-all duration-700"
                            unoptimized
                        />
                    </div>
                </Link>
                
                <div className="h-px w-full bg-white/10" />
            </div>

            {/* Navigation Sections */}
            <nav className="relative flex-1 px-4 space-y-10 overflow-y-auto no-scrollbar pb-10 z-10">
                {/* Core Section */}
                <div className="space-y-4">
                    <div className="px-4 mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Operations</span>
                        <div className="w-10 h-px bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                        {menuItems.filter(item => item.id === "dashboard" || canView(item.id)).map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <SidebarItem 
                                    key={item.href} 
                                    item={item} 
                                    isActive={isActive} 
                                    onClick={() => setIsMobileOpen(false)} 
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Intelligence Section */}
                <div className="space-y-4">
                    <div className="px-4 mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Administration</span>
                        <div className="w-10 h-px bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                        {secondaryItems.filter(item => canView(item.id)).map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <SidebarItem 
                                    key={item.href} 
                                    item={item} 
                                    isActive={isActive} 
                                    onClick={() => setIsMobileOpen(false)} 
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Action Link */}
                <div className="pt-8 border-t border-white/10 mx-2 flex flex-col gap-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-[10px] font-black text-white/20 hover:text-white hover:bg-white/5 transition-all duration-500 border border-transparent hover:border-white/5 uppercase tracking-[0.4em] group"
                    >
                        <Monitor className="w-4 h-4 opacity-40 group-hover:scale-110 transition-transform" />
                        <span>Public Store</span>
                    </Link>
                </div>
            </nav>

            {/* Footer / Terminate Session */}
            <div className="mt-auto px-4 py-8">
                <button 
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 hover:text-white bg-rose-500/5 hover:bg-rose-500 rounded-2xl transition-all duration-700 group border border-rose-500/10 shadow-2xl shadow-rose-500/10"
                >
                    <LogOut className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>Terminate Session</span>
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
                className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-50 overflow-hidden bg-black"
                style={{ width: '280px' }}
            >
                <SidebarContent setIsMobileOpen={() => {}} />
            </aside>

            {/* Mobile Toggle */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="lg:hidden fixed bottom-6 right-6 z-[60]"
            >
                <Button
                    onClick={() => setIsMobileOpen(true)}
                    className="bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl h-16 w-16 hover:scale-105 active:scale-95 transition-all p-0 flex items-center justify-center border-none"
                >
                    <Menu className="w-8 h-8" />
                </Button>
            </motion.div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="fixed inset-0 z-[70] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.aside 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-black flex flex-col border-r border-white/5"
                        >
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-8 right-8 z-10 p-3 text-white/40 hover:text-white transition-all bg-white/5 rounded-2xl"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <SidebarContent setIsMobileOpen={setIsMobileOpen} />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
