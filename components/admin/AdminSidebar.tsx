"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Store,
    MessageSquare,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Marketplace", href: "/admin/marketplace", icon: Store },
    { name: "Messages", href: "/admin/conversations", icon: MessageSquare },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
];

const SidebarContent = ({
    session,
    pathname,
    setIsMobileOpen
}: {
    session: any,
    pathname: string,
    setIsMobileOpen: (open: boolean) => void
}) => (
    <>
        <div className="p-6 relative">
            {/* Glow effect under logo */}
            <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-[50px] pointer-events-none" />

            <Link href="/" className="flex items-center gap-3 group relative z-10 text-decoration-none">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 border border-blue-400/20">
                        E
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-white leading-none group-hover:text-blue-400 transition-colors">ELECTRO</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-0.5 group-hover:text-zinc-400 transition-colors">Admin Panel</span>
                </div>
            </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 block overflow-y-auto py-4">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-4 mt-2 font-mono">
                Main Menu
            </div>
            {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "text-white shadow-lg shadow-blue-500/10"
                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl" />
                        )}

                        <Icon className={cn(
                            "w-5 h-5 relative z-10 transition-colors duration-300",
                            isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-zinc-600 group-hover:text-zinc-300"
                        )} />
                        <span className="relative z-10">{link.name}</span>

                        {isActive && (
                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse" />
                        )}
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto relative z-10">
            <div className="bg-gradient-to-t from-white/5 to-transparent rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white border border-white/20 group-hover:border-indigo-400/50 transition-all duration-500 shadow-lg shadow-indigo-500/20">
                        <span className="font-black text-xs tracking-tighter">IS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate group-hover:text-indigo-400 transition-colors uppercase italic tracking-tight">{session?.user?.name || "Admin"}</p>
                        <p className="text-[10px] font-bold text-zinc-500 truncate uppercase tracking-widest">Administrator</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/20 border border-transparent rounded-lg py-2 transition-all duration-300"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                </button>
            </div>
        </div>
    </>
);

export function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 border border-blue-400/20 text-xs">
                        E
                    </div>
                    <span className="font-black text-lg tracking-tight text-white uppercase">ELECTRO<span className="text-blue-500">ADMIN</span></span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0 flex-col z-50">
                <SidebarContent session={session} pathname={pathname} setIsMobileOpen={setIsMobileOpen} />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-white/10 z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <SidebarContent session={session} pathname={pathname} setIsMobileOpen={setIsMobileOpen} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
