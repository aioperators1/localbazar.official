"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(products.length > 4);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
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
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
        setTimeout(checkScroll, 350); // Re-check after animation
    };

    return (
        <section className="py-12">
            <div className={cn(
                "container mx-auto px-4 lg:px-20 overflow-visible flex flex-col min-h-[420px] gap-6",
                reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            )}>
                {/* Left Side: Banner */}
                <div className={cn(
                    "w-full lg:w-[340px] p-10 flex flex-col relative shrink-0 rounded-t-[160px] rounded-b-[4px] overflow-hidden shadow-sm border border-zinc-100 group transition-all duration-700 hover:shadow-xl",
                    dark ? "bg-[#111111] text-white" : "bg-white text-[#111111]"
                )}>
                    {/* Background Pattern (Simulation of brand motifs) */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] bg-repeat mix-blend-multiply"></div>
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

                    <div className="space-y-6 relative z-10 mb-8 mt-12 text-center lg:text-left">
                        <h2 className="text-[28px] font-black uppercase tracking-tight leading-tight font-serif">
                            {title}
                        </h2>
                        <div className="w-12 h-px bg-brand-burgundy mx-auto lg:mx-0"></div>
                        <p className={cn("text-[11px] font-medium leading-relaxed uppercase tracking-widest", dark ? "text-zinc-400" : "text-zinc-500")}>
                            {description}
                        </p>
                        <div className="pt-8">
                            <Link
                                href="/shop"
                                className="inline-block bg-[#111111] hover:bg-brand-burgundy text-white px-10 py-4 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl hover:scale-105"
                            >
                                Explorer
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
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-xl border border-zinc-100 z-20 hover:scale-110 hover:bg-[#111111] hover:text-white transition-all hidden lg:flex"
                        >
                            <ChevronLeft className="w-5 h-5 mr-0.5" />
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
                                    className="h-full border border-zinc-100 shadow-sm rounded-xl overflow-hidden hover:shadow-xl transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Carousel Button */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-xl border border-zinc-100 z-20 hover:scale-110 hover:bg-[#111111] hover:text-white transition-all hidden lg:flex"
                        >
                            <ChevronRight className="w-5 h-5 ml-0.5" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
