"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

import { Product } from "@/lib/types";

interface ProductCarouselProps {
    products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { 
            loop: true, 
            align: "start", 
            skipSnaps: false,
            direction: isAr ? 'rtl' : 'ltr'
        },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    if (!products.length) return null;

    return (
        <section className={cn("relative group/main py-12", isAr ? "rtl" : "ltr")}>
            <div className="container mx-auto px-4 lg:px-24">
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4 lg:-ml-8">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="pl-4 lg:pl-8 pb-12 min-w-[85%] sm:min-w-[45%] lg:min-w-[33.333%] xl:min-w-[25%] flex-[0_0_auto]"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Controls - Luxury Bottom Alignment */}
                    <div className="flex items-center justify-between mt-12 px-2">
                        {/* Progress Bar/Dashes */}
                        <div className="flex gap-2">
                             {Array.from({ length: Math.min(products.length, 5) }).map((_, i) => (
                                <div key={i} className={cn(
                                    "h-[2px] w-8 transition-all duration-700",
                                    i === 0 ? "bg-white w-16" : "bg-white/20"
                                )} />
                             ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={scrollPrev}
                                className={cn(
                                    "w-12 h-12 lg:w-14 lg:h-14 rounded-full text-white border border-white/20 flex items-center justify-center transition-all duration-500 hover:bg-white hover:text-[#592C2F] group/btn",
                                    !prevBtnEnabled && "opacity-30 cursor-not-allowed"
                                )}
                                disabled={!prevBtnEnabled}
                            >
                                <ChevronLeft className={cn("w-5 h-5 transition-transform group-active/btn:scale-90", isAr && "rotate-180")} />
                            </button>
                            <button
                                onClick={scrollNext}
                                className={cn(
                                    "w-14 h-14 rounded-full text-white border border-white/20 flex items-center justify-center transition-all duration-500 hover:bg-white hover:text-[#592C2F] group/btn",
                                    !nextBtnEnabled && "opacity-30 cursor-not-allowed"
                                )}
                                disabled={!nextBtnEnabled}
                            >
                                <ChevronRight className={cn("w-5 h-5 transition-transform group-active/btn:scale-90", isAr && "rotate-180")} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
