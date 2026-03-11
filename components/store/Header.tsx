"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, User, Phone, MapPin, ChevronDown, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
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
    const searchRef = useRef<HTMLFormElement>(null);

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
        <header className="w-full z-50 bg-white" dir={isAr ? "rtl" : "ltr"}>
            {/* 1. Top Bar */}
            <div className="bg-[#111111] py-2.5 hidden lg:block">
                <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-medium text-white/60 tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-8">
                        <span>L'Excellence du Luxe & de l'Héritage</span>
                        <div className="w-px h-3 bg-white/10" />
                        <span>EST. 2013 — QATAR</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-brand-burgundy" />
                            <span>{settings?.site_phone || "+974 5055 8884"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Header */}
            <div className="bg-white border-b py-6">
                <div className="container mx-auto px-4 flex items-center justify-between gap-10">
                    {/* Logo: LOCAL BAZAR SVG */}
                    <Link href="/" className="flex items-center flex-shrink-0 group py-2">
                        <div className="relative w-[200px] h-[50px]">
                            <Image 
                                src="/logo.svg" 
                                alt="Local Bazar Logo" 
                                fill 
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <form ref={searchRef} onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-[450px] relative h-10 z-[100]">
                        <div className="flex w-full h-full overflow-hidden relative z-50 border-b border-zinc-200 focus-within:border-brand-burgundy transition-all duration-500">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="QUÊTE DE L'EXCELLENCE..."
                                className="w-full h-full px-0 text-zinc-900 focus:outline-none text-[10px] font-black tracking-[0.3em] placeholder:text-zinc-300 border-0 bg-transparent uppercase"
                            />
                            <button type="submit" className="h-full bg-transparent px-2 hover:text-brand-burgundy transition-colors flex items-center justify-center">
                                <Search className="w-4 h-4 text-[#111111]" />
                            </button>
                        </div>

                        {/* Dropdown styling for fashion */}
                        {isSearchFocused && searchQuery.trim().length > 1 && (
                            <div className="absolute top-[calc(100%+1px)] left-0 right-0 bg-white border border-zinc-100 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-300">
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
                                                        <Image src={image} alt={product.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-[12px] uppercase tracking-wider font-medium text-[#111111]">
                                                            {highlightText(product.name, searchQuery)}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-brand-burgundy mt-1">
                                                            {Number(product.price).toLocaleString()}.00 dh
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="p-8 text-center text-[11px] text-zinc-400 font-medium tracking-widest uppercase">
                                            Aucun résultat trouvé
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-10 text-[#111111]">
                        <Link href="/login" className="hidden lg:flex items-center gap-3 group">
                            <User className="w-5 h-5 group-hover:text-brand-burgundy transition-all duration-300" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em]">Compte</span>
                        </Link>

                        {/* Cart */}
                        <div className="group relative">
                            <Link href="/cart" className="flex items-center gap-3 py-4">
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5 group-hover:text-brand-burgundy transition-all duration-300" />
                                    <span className="absolute -top-2 -right-2 bg-brand-burgundy text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {itemCount}
                                    </span>
                                </div>
                                <span className="text-[11px] font-medium uppercase tracking-[0.15em] hidden sm:block">Panier</span>
                            </Link>

                            {/* Luxury Cart Dropdown */}
                            <div className="absolute top-full right-0 w-[400px] bg-white border border-zinc-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 z-50 p-6 transform translate-y-2 group-hover:translate-y-0">
                                {itemCount > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                                            {items.map((item, idx) => (
                                                <div key={`${item.id}-${idx}`} className="flex gap-4 py-4 border-b border-zinc-50 last:border-0">
                                                    <div className="w-16 h-20 relative bg-[#f9f9f9] shrink-0">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider line-clamp-1">{item.name}</span>
                                                        {(item.size || item.color) && (
                                                            <div className="flex gap-2 mt-1">
                                                                {item.size && <span className="text-[9px] text-zinc-400 uppercase tracking-widest border border-zinc-100 px-1.5 py-0.5">Taille: {item.size}</span>}
                                                                {item.color && <span className="text-[9px] text-zinc-400 uppercase tracking-widest border border-zinc-100 px-1.5 py-0.5">Couleur: {item.color}</span>}
                                                            </div>
                                                        )}
                                                        <span className="text-[10px] text-zinc-500 mt-2 font-medium uppercase tracking-widest">{item.quantity} x {Number(item.price).toLocaleString()} dh</span>
                                                        <button 
                                                            onClick={() => removeItem(item.id, item.size, item.color)} 
                                                            className="text-[9px] text-brand-burgundy uppercase tracking-widest font-bold mt-2 text-left hover:underline"
                                                        >
                                                            Retirer
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-zinc-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
                                                <span className="text-[14px] font-black">{totalPrice().toLocaleString()}.00 dh</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Link href="/cart" className="w-full border border-[#111111] text-[#111111] text-center font-bold text-[10px] py-4 uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all">Panier</Link>
                                                <Link href="/checkout" className="w-full bg-[#111111] text-white text-center font-bold text-[10px] py-4 uppercase tracking-widest hover:bg-brand-burgundy transition-all">Commander</Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-[11px] text-zinc-400 uppercase tracking-widest">Le panier est vide</div>
                                )}
                            </div>
                        </div>

                        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Bar */}
            <div className="bg-white border-b hidden lg:block overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-4 flex items-center justify-center">
                    <nav className="flex items-center">
                        <Link href="/shop" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-brand-burgundy transition-colors">Tout Voir</Link>
                        <Link href="/shop?category=evening-wear" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-brand-burgundy transition-colors">Couture</Link>
                        <Link href="/shop?category=suits" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-brand-burgundy transition-colors">Tailleur</Link>
                        <Link href="/shop?category=traditional" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-brand-burgundy transition-colors">Héritage</Link>
                        <Link href="/shop?category=accessories" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-brand-burgundy transition-colors">Accessoires</Link>
                        <Link href="/shop?category=new-arrivals" className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-burgundy transition-colors">Nouveautés</Link>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white z-[200] p-10 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom duration-500">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10"><X className="w-8 h-8" /></button>
                    <nav className="flex flex-col gap-8 text-center">
                        <Link href="/shop" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Tout Voir</Link>
                        <Link href="/shop?category=evening-wear" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Couture</Link>
                        <Link href="/shop?category=suits" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Tailleur</Link>
                        <Link href="/shop?category=traditional" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Héritage</Link>
                        <Link href="/shop?category=accessories" className="text-[18px] font-black uppercase tracking-[0.3em]" onClick={() => setIsMenuOpen(false)}>Accessoires</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
