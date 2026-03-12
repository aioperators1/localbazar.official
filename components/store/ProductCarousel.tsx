"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
    title?: string;
    products: any[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", skipSnaps: false },
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
        <section className="relative group/main">
            <div className="container mx-auto px-4 lg:px-24">
                {title && (
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[24px] font-serif text-black uppercase tracking-tight">
                            {title}
                        </h2>
                    </div>
                )}

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="pl-6 pb-4 min-w-[280px] sm:min-w-[320px] md:min-w-[33.33%] lg:min-w-[25%] flex-[0_0_auto]"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Minimalist Floating */}
                    <button
                        onClick={scrollPrev}
                        className={cn(
                            "absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/main:opacity-100 hover:bg-black hover:text-white z-20",
                            !prevBtnEnabled && "hidden"
                        )}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className={cn(
                            "absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/main:opacity-100 hover:bg-black hover:text-white z-20",
                            !nextBtnEnabled && "hidden"
                        )}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
