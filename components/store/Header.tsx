"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Heart, Search, X, ChevronDown, Instagram, Twitter, Phone, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { Branding } from "./Branding";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdminSetting, AppSession, Category } from "@/lib/types";

export function Header({ settings, categories = [] }: { settings?: AdminSetting, categories?: Category[] }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { data: sessionData } = useSession();
    const session = sessionData as unknown as AppSession | null;
    const { totalItems, items: cartItems, totalPrice } = useCart();
    const { items: wishlistItems } = useWishlist();
    const [mounted, setMounted] = useState(false);
    const { t, language, setLanguage } = useLanguage();
    const { currency, setCurrency, formatPrice: formatCurrency } = useCurrency();
    const isAr = language === "ar";
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const itemCount = mounted ? totalItems() : 0;
    const wishlistCount = mounted ? wishlistItems.length : 0;

    if (pathname.startsWith("/admin")) return null;

    // Show all categories from database
    const displayCategories = categories;

    return (
        <header
            className={cn(
                "w-full z-[100] transition-all duration-500",
                scrolled 
                    ? "fixed top-0 left-0 bg-[#20080B]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
                    : (isHome ? "absolute top-0 left-0 bg-transparent" : "relative bg-[#20080B] border-b border-white/5")
            )}
            dir={isAr ? "rtl" : "ltr"}
        >
            {/* 1. Ultra-Minimal Top Bar: Precision Engineering */}
            <div className={cn(
                "bg-[#1A0306] py-2 lg:py-2.5 overflow-hidden border-b border-white/[0.03] transition-all duration-500",
                isHome && !scrolled && "bg-transparent border-transparent"
            )}>
                <div className="container mx-auto px-4 lg:px-12 flex justify-center sm:justify-between items-center">
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.45em] text-white/50 uppercase">
                            <span className="w-[3px] h-[3px] bg-brand-burgundy rounded-full" />
                            {t('header.tagline')}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        {/* Heritage Selectors with Refined Dropdowns */}
                        <div className="flex items-center gap-6 lg:gap-10 w-full sm:w-auto justify-center sm:justify-end">
                            {[
                                { id: 'lang', label: mounted ? (language === 'en' ? 'EN' : language === 'fr' ? 'FR' : 'AR') : '...', icon: ChevronDown },
                                { id: 'curr', label: mounted ? currency : '...', icon: ChevronDown }
                            ].map((item: any) => (
                                <DropdownMenu key={item.id}>
                                    <DropdownMenuTrigger className="text-[11px] font-black tracking-[0.3em] text-white/40 hover:text-white uppercase flex items-center gap-2 outline-none group">
                                        {item.label}
                                        <item.icon className="w-2.5 h-2.5 opacity-20 group-hover:opacity-100" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#20080B] border-white/5 rounded-none min-w-[140px] p-0 shadow-2xl z-[250]">
                                        {item.id === 'lang' ? (
                                            <>
                                                <DropdownMenuItem onClick={() => setLanguage("en")} className="text-[9px] font-black uppercase tracking-widest text-white/60 focus:bg-white/5 focus:text-white p-4 border-b border-white/5 cursor-pointer">English (UK)</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setLanguage("fr")} className="text-[9px] font-black uppercase tracking-widest text-white/60 focus:bg-white/5 focus:text-white p-4 border-b border-white/5 cursor-pointer">Français (FR)</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setLanguage("ar")} className="text-[9px] font-black uppercase tracking-widest text-white/60 focus:bg-white/5 focus:text-white p-4 font-sans text-right cursor-pointer">العربية (QA)</DropdownMenuItem>
                                            </>
                                        ) : (
                                            ['QAR', 'USD', 'EUR', 'GBP'].map((curr: string) => (
                                                <DropdownMenuItem 
                                                    key={curr} 
                                                    onClick={() => setCurrency(curr as any)} 
                                                    className="text-[9px] font-black uppercase tracking-widest text-white/60 focus:bg-white/5 focus:text-white p-4 border-b border-white/5 last:border-0 cursor-pointer"
                                                >
                                                    {curr} • {curr === 'QAR' ? 'RIAL' : curr === 'USD' ? 'DOLLAR' : curr === 'EUR' ? 'EURO' : 'POUND'}
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Luxury Nav: The Core Experience */}
            <div className={cn(
                "relative transition-all duration-500",
                scrolled ? "py-3" : "py-4 lg:py-8",
                isHome && !scrolled && "border-white/10"
            )}>
                <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between relative min-h-[50px]">

                    {/* Left: Discovery & Archives */}
                    <div className="flex items-center gap-6 xl:gap-12 flex-1">
                        <button
                            className="group flex flex-col gap-2 focus:outline-none relative h-10 justify-center"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <div className="w-7 h-[1px] lg:w-7 lg:h-[1.5px] rounded-full transition-colors bg-white" />
                                    <div className="w-4 h-[1px] lg:w-4 lg:h-[1.5px] rounded-full transition-colors bg-white" />
                                </div>
                                <span className={cn(
                                    "text-[11px] font-black uppercase tracking-[0.3em] hidden xl:block overflow-hidden whitespace-nowrap transition-colors text-white",
                                    isAr ? "mr-4" : "ml-4"
                                )}>
                                    {t('nav.boutique')}
                                </span>
                            </div>
                        </button>

                        <nav className="hidden xl:flex items-center gap-10">
                            {[
                                { name: t('nav.archive'), href: '/shop' },
                                { name: t('nav.editions'), href: '/shop?category=new-arrivals' }
                            ].map((link: {name: string, href: string}, idx: number) => (
                                <div key={idx} className="flex items-center gap-10">
                                    <Link href={link.href} className="group relative py-2">
                                        <span className={cn(
                                            "text-[10px] font-black tracking-[0.4em] uppercase transition-colors text-white/60 hover:text-white"
                                        )}>
                                            {link.name}
                                        </span>
                                    </Link>
                                    {idx === 0 && <div className="w-[1px] h-3 bg-white/20" />}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Center: The Royal Seal - Absolutely centered on all screens */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0 z-10 w-auto">
                        <Branding size={scrolled ? "sm" : "md"} variant="luxury" light={true} />
                    </div>

                    {/* Right: Actions & Vault */}
                    <div className="flex items-center justify-end gap-3 lg:gap-8 flex-1">
                        <div className="hidden md:flex items-center gap-6 xl:gap-10">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="group flex items-center gap-4"
                            >
                                <span className="text-[9px] font-black tracking-[0.4em] uppercase transition-colors text-white/40 group-hover:text-white hidden xl:block">PRODUCT REGISTRY</span>
                                <Search className="w-[18px] h-[18px] stroke-[1.2] transition-colors text-white/40 group-hover:text-white" />
                            </button>

                            <button
                                onClick={() => setIsWishlistOpen(true)}
                                className="relative group p-1"
                            >
                                <Heart className="w-[19px] h-[19px] stroke-[1.2] transition-colors text-white/40 group-hover:text-brand-burgundy" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[7px] font-black w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none border border-white/20">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="h-6 w-px bg-white/10 hidden md:block mx-1 xl:mx-2" />

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group flex items-center gap-5 focus:outline-none py-2"
                        >
                            <div className="flex flex-col items-end hidden lg:flex pointer-events-none">
                                <span className="text-[10px] font-black tracking-[0.25em] uppercase leading-none mb-1 text-white/40">{t('nav.cart')}</span>
                                <span className="text-[13px] font-black tracking-tighter leading-tight text-white">{mounted ? formatCurrency(totalPrice()) : '—'}</span>
                            </div>
                            <div className="relative p-1">
                                <ShoppingBag className="w-[22px] h-[22px] stroke-[1.1] text-white group-hover:text-brand-burgundy" />
                                <span className="absolute -top-1.5 -right-1.5 bg-[#111] text-white text-[7px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none shadow-sm border border-white/20">
                                    {itemCount}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>


               {/* SIDE NAVIGATION DRAWER (Ultra Pro x9999) */}
            <div className={cn(
                "fixed inset-0 z-[1000] pointer-events-none",
                isMenuOpen ? "opacity-100" : "opacity-0 invisible"
            )}>
                {/* Backdrop with sophisticated blur */}
                <div
                    className="absolute inset-0 bg-[#000]/40 backdrop-blur-md pointer-events-auto"
                    onClick={() => setIsMenuOpen(false)}
                />

                <div className={cn(
                    "absolute top-0 w-full lg:w-[480px] h-[100dvh] bg-[#1A050A] text-white shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col pointer-events-auto",
                    language === 'ar' ? "right-0" : "left-0",
                    isMenuOpen 
                        ? (language === 'ar' ? "translate-x-0" : "translate-x-0") 
                        : (language === 'ar' ? "translate-x-full" : "-translate-x-full")
                )}>
                    {/* Drawer Header: Boutique Info */}
                    <div className={cn("p-8 lg:p-14 flex justify-between items-start", isAr && "flex-row-reverse")}>
                        <div className={cn("flex flex-col gap-6", isAr ? "items-end" : "items-start")}>
                            <Branding variant="luxury" light align={isAr ? "right" : "left"} size="sm" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black tracking-[0.5em] text-white/20 uppercase">{t('nav.est')}</span>
                                <div className="w-10 h-px bg-brand-burgundy/40" />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-4 border border-white/5 rounded-full hover:bg-white hover:text-black group"
                        >
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Discovery Sections */}
                    <div className="flex-1 px-8 lg:px-14 overflow-y-auto no-scrollbar space-y-16 pb-12">
                        {/* 1. Brand Essence */}
                        <div className="space-y-6">
                            <span className={cn("text-[9px] font-black tracking-[0.5em] text-white/20 uppercase block", isAr && "text-right")}>
                                {t('nav.boutique')}
                            </span>
                            <p className={cn("text-[14px] lg:text-[15px] text-white/50 leading-[2] font-medium uppercase tracking-[0.1em] max-w-sm", isAr && "text-right")}>
                                {settings?.aboutText || t('footer.about')}
                            </p>
                            <div className={cn("flex gap-8 pt-4", isAr && "flex-row-reverse")}>
                                <SocialIcon icon={Instagram} href="#" />
                                <SocialIcon icon={Twitter} href="#" />
                                <SocialIcon icon={Phone} href="#" />
                            </div>
                        </div>

                        {/* 2. Primary Navigation */}
                        <div className="space-y-6">
                            <span className={cn("text-[9px] font-black tracking-[0.5em] text-white/20 uppercase block", isAr && "text-right")}>
                                {t('nav.collections')}
                            </span>
                            <div className="flex flex-col gap-6">
                                {displayCategories.map((cat: Category, idx: number) => (
                                    <Link 
                                        key={cat.id} 
                                        href={`/shop?category=${cat.slug}`} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "group flex items-center gap-4",
                                            isAr && "flex-row-reverse"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-[28px] lg:text-[34px] font-serif font-light text-white/80 group-hover:text-white tracking-tight uppercase transition-all duration-500",
                                            isAr ? "text-right font-sans font-black" : "text-left"
                                        )}>
                                            {isAr && cat.nameAr ? cat.nameAr : cat.name}
                                        </span>
                                    </Link>
                                ))}
                                <Link 
                                    href="/shop?category=new-arrivals" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-4",
                                        isAr && "flex-row-reverse"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[28px] lg:text-[34px] font-serif font-light text-white/80 group-hover:text-white tracking-tight uppercase",
                                        isAr ? "text-right font-sans font-black" : "text-left"
                                    )}>
                                        {t('nav.newArrivals')}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-brand-burgundy" />
                                </Link>
                            </div>
                        </div>

                        {/* 3. Concierge & Company */}
                        <div className="space-y-8 pt-8 border-t border-white/5">
                            <span className={cn("text-[9px] font-black tracking-[0.5em] text-white/20 uppercase block", isAr && "text-right")}>
                                {t('footer.company')}
                            </span>
                            <div className="grid grid-cols-1 gap-5">
                                <MobileLinkSecondary href="/about" onClick={() => setIsMenuOpen(false)}>{t('nav.ourStory')}</MobileLinkSecondary>
                                <MobileLinkSecondary href="/contact" onClick={() => setIsMenuOpen(false)}>{t('nav.contactConcierge')}</MobileLinkSecondary>
                                <MobileLinkSecondary href="/shipping" onClick={() => setIsMenuOpen(false)}>{t('nav.shippingPolicy')}</MobileLinkSecondary>
                                {session?.user?.role === "ADMIN" && (
                                    <MobileLinkSecondary href="/admin" onClick={() => setIsMenuOpen(false)} className="text-brand-burgundy font-black">{t('nav.adminDashboard')}</MobileLinkSecondary>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Drawer Footer: The Mark of Quality */}
                    <div className="p-10 lg:p-14 border-t border-white/5 bg-white/[0.02]">
                        <div className={cn("flex flex-col gap-4", isAr && "items-end")}>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">Local Bazar Hub</span>
                                <div className="w-6 h-[1px] bg-white/10" />
                                <span className="text-[10px] font-medium tracking-[0.2em] text-white/20 uppercase">&copy; {new Date().getFullYear()}</span>
                            </div>
                            <p className="text-[9px] font-medium tracking-[0.3em] text-white/10 uppercase leading-relaxed">
                                {t('footer.crafted')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Bar (Hidden to match Bianca Nera style) */}

            {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </header>
    );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-[24px] font-serif font-medium tracking-tight text-white/90 hover:text-white block uppercase"
        >
            {children}
        </Link>
    );
}

function MobileLinkSecondary({ href, onClick, children, className }: { href: string; onClick: () => void; children: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "text-[12px] font-bold tracking-[0.3em] text-white/40 hover:text-white uppercase block",
                className
            )}
        >
            {children}
        </Link>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: LucideIcon; href: string }) {
    return (
        <a href={href} className="text-white/30 hover:text-white">
            <Icon className="w-5 h-5" strokeWidth={1.5} />
        </a>
    );
}
