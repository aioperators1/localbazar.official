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
];

const SidebarContent = ({
    setIsMobileOpen
}: {
    setIsMobileOpen: (open: boolean) => void
}) => {
    const pathname = usePathname();
    
    return (
        <div className="bg-[#EBEBEB] h-full flex flex-col py-6 overflow-hidden border-r border-[#D2D2D2]">
            <div className="px-5 mb-8 flex items-center gap-3">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#303030] to-[#616161] rounded-lg blur opacity-25" />
                    <div className="relative w-9 h-9 bg-[#303030] rounded-lg flex items-center justify-center border border-white/10 shadow-lg">
                        <span className="text-white font-black text-sm tracking-tighter">LB</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[#303030] font-black text-sm uppercase tracking-tight">Local Bazar</span>
                    <span className="text-[#616161] text-[10px] font-bold uppercase tracking-widest leading-none">Command Center</span>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 group relative",
                                isActive 
                                    ? "bg-white text-[#303030] shadow-[0_2px_8px_rgba(0,0,0,0.08)]" 
                                    : "text-[#616161] hover:bg-white/50 hover:text-[#303030]"
                            )}
                        >
                            <item.icon className={cn(
                                "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-[#303030]" : "text-[#616161]"
                            )} />
                            <span className="flex-1 truncate uppercase tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="absolute left-0 w-1 h-4 bg-[#303030] rounded-full" />
                            )}
                        </Link>
                    );
                })}

                <div className="pt-4 pb-2">
                    <div className="px-2 mb-1">
                        <span className="text-[11px] font-bold text-[#616161] uppercase tracking-tight px-1">Sales channels</span>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] text-[13px] font-semibold text-[#616161] hover:bg-[#E3E3E3] hover:text-[#303030] transition-colors group"
                    >
                        <Monitor className="w-4 h-4 shrink-0" />
                        <span className="flex-1 truncate">Online Store</span>
                    </Link>
                </div>
            </nav>

            <div className="p-2 border-t border-[#D2D2D2]">
                <button 
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export function AdminSidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-[60] bg-white border border-[#E3E3E3] shadow-md rounded-full h-10 w-10 text-[#616161]"
            >
                <Menu className="w-5 h-5" />
            </Button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-60 h-screen sticky top-0 flex-col z-50 shrink-0">
                <SidebarContent setIsMobileOpen={() => {}} />
            </aside>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute inset-0 bg-[#303030]/20 backdrop-blur-sm"
                    />
                    <aside className="absolute inset-y-0 left-0 w-64 bg-[#EBEBEB] flex flex-col shadow-2xl transition-transform transform translate-x-0">
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
        </div>
    );
}
