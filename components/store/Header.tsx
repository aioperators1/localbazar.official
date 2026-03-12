"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ShoppingBag, Heart, Search, Menu, X, User, Phone, MapPin, ChevronDown, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product";

// ── Brand Palette ──────────────────────────────────────────────
const BRAND = "var(--color-brand-black)"; // Local Bazar Black
const ACCENT = "var(--color-brand-burgundy)"; // Local Bazar Burgundy
const DANGER = "#e83348";

const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span className="text-[14px] text-zinc-600 font-medium tracking-normal lowercase first-letter:uppercase">
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ?
                    <strong key={i} className="text-brand-burgundy font-bold leading-tight inline-block">{part}</strong> :
                    part
            )}
        </span>
    );
};

export function Header({ settings }: { settings?: Record<string, string> }) {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems, items, removeItem, addItem, decreaseItem, totalPrice } = useCart();
    const [mounted, setMounted] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === "ar";
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchFocused(false);
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const timeoutId = setTimeout(() => {
                getAllProducts(undefined, searchQuery).then(res => {
                    setSearchResults(res.slice(0, 5));
                });
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const itemCount = mounted ? totalItems() : 0;

    if (pathname.startsWith("/admin")) return null;

    return (
        <header 
            className={cn(
                "w-full z-[100] transition-all duration-500",
                scrolled ? "fixed top-0 left-0 bg-white/90 backdrop-blur-xl shadow-sm" : "relative bg-white"
            )} 
            dir={isAr ? "rtl" : "ltr"}
        >
            {/* 1. Top Bar */}
            <div className="bg-[#181818] py-2.5 hidden lg:block">
                <div className="container mx-auto px-6 flex justify-between items-center text-[11px] text-white/90 tracking-wider">
                    <div className="flex items-center font-medium">
                        <span>Enduring Grace for Every Moment</span>
                    </div>
                    <div className="flex items-center gap-7 font-bold">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                            <span>English</span>
                            <ChevronDown className="w-3 h-3 text-white/50" />
                        </div>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                            <span>USD - US Dollar</span>
                            <ChevronDown className="w-3 h-3 text-white/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header Container */}
            <div className={cn(
                "relative transition-all duration-700 ease-in-out border-b border-zinc-100",
                scrolled ? "py-2 shadow-2xl bg-white/80 backdrop-blur-3xl" : "py-6 bg-white"
            )}>
                <div className="container mx-auto px-8 flex items-center justify-between">
                    
                    {/* LEFT: MINIMAL NAV / SIDEBAR TOGGLE */}
                    <div className="flex items-center gap-8 flex-1">
                        <button 
                            className="group flex flex-col gap-1.5 focus:outline-none"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="w-8 h-[1px] bg-black group-hover:w-10 transition-all duration-500" />
                            <div className="w-5 h-[1px] bg-black group-hover:w-10 transition-all duration-500" />
                        </button>
                        
                        <div className="hidden lg:flex items-center gap-6">
                            <Link href="/shop" className="text-[10px] font-black tracking-[0.3em] uppercase hover:text-brand-burgundy transition-all">Archivage</Link>
                            <div className="w-px h-3 bg-zinc-200" />
                            <Link href="/shop?category=new-arrivals" className="text-[10px] font-black tracking-[0.3em] uppercase hover:text-brand-burgundy transition-all">Éditions</Link>
                        </div>
                    </div>

                    {/* CENTER: SPLIT LOGO BRANDING */}
                    <div className="flex flex-col items-center">
                        <Link href="/" className="group relative">
                            <div className="flex items-center gap-4">
                                <span className="text-[26px] font-serif font-light tracking-[-0.02em] text-black transition-all group-hover:tracking-[0.15em] duration-700">LOCAL</span>
                                <div className="w-[1px] h-7 bg-zinc-200 rotate-[20deg] transition-transform duration-700 group-hover:rotate-[45deg]" />
                                <span className="text-[26px] font-serif font-bold tracking-[-0.02em] text-brand-burgundy transition-all group-hover:tracking-[0.15em] duration-700">BAZAR</span>
                            </div>
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-burgundy group-hover:w-full transition-all duration-700" />
                        </Link>
                    </div>

                    {/* RIGHT: SEARCH + ACTIONS */}
                    <div className="flex items-center justify-end gap-1.5 lg:gap-6 flex-1">
                        {/* Search Expandable */}
                        <div className="relative group/search hidden sm:block">
                            <form ref={searchRef} onSubmit={handleSearch} className="flex items-center bg-zinc-50 rounded-full px-4 py-2 border border-transparent focus-within:border-zinc-200 focus-within:bg-white transition-all duration-500">
                                <Search className="w-4 h-4 text-zinc-400" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    placeholder="EXPLORER..."
                                    className="w-0 group-hover/search:w-32 focus:w-32 transition-all duration-700 bg-transparent text-[10px] font-bold tracking-widest placeholder:text-zinc-300 focus:outline-none ml-2"
                                />
                            </form>

                            {/* Dropdown styling */}
                            {isSearchFocused && searchQuery.trim().length > 1 && (
                                <div className="absolute top-[calc(100%+15px)] right-0 w-[400px] bg-white border border-zinc-100 shadow-2xl z-[150] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            searchResults.map(product => {
                                                const image = (() => {
                                                    try {
                                                        const parsed = JSON.parse(product.images);
                                                        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : (product.images || '/placeholder.png');
                                                    } catch (e) {
                                                        return product.images || '/placeholder.png';
                                                    }
                                                })();
                                                return (
                                                    <Link key={product.id} href={`/product/${product.slug || product.id}`} className="flex items-center gap-6 p-5 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0" onClick={() => setIsSearchFocused(false)}>
                                                        <div className="w-16 h-20 bg-[#f9f9f9] relative shrink-0">
                                                            <Image src={image} alt={product.name} fill className="object-cover" unoptimized />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            <span className="text-[12px] uppercase tracking-wider font-medium text-[#111111]">
                                                                {highlightText(product.name, searchQuery)}
                                                            </span>
                                                            <span className="text-[11px] font-bold text-brand-burgundy mt-1">
                                                                {Number(product.price).toLocaleString()}.00 QAR
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <div className="p-8 text-center text-[11px] text-zinc-400 font-medium tracking-widest uppercase">
                                                No results found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/wishlist" className="relative p-2 group overflow-hidden">
                            <Heart className="w-[22px] h-[22px] stroke-[1] text-zinc-400 group-hover:text-brand-burgundy transition-colors duration-500" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-brand-burgundy rounded-full scale-0 group-hover:scale-100 transition-transform" />
                        </Link>

                        <div className="group relative h-10 flex items-center">
                            <Link href="/cart" className="relative p-2 group/bag">
                                <ShoppingBag className="w-[22px] h-[22px] stroke-[1] text-zinc-400 group-hover:text-black transition-colors duration-500" />
                                <span className="absolute -top-[1px] -right-[1px] bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            </Link>

                            {/* Luxury Cart Dropdown */}
                            <div className="absolute top-full right-0 w-[400px] bg-white border border-zinc-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 z-50 p-6 transform translate-y-2 group-hover:translate-y-0">
                                {itemCount > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                                            {items.map((item, idx) => (
                                                <div key={`${item.id}-${idx}`} className="flex gap-4 py-4 border-b border-zinc-50 last:border-0">
                                                    <div className="w-16 h-20 relative bg-[#f9f9f9] shrink-0">
                                                        <Image 
                                                            src={item.image || "https://images.unsplash.com/photo-1560362614-893c131f2421?q=80&w=400"} 
                                                            alt={item.name} 
                                                            fill 
                                                            className="object-cover" 
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider line-clamp-1">{item.name}</span>
                                                        {(item.size || item.color) && (
                                                            <div className="flex gap-2 mt-1">
                                                                {item.size && <span className="text-[9px] text-zinc-400 uppercase tracking-widest border border-zinc-100 px-1.5 py-0.5">Size: {item.size}</span>}
                                                                {item.color && <span className="text-[9px] text-zinc-400 uppercase tracking-widest border border-zinc-100 px-1.5 py-0.5">Color: {item.color}</span>}
                                                            </div>
                                                        )}
                                                        <span className="text-[10px] text-zinc-500 mt-2 font-medium uppercase tracking-widest">{item.quantity} x {Number(item.price).toLocaleString()} QAR</span>
                                                        <button 
                                                            onClick={() => removeItem(item.id, item.size, item.color)} 
                                                            className="text-[9px] text-brand-burgundy uppercase tracking-widest font-bold mt-2 text-left hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-zinc-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
                                                <span className="text-[14px] font-black">{totalPrice().toLocaleString()}.00 QAR</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Link href="/cart" className="w-full border border-[#111111] text-[#111111] text-center font-bold text-[10px] py-4 uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all">View Cart</Link>
                                                <Link href="/checkout" className="w-full bg-[#111111] text-white text-center font-bold text-[10px] py-4 uppercase tracking-widest hover:bg-brand-burgundy transition-all">Checkout</Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-[11px] text-zinc-400 uppercase tracking-widest">Your cart is empty</div>
                                )}
                            </div>
                        </div>

                        <Link href="/login" className="p-2 group">
                            <User className="w-[22px] h-[22px] stroke-[1] text-zinc-400 group-hover:text-black transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* SIDE NAVIGATION DRAWER (Original Feature) */}
            <div className={cn(
                "fixed inset-0 z-[200] transition-all duration-700 pointer-events-none",
                isMenuOpen ? "opacity-100" : "opacity-0 invisible"
            )}>
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" 
                    onClick={() => setIsMenuOpen(false)} 
                />
                <div className={cn(
                    "absolute top-0 left-0 w-full lg:w-[450px] h-full bg-white shadow-2xl p-12 flex flex-col transition-transform duration-700 ease-in-out pointer-events-auto",
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="self-end p-4 hover:rotate-90 transition-transform duration-500"
                    >
                        <X className="w-8 h-8 stroke-[1]" />
                    </button>
                    
                    <div className="mt-12 flex flex-col gap-6 px-4 overflow-y-auto no-scrollbar pb-10">
                        <Link href="/shop" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">All Collections</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>
                        
                        <Link href="/shop?category=abayas" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Abayas</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>

                        <Link href="/shop?category=dresses-jalabiyas" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Dresses & Jalabiyas</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>

                        <Link href="/shop?category=men" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Men</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>

                        <Link href="/shop?category=perfumes-oud" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Perfumes & Oud</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>

                        <Link href="/shop?category=jewelry" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Jewelry</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>

                        <Link href="/shop?category=accessories" className="group flex items-center justify-between py-2 border-b border-zinc-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="text-[32px] font-bold transition-all duration-700 group-hover:pl-4 group-hover:text-brand-burgundy uppercase">Accessories</span>
                            </div>
                            <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </Link>
                    </div>

                    <div className="mt-auto p-8 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase mb-6">Concierge & Hub</p>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">24/7 SUPPORT</span>
                                <span className="text-[15px] font-medium tracking-tight group-hover:text-brand-burgundy transition-colors">+974 5055 8884</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">LOCATION</span>
                                <span className="text-[15px] font-medium tracking-tight">QATAR — DOHA HUB CENTRAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Bar (Hidden to match Bianca Nera style) */}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white z-[200] p-10 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom duration-500">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10"><X className="w-8 h-8" /></button>
                    <nav className="flex flex-col gap-8 text-center">
                        <Link href="/shop" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                        <Link href="/shop?category=abayas" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Abayas</Link>
                        <Link href="/shop?category=dresses-jalabiyas" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Dresses</Link>
                        <Link href="/shop?category=men" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Men</Link>
                        <Link href="/shop?category=perfumes-oud" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Perfumes</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
