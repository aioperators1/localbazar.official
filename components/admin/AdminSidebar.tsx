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
    Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
    { name: "Home", href: "/admin", icon: Home },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Tag },
    { name: "Categories", href: "/admin/categories", icon: Layout },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Banners", href: "/admin/banners", icon: Megaphone },
    { name: "Brands", href: "/admin/brands", icon: Tag },
];

const secondaryItems = [
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Marketplace", href: "/admin/marketplace", icon: Store },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

const SidebarContent = ({
    setIsMobileOpen
}: {
    setIsMobileOpen: (open: boolean) => void
}) => {
    const pathname = usePathname();
    
    return (
        <div className="bg-[#EBEEEF] h-full flex flex-col py-6 overflow-hidden border-r border-[#D2D2D2]">
            <div className="px-5 mb-8 flex items-center gap-3">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#111111] to-[#444444] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    <div className="relative w-10 h-10 bg-[#111111] rounded-lg flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                         <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="text-white font-black text-lg tracking-tighter">LB</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[#111111] font-black text-[15px] uppercase tracking-[-0.03em] leading-tight">Local Bazar</span>
                    <span className="text-[#616161] text-[9.5px] font-black uppercase tracking-[0.25em] leading-none opacity-80">Command Center</span>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-6 overflow-y-auto no-scrollbar">
                <div>
                    <div className="px-3 mb-2">
                        <span className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-[0.15em]">Core Ops</span>
                    </div>
                    <div className="space-y-0.5">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 group relative",
                                        isActive 
                                            ? "bg-white text-[#111111] shadow-[0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-[#111111]/5" 
                                            : "text-[#616161] hover:text-[#111111] hover:bg-white/40"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-all duration-300",
                                        isActive ? "text-[#111111] scale-100" : "text-[#7A7A7A] group-hover:text-[#111111]"
                                    )} />
                                    <span className="flex-1 truncate uppercase tracking-tight">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-[#111111] rounded-full animate-pulse" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="px-3 mb-2">
                        <span className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-[0.15em]">Intelligence</span>
                    </div>
                    <div className="space-y-0.5">
                        {secondaryItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 group relative",
                                        isActive 
                                            ? "bg-white text-[#111111] shadow-[0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-[#111111]/5" 
                                            : "text-[#616161] hover:text-[#111111] hover:bg-white/40"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-all duration-300",
                                        isActive ? "text-[#111111]" : "text-[#7A7A7A] group-hover:text-[#111111]"
                                    )} />
                                    <span className="flex-1 truncate uppercase tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-2">
                    <div className="px-3 mb-2">
                        <span className="text-[10px] font-black text-[#8A8A8A] uppercase tracking-[0.15em]">Channels</span>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold text-[#616161] hover:text-[#111111] hover:bg-[#DDE2E4] transition-all duration-300 group"
                    >
                        <div className="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100">
                             <Monitor className="w-[18px] h-[18px]" />
                        </div>
                        <span className="flex-1 truncate uppercase tracking-tight">Main Boutique</span>
                    </Link>
                </div>
            </nav>

            <div className="mt-auto px-3 py-4 border-t border-[#D2D2D2]">
                <button 
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-black uppercase tracking-tight text-[#D72C0D] hover:bg-[#FBEAE9] rounded-lg transition-all duration-300 group"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    Logout Session
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
                className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-50"
                style={{ width: '240px', background: '#EBEBEB', borderRight: '1px solid #D2D2D2' }}
            >
                <SidebarContent setIsMobileOpen={() => {}} />
            </aside>

            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-[60] bg-white border border-[#E3E3E3] shadow-md rounded-full h-10 w-10 text-[#616161]"
            >
                <Menu className="w-5 h-5" />
            </Button>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute inset-0 bg-[#303030]/20 backdrop-blur-sm"
                    />
                    <aside className="absolute inset-y-0 left-0 w-64 bg-[#EBEBEB] flex flex-col shadow-2xl">
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-2 right-2 p-1.5 text-[#616161] hover:text-[#303030] transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarContent setIsMobileOpen={setIsMobileOpen} />
                    </aside>
                </div>
            )}
        </>
    );
}
