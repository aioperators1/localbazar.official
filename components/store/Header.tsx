"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SearchModal } from "@/components/store/SearchModal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Package, MessageCircle, LogIn, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkUnreadMessages } from "@/lib/actions/marketplace";

export function Header() {
    const { data: session } = useSession();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === "ar";
    const dir = isAr ? "rtl" : "ltr";

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (session) {
            checkUnreadMessages().then(setHasUnread);
        }
    }, [session]);

    const pathname = usePathname();

    const isHomePage = pathname === "/";
    const textColorClass = (isHomePage && !scrolled)
        ? "text-white"
        : "text-zinc-900 dark:text-white";

    const borderColorClass = (isHomePage && !scrolled)
        ? "border-white/5"
        : "border-black/5 dark:border-white/5";

    const itemCount = mounted ? totalItems() : 0;

    if (pathname.startsWith("/admin")) return null;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 pointer-events-none" dir={dir}>
                <div className={cn(
                    "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-between px-4 md:px-8 relative z-50",
                    scrolled
                        ? "w-[95%] md:w-[70%] bg-zinc-950/90 backdrop-blur-xl shadow-pro h-16 translate-y-4 rounded-full border border-white/10"
                        : "w-full max-w-[1400px] h-24 bg-transparent border-none"
                )}>
                    {/* Logo & Brand Name */}
                    <Link href="/" className="flex items-center gap-4 group text-decoration-none">
                        <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg">
                            <Image src="/logo.png" alt="ElectroIslam" fill className="object-contain" />
                        </div>
                        <div className="flex flex-col leading-none justify-center">
                            <span className={cn("font-black text-xl md:text-3xl tracking-tighter transition-colors uppercase", textColorClass)}>
                                ELECTRO<span className="text-blue-600 dark:text-blue-500 drop-shadow-md">ISLAM</span>
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-zinc-500 tracking-[0.4em] uppercase hidden sm:block">
                                {t("nav.premiumHardware") || "PREMIUM HARDWARE"}
                            </span>
                        </div>
                    </Link>

                    {/* Center Nav - Desktop */}
                    <nav className={cn(
                        "hidden md:flex items-center gap-8 text-[11px] font-bold transition-all",
                        isAr ? "text-sm" : "uppercase tracking-widest"
                    )}>
                        <Link href="/shop" className={cn("transition-colors hover:text-blue-500", textColorClass)}>{t("nav.shop")}</Link>
                        <Link href="/marketplace" className={cn("transition-colors hover:text-blue-500", textColorClass)}>{t("nav.marketplace")}</Link>
                        <Link href="/shop?category=laptops" className={cn("transition-colors hover:text-blue-500", textColorClass)}>{t("nav.laptops")}</Link>
                        <Link href="/shop?category=components" className={cn("transition-colors hover:text-blue-500", textColorClass)}>{t("nav.components")}</Link>
                        <Link href="/deals" className="text-blue-600 hover:text-blue-400 font-black transition-colors">{t("nav.deals")}</Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <div className="hidden md:flex items-center gap-1 font-bold">
                            <ThemeToggle />
                            <LanguageToggle />
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={cn("transition-colors p-2 hover:text-blue-500", textColorClass)}
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        <Link href="/cart" className="relative group p-2">
                            <ShoppingCart className={cn("w-5 h-5 group-hover:text-blue-500 transition-colors", textColorClass)} />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[9px] font-black text-white border border-background shadow-sm"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* User Menu / Login */}
                        <div className="relative hidden md:block">
                            {session ? (
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={cn("p-2 transition-colors hover:text-blue-500 flex items-center gap-2", textColorClass)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center relative">
                                        <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                        {hasUnread && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                                        )}
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className={cn("p-2 transition-colors hover:text-blue-500 flex items-center gap-2", textColorClass)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center group/login relative">
                                        <LogIn className="w-4 h-4 text-zinc-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                </Link>
                            )}

                            <AnimatePresence>
                                {isUserMenuOpen && session && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-0"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 4 }}
                                            className={cn(
                                                "absolute top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-pro overflow-hidden z-10",
                                                isAr ? "left-0" : "right-0"
                                            )}
                                        >
                                            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">{t("nav.account")}</p>
                                                <p className="text-xs font-bold text-foreground px-2 truncate">{session.user?.name || session.user?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    {t("nav.myOrders")}
                                                </Link>
                                                <Link
                                                    href="/my-listings"
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    {t("nav.myListings")}
                                                </Link>
                                                <Link
                                                    href="/chats"
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    {t("nav.myChats")}
                                                </Link>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors mt-2"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {t("nav.logout")}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className={cn("md:hidden p-2", textColorClass)}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay - Fullscreen */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, clipPath: isAr ? "circle(0% at top left)" : "circle(0% at top right)" }}
                            animate={{ opacity: 1, clipPath: isAr ? "circle(150% at top left)" : "circle(150% at top right)" }}
                            exit={{ opacity: 0, clipPath: isAr ? "circle(0% at top left)" : "circle(0% at top right)" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="pointer-events-auto fixed inset-0 bg-zinc-950 z-40 flex flex-col items-center justify-center p-6 md:hidden"
                            style={{ top: 0, left: 0, bottom: 0, right: 0 }} // Force fullscreen
                        >
                            {/* Background decoration */}
                            <div className="absolute inset-0 z-[-1] overflow-hidden opacity-20 pointer-events-none">
                                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px]" />
                                <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]" />
                            </div>

                            <div className={`flex flex-col gap-6 text-center text-xl font-black ${isAr ? "" : "uppercase tracking-tighter"}`}>
                                <Link href="/shop" className="text-white hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.shop")}</Link>
                                <Link href="/marketplace" className="text-blue-500 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.marketplace")}</Link>
                                <Link href="/shop?category=laptops" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.laptops")}</Link>
                                <Link href="/shop?category=components" className="text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.components")}</Link>
                                <Link href="/deals" className="text-blue-600 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.deals")}</Link>

                                <div className="h-px w-12 bg-white/10 mx-auto my-4" />

                                {session ? (
                                    <>
                                        <Link href="/orders" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.myOrders")}</Link>
                                        <Link href="/my-listings" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.myListings")}</Link>
                                        <Link href="/chats" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.myChats")}</Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                                        >
                                            {t("nav.logout")}
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>{t("nav.login")}</Link>
                                )}
                            </div>

                            <div className="mt-12 flex items-center gap-6">
                                <ThemeToggle />
                                <div className="w-px h-8 bg-white/10"></div>
                                <LanguageToggle />
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "absolute top-8 p-2 text-zinc-500 hover:text-white",
                                    isAr ? "left-8" : "right-8"
                                )}
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
