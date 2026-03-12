"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NewArrivalsTabsProps {
    products: any[];
    categories?: any[];
}

const TABS = [
    { label: "Abayas", slug: "abayas" },
    { label: "Dresses & Jalabiyas", slug: "dresses-jalabiyas" },
    { label: "Men", slug: "men" },
    { label: "Perfumes & Oud", slug: "perfumes-oud" },
    { label: "Kids", slug: "kids" },
    { label: "Jewelry", slug: "jewelry" },
    { label: "Accessories", slug: "accessories" },
];

export function NewArrivalsTabs({ products, categories = [] }: NewArrivalsTabsProps) {
    const dynamicTabs = categories.length > 0 ? categories.slice(0, 6).map(c => ({
        label: c.name,
        slug: c.slug
    })) : [
        { label: "Abayas", slug: "abayas" },
        { label: "Dresses & Jalabiyas", slug: "dresses-jalabiyas" },
        { label: "Men", slug: "men" },
        { label: "Perfumes & Oud", slug: "perfumes-oud" },
        { label: "Kids", slug: "kids" }
    ];

    const [activeTab, setActiveTab] = useState(dynamicTabs[0].slug);
    
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true
    });

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const catSlug = p.category?.slug || p.categoryId;
            return catSlug === activeTab;
        }).slice(0, 10);
    }, [products, activeTab]);

    const scrollNext = () => emblaApi && emblaApi.scrollNext();
    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-24 mb-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-100 pb-8">
                    <div>
                        <h2 className="font-serif text-[42px] text-[#111] leading-tight font-medium mb-4">New Arrivals</h2>
                        
                        {/* Categories Tabs - Scrollable on mobile */}
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {dynamicTabs.map((tab) => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setActiveTab(tab.slug)}
                                    className={cn(
                                        "pb-2 text-[14px] font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-all relative",
                                        activeTab === tab.slug 
                                            ? "text-[#111]" 
                                            : "text-zinc-400 hover:text-zinc-600"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.slug && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black animate-in fade-in slide-in-from-left duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <Link href={`/shop?category=${activeTab}`} className="group flex items-center gap-2 text-[13px] font-black text-[#111] hover:text-black transition-all uppercase tracking-widest">
                        See all products
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-24">
                <div className="relative group/carousel">
                    <div className="overflow-visible" ref={emblaRef}>
                        <div className="flex -ml-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="pl-6 min-w-[280px] md:min-w-[320px] lg:min-w-[350px] flex-[0_0_auto]"
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="pl-6 w-full py-20 text-center">
                                    <p className="text-zinc-400 font-serif italic text-[18px]">Coming Soon to this collection...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {filteredProducts.length > 0 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                className="absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-black hover:text-white z-20 border border-zinc-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={scrollNext}
                                className="absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-black hover:text-white z-20 border border-zinc-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
