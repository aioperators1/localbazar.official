"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
    title: string;
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
        <section className="pt-6 pb-2 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--color-brand-blue)] uppercase">
                        {title}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={scrollPrev}
                            className={`p-2 rounded-sm border border-zinc-200 transition-colors ${prevBtnEnabled ? "text-zinc-800 hover:bg-zinc-100" : "text-zinc-300"
                                }`}
                            disabled={!prevBtnEnabled}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className={`p-2 rounded-sm border border-zinc-200 transition-colors ${nextBtnEnabled ? "text-zinc-800 hover:bg-zinc-100" : "text-zinc-300"
                                }`}
                            disabled={!nextBtnEnabled}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="pl-4 pb-4 min-w-[280px] sm:min-w-[300px] md:min-w-[25%] lg:min-w-[20%] flex-[0_0_auto]"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
