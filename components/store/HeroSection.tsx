"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Banner, AdminSetting } from "@/lib/types";

export function HeroSection({ banners }: { banners?: Banner[] }) {
    const [current, setCurrent] = useState(0);

    const slides = banners && banners.length > 0 ? banners.map(b => ({
        id: b.id,
        image: b.image,
        mobileImage: b.mobileImage || b.image,
        link: b.link || "/shop"
    })) : [
        {
            id: "fallback-1",
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
            mobileImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
            link: "/shop"
        }
    ];

    const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), [slides.length]);
    const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), [slides.length]);

    useEffect(() => {
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="relative w-full h-[90vh] sm:h-[70vh] lg:h-[100vh] overflow-hidden bg-[#0A0A0A] group">
            {/* ── THE LUXURY IMAGE-ONLY HERO ── */}
            <div className="absolute inset-0">
                {/* Slides Container */}
                {slides.map((slide, idx) => {
                    const isActive = idx === current;
                    return (
                        <div 
                            key={slide.id}
                            className={cn(
                                "absolute inset-0 w-full h-full transition-all duration-1000",
                                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            )}
                        >
                            <Link href={slide.link} className="relative block w-full h-full cursor-pointer">
                                {/* Desktop Image */}
                                <div className="hidden sm:block absolute inset-0">
                                    <Image 
                                        src={slide.image} 
                                        alt="Banner" 
                                        fill 
                                        className={cn(
                                            "object-cover transition-all duration-1000",
                                            isActive ? "opacity-100" : "opacity-0"
                                        )}
                                        priority={idx === 0}
                                        unoptimized
                                    />
                                </div>

                                {/* Mobile Image - Optimized for full immersion */}
                                <div className="sm:hidden absolute inset-0">
                                    <Image 
                                        src={slide.mobileImage} 
                                        alt="Mobile Banner" 
                                        fill 
                                        className={cn(
                                            "object-cover transition-opacity duration-1000",
                                            isActive ? "opacity-100" : "opacity-0"
                                        )}
                                        priority={idx === 0}
                                        unoptimized
                                    />
                                </div>

                                {/* Luxury Shimmer Overlay (Refined) */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
                            </Link>
                        </div>
                    );
                })}

                {/* Vertical Progress Indicators */}
                <div className="absolute top-1/2 right-6 lg:right-12 -translate-y-1/2 flex flex-col gap-6 z-40 hidden sm:flex">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className="group flex items-center gap-4 focus:outline-none"
                        >
                            <div className={cn(
                                "w-1 h-1 rounded-full transition-all duration-500",
                                idx === current ? "bg-white scale-[2]" : "bg-white/20 group-hover:bg-white/40"
                            )} />
                        </button>
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-6 right-6 lg:right-12 flex items-center gap-3 z-40">
                    <button 
                        onClick={(e) => { e.stopPropagation(); prev(); }} 
                        className="p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-300"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); next(); }} 
                        className="p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-300"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Floating Index */}
                <div className="absolute bottom-8 left-8 z-40 font-mono text-white/40 text-[10px] tracking-[0.3em] font-black uppercase pointer-events-none">
                    0{current + 1} / 0{slides.length} • LOCAL BAZAR HERITAGE
                </div>
            </div>
        </section>
    );
}
