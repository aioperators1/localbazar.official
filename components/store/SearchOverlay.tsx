"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts, SearchResult } from "@/lib/actions/search";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const { formatPrice: formatCurrency } = useCurrency();
    const { t, language } = useLanguage();
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard support - Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const TRENDING = [
        t('search.trending.item1'),
        t('search.trending.item2'),
        t('search.trending.item3'),
        t('search.trending.item4'),
        t('search.trending.item5')
    ];

    const SUGGESTED_CATEGORIES = [
        { name: t('search.cat.abayas'), slug: "abayas" },
        { name: t('search.cat.dresses'), slug: "dresses-jalabiyas" },
        { name: t('search.cat.perfumes'), slug: "perfumes-oud" }
    ];

    const isAr = language === 'ar';

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            const timer = setTimeout(() => {
                setQuery("");
                setResults([]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const loadingTimer = setTimeout(() => setLoading(true), 0);
            const searchTimer = setTimeout(async () => {
                const res = await searchProducts(query.trim());
                setResults(res);
                setLoading(false);
            }, 300);
            return () => {
                clearTimeout(loadingTimer);
                clearTimeout(searchTimer);
            };
        } else {
            const timer = setTimeout(() => setResults([]), 0);
            return () => clearTimeout(timer);
        }
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-[#1A0306] bg-opacity-95 backdrop-blur-3xl overflow-y-auto text-white"
                    dir={isAr ? "rtl" : "ltr"}
                >
                    <div className="container mx-auto px-6 lg:px-24 py-12 lg:py-24">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-16 lg:mb-24">
                            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/50">{t('nav.search')}</span>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:rotate-90 transition-transform duration-500 text-white/50 hover:text-white"
                            >
                                <X className="w-8 h-8 stroke-[1]" />
                            </button>
                        </div>

                        {/* Search Input Area */}
                        <div className="relative mb-24 max-w-4xl mx-auto">
                            <div className="flex items-center border-b-[2px] border-white/20 pb-4 group focus-within:border-white transition-all duration-500">
                                <Search className="w-8 h-8 text-white/50 group-focus-within:text-white transition-colors" />
                                <input 
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('search.placeholder')}
                                    className={cn(
                                        "w-full bg-transparent border-none focus:ring-0 text-[18px] sm:text-[24px] lg:text-[42px] font-serif font-light tracking-tight placeholder:text-white/20 text-white uppercase",
                                        isAr ? "mr-6 text-right" : "ml-6 text-left"
                                    )}
                                />
                                {loading && (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="max-w-6xl mx-auto">
                            {!query.trim() ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-32">
                                    {/* Trending */}
                                    <section className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <TrendingUp className="w-4 h-4 text-white/40" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">{t('search.trending')}</h3>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {TRENDING.map((item) => (
                                                <button 
                                                    key={item}
                                                    onClick={() => setQuery(item)}
                                                >
                                                    <span className={cn(
                                                        "flex items-center justify-between group text-[16px] font-medium text-white/60 hover:text-white transition-colors",
                                                        isAr ? "text-right" : "text-left"
                                                    )}>
                                                        {item}
                                                        <ArrowUpRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0", isAr && "rotate-[-90deg]")} />
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Categories */}
                                    <section className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-4 h-4 text-white/40" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">{t('search.collections')}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {SUGGESTED_CATEGORIES.map((cat) => (
                                                <Link 
                                                    key={cat.slug} 
                                                    href={`/shop?category=${cat.slug}`}
                                                    onClick={onClose}
                                                    className="px-6 py-3 border border-white/20 text-[12px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-white transition-all"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Brand Focus */}
                                    <section className="space-y-8 lg:p-10 bg-black/20 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-[1px] bg-white/20" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">{t('search.signature.title')}</h3>
                                        </div>
                                        <p className={cn("text-[14px] text-white/50 italic leading-relaxed", isAr ? "text-right" : "text-left")}>
                                            &quot;{t('search.signature.desc')}&quot;
                                        </p>
                                    </section>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">
                                            {t('search.results')} ({results.length})
                                        </h3>
                                        <Link href={`/shop?search=${encodeURIComponent(query)}`} className="text-[10px] font-bold uppercase tracking-[0.2em] underline text-white hover:text-white/80" onClick={onClose}>
                                            {t('search.viewAll')}
                                        </Link>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                                        {results.map((product) => (
                                                <Link 
                                                    key={product.id} 
                                                    href={`/product/${product.slug}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-6 group hover:bg-black/20 p-2 -m-2 rounded-lg transition-all duration-300"
                                                >
                                                    <div className="w-20 h-24 sm:w-24 sm:h-32 relative bg-white/5 overflow-hidden shrink-0 border border-white/10">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                                                    </div>
                                                    <div className="flex flex-col justify-center gap-1.5 min-w-0">
                                                        <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">{product.category?.name || t('nav.boutique')}</span>
                                                        <h4 className="text-[14px] sm:text-[16px] font-bold uppercase tracking-tight text-white group-hover:text-white/80 transition-colors truncate">{product.name}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[14px] font-black text-white">{formatCurrency(product.price)}</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        {results.length === 0 && !loading && (
                                            <div className="col-span-full py-24 text-center">
                                                <p className="text-[14px] text-white/50 italic">{t('search.noResults')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
