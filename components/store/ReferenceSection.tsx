"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";

interface ReferenceSectionProps {
    title: string;
    description: string;
    image: string;
    products: any[];
    reverse?: boolean;
    dark?: boolean;
}

export function ReferenceSection({
    title,
    description,
    image,
    products,
    reverse = false,
    dark = false
}: ReferenceSectionProps) {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(products.length > 4);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // In RTL, scrollLeft is negative or works differently. 
        // For simplicity with standard CSS scroll, we just check if it's at start/end
        setCanScrollLeft(Math.abs(scrollLeft) > 5);
        setCanScrollRight(Math.ceil(Math.abs(scrollLeft) + clientWidth) < scrollWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollAmount = container.clientWidth;
        
        // Multiplier for RTL
        const multiplier = isAr ? -1 : 1;
        const finalDirection = direction === "left" ? -1 : 1;

        container.scrollBy({
            left: finalDirection * scrollAmount * multiplier,
            behavior: "smooth"
        });
        setTimeout(checkScroll, 350);
    };

    return (
        <section className="py-12" dir={isAr ? "rtl" : "ltr"}>
            <div className={cn(
                "container mx-auto px-4 lg:px-20 overflow-visible flex flex-col min-h-[420px] gap-6",
                reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            )}>
                {/* Left Side: Banner */}
                <div className={cn(
                    "w-full lg:w-[340px] p-10 flex flex-col relative shrink-0 rounded-t-[160px] rounded-b-[4px] overflow-hidden shadow-sm border border-white/10 group transition-all duration-700 hover:shadow-xl",
                    dark ? "bg-black/20 text-white" : "bg-white/5 text-white"
                )}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] bg-repeat mix-blend-multiply"></div>
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

                    <div className={cn("space-y-6 relative z-10 mb-8 mt-12 text-center", isAr ? "lg:text-right" : "lg:text-left")}>
                        <h2 className="text-[28px] font-black uppercase tracking-tight leading-tight font-serif text-white">
                            {title}
                        </h2>
                        <div className={cn("w-12 h-px bg-white/30 mx-auto", isAr ? "lg:mr-0 lg:ml-auto" : "lg:ml-0 lg:mr-auto")}></div>
                        <p className={cn("text-[11px] font-medium leading-relaxed uppercase tracking-widest text-white/60")}>
                            {description}
                        </p>
                        <div className="pt-8">
                            <Link
                                href="/shop"
                                className="inline-block bg-white hover:bg-white/80 text-[#592C2F] px-10 py-4 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl hover:scale-105"
                            >
                                {t('common.explore')}
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Image */}
                    <div className="mt-auto relative h-64 w-full z-10">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* Right Side: Product Carousel */}
                <div className="flex-1 relative group/carousel min-w-0">
                    {/* Left Carousel Button */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#592C2F] flex items-center justify-center shadow-xl border border-white/20 z-20 hover:scale-110 hover:bg-white/80 transition-all hidden lg:flex",
                                isAr ? "right-[-20px]" : "left-[-20px]"
                            )}
                        >
                            <ChevronLeft className={cn("w-5 h-5", isAr ? "ml-0.5" : "mr-0.5")} />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory relative h-full pb-4 items-stretch"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="w-[calc(50%-8px)] lg:w-[calc(25%-12px)] shrink-0 snap-start flex flex-col items-stretch h-full">
                                <ProductCard
                                    product={product}
                                    className="h-full border-none shadow-none rounded-xl overflow-hidden hover:shadow-xl transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Carousel Button */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#592C2F] flex items-center justify-center shadow-xl border border-white/20 z-20 hover:scale-110 hover:bg-white/80 transition-all hidden lg:flex",
                                isAr ? "left-[-20px]" : "right-[-20px]"
                            )}
                        >
                            <ChevronRight className={cn("w-5 h-5", isAr ? "mr-0.5" : "ml-0.5")} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
