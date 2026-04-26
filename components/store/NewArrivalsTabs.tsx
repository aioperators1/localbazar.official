"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";

import { Category, Product } from "@/lib/types";

interface NewArrivalsTabsProps {
    products: Product[];
    categories?: Category[];
}

export function NewArrivalsTabs({ products, categories = [] }: NewArrivalsTabsProps) {
    const { t, language } = useLanguage();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => setMounted(true), []);

    const dynamicTabs = categories.map(c => ({
        label: c.name,
        slug: c.slug
    }));

    const [activeTab, setActiveTab] = useState(dynamicTabs[0]?.slug || "");

    
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
        direction: language === 'ar' ? 'rtl' : 'ltr'
    });

    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            const catSlug = p.category?.slug || p.categoryId;
            return catSlug === activeTab;
        }).slice(0, 10);
    }, [products, activeTab]);

    const scrollNext = () => emblaApi && emblaApi.scrollNext();
    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();

    return (
        <section className={`py-10 sm:py-16 bg-transparent overflow-hidden font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="container mx-auto px-6 lg:px-24 mb-8 lg:mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-6">
                    <div className="space-y-4 max-w-4xl">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 60 }}
                                    className="h-px bg-white/20"
                                />
                                <span className="text-[11px] font-black tracking-[0.5em] text-white/30 uppercase">
                                    {mounted ? t('home.curateSelection') : 'CURATED SELECTION'}
                                </span>
                            </div>
                            <h2 
                                className="font-serif text-[42px] sm:text-[64px] lg:text-[84px] text-white leading-[0.9] font-medium tracking-tighter"
                                style={{ fontFamily: language === 'ar' && mounted ? 'Calibri, Arial, sans-serif' : undefined }}
                            >
                                {mounted ? t('nav.newArrivals').split(' ')[0] : 'NEW'} <br />
                                <span className="italic font-extralight text-white/40 ml-[-2px]">
                                    {mounted ? t('nav.newArrivals').split(' ').slice(1).join(' ') : 'ARRIVALS'}
                                </span>
                            </h2>
                        </div>
                        
                        {/* Categories Tabs - Ultra Minimal */}
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pt-2">
                            {dynamicTabs.map((tab) => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setActiveTab(tab.slug)}
                                    className={cn(
                                        "pb-3 text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap transition-all relative group",
                                        activeTab === tab.slug 
                                            ? "text-white" 
                                            : "text-white/20 hover:text-white/60"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.slug && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 w-full h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-start lg:items-end gap-6 self-start lg:self-auto min-w-[200px]">
                        {filteredProducts.length > 0 && (
                            <div className="hidden lg:flex gap-4">
                                <button
                                    onClick={scrollPrev}
                                    className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/40 transition-all hover:bg-white hover:text-[#592C2F] hover:scale-110 active:scale-95 group/btn"
                                >
                                    <ChevronLeft className={cn("w-6 h-6 transition-transform", language === 'ar' && "rotate-180")} />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/40 transition-all hover:bg-white hover:text-[#592C2F] hover:scale-110 active:scale-95 group/btn"
                                >
                                    <ChevronRight className={cn("w-6 h-6 transition-transform", language === 'ar' && "rotate-180")} />
                                </button>
                            </div>
                        )}

                        <Link href={`/shop?category=${activeTab}`} className="relative group overflow-hidden bg-white text-[#592C2F] px-10 py-5 rounded-[2px] text-[11px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-4 shadow-2xl shadow-black/20">
                            <span className="relative z-10">{t('home.viewCatalogue')}</span>
                            <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-[#f8f8f8] transition-all duration-700 -z-0" />
                            <ChevronRight className={cn("w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1.5", language === 'ar' && "rotate-180 group-hover:-translate-x-1.5")} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-24">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                        className="relative group/carousel"
                    >
                        <div className="overflow-visible" ref={emblaRef}>
                            <div className="flex -ml-6 lg:-ml-10">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="pl-6 lg:pl-10 min-w-[280px] md:min-w-[340px] lg:min-w-[420px] flex-[0_0_auto]"
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="pl-10 lg:pl-16 w-full py-48 text-center rounded-[2px] border border-dashed border-white/5 flex flex-col items-center justify-center bg-black/5">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                                            <ShoppingBag className="w-8 h-8 text-white/10" />
                                        </div>
                                        <p className="text-white/40 font-serif italic text-[24px] tracking-tight">{t('common.loading')}</p>
                                        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em] mt-3">{activeTab.replace(/-/g, ' ').toUpperCase()}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {filteredProducts.length > 0 && (
                            <div className="flex lg:hidden justify-center gap-6 mt-6 scale-90">
                                <button
                                    onClick={scrollPrev}
                                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/60 transition-all hover:bg-white hover:text-[#592C2F]"
                                >
                                    <ChevronLeft className={cn("w-6 h-6", language === 'ar' && "rotate-180")} />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/60 transition-all hover:bg-white hover:text-[#592C2F]"
                                >
                                    <ChevronRight className={cn("w-6 h-6", language === 'ar' && "rotate-180")} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
