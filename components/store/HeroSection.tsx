"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
    {
        id: "1",
        subtitle: "Luxe & Tradition",
        title: "Luxury Abayas",
        description: "Experience the ultimate elegance with our signature Abaya collection. Crafted for the modern woman who values tradition.",
        buttonText: "SHOP ABAYAS",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
        link: "/shop?category=abayas"
    },
    {
        id: "2",
        subtitle: "Royal Scents",
        title: "Perfumes & Oud",
        description: "A journey through the scents of Arabia. Discover our premium selection of Oud, Perfumes, and Bukhoor.",
        buttonText: "EXPLORE SCENTS",
        image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2000",
        link: "/shop?category=perfumes-oud"
    },
    {
        id: "3",
        subtitle: "Timeless Grace",
        title: "Dresses & Jalabiyas",
        description: "Elegant dresses and Jalabiyas for your most unforgettable moments. Where fashion meets heritage.",
        buttonText: "VIEW COLLECTION",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000",
        link: "/shop?category=dresses-jalabiyas"
    }
];

export function HeroSection({ banners, settings }: { banners?: any[]; settings?: Record<string, string> }) {
    const [current, setCurrent] = useState(0);

    const slides = banners && banners.length > 0 ? banners.map(b => ({
        id: b.id,
        subtitle: b.subtitle || settings?.homepageSubtitle || "EXCLUSIVE",
        title: b.title || settings?.homepageTitle || "COLLECTION",
        description: b.description || settings?.aboutText || "Discover our exceptional offers",
        buttonText: "EXPLORE",
        image: b.image,
        link: b.link || "/shop"
    })) : [
        {
            id: "1",
            subtitle: settings?.homepageSubtitle || "Luxe & Tradition",
            title: settings?.homepageTitle || "Luxury Abayas",
            description: settings?.aboutText || "Experience the ultimate elegance with our signature collection.",
            buttonText: "SHOP NOW",
            image: settings?.homepageImage || "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
            link: "/shop?category=abayas"
        }
    ];

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative w-full h-[85vh] min-h-[700px] overflow-hidden bg-black group font-sans">
            {/* ── THE EXHIBITION HERO (Original Design) ── */}
            <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {/* Background Text (Watermark style) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03]">
                    <span className="text-[25vw] font-serif font-black tracking-tighter text-white whitespace-nowrap">AUTHENTIC</span>
                </div>

                {/* Slides Container */}
                {slides.map((slide, idx) => {
                    const isActive = idx === current;
                    return (
                        <div 
                            key={slide.id}
                            className={cn(
                                "absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center transition-all duration-1000",
                                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0 pointer-events-none"
                            )}
                        >
                            {/* LEFT: TEXTUAL ARCHITECTURE */}
                            <div className="flex-1 w-full h-full flex flex-col justify-center px-12 lg:px-24 z-20">
                                <div className={cn(
                                    "transition-all duration-1000 delay-300 transform",
                                    isActive ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                                )}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-[1px] bg-brand-burgundy" />
                                        <span className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase">{slide.subtitle}</span>
                                    </div>
                                    
                                    <h1 className="text-white font-serif text-[60px] md:text-[80px] lg:text-[110px] leading-[0.9] tracking-tighter mb-10">
                                        {slide.title.split(' ').map((word: string, i: number) => (
                                            <span key={i} className={cn("block", i % 2 === 1 ? "pl-20 italic font-light text-zinc-300" : "font-bold")}>
                                                {word}
                                            </span>
                                        ))}
                                    </h1>

                                    <div className="flex items-start gap-10">
                                        <div className="flex flex-col gap-1 py-1">
                                            <div className="w-2 h-2 bg-brand-burgundy rounded-full animate-pulse" />
                                            <div className="w-[1px] h-20 bg-zinc-800 ml-[3.5px]" />
                                        </div>
                                        <div className="max-w-md">
                                            <p className="text-zinc-400 text-[14px] leading-relaxed mb-10 tracking-wide font-light lowercase first-letter:uppercase">
                                                {slide.description}
                                            </p>
                                            <Link href={slide.link} className="group relative inline-flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-brand-burgundy group-hover:border-brand-burgundy transition-all duration-500">
                                                    <ChevronRight className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-[11px] font-black tracking-[0.4em] text-white uppercase group-hover:translate-x-2 transition-transform duration-500">
                                                    Explore Now
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: FLOATING VISUALS */}
                            <div className="flex-1 w-full h-full relative p-12 lg:p-24 overflow-hidden">
                                {/* Large Main Image with tilted frame */}
                                <div className={cn(
                                    "relative w-full h-full bg-zinc-900 overflow-hidden transition-all duration-[1.5s] delay-500 shadow-2xl rotate-2 hover:rotate-0",
                                    isActive ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0"
                                )}>
                                    <Image 
                                        src={slide.image} 
                                        alt={slide.title} 
                                        fill 
                                        className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
                                </div>

                                {/* Floating Detail Image (Small Overlay) */}
                                <div className={cn(
                                    "absolute bottom-20 left-4 w-48 h-64 border-8 border-[#0a0a0a] shadow-2xl z-30 hidden lg:block transition-all duration-[2s] delay-700",
                                    isActive ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0"
                                )}>
                                    <Image 
                                        src={slide.image} 
                                        alt="Detail" 
                                        fill 
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-1/4 -right-10 w-40 h-px bg-zinc-800 rotate-45" />
                                <div className="absolute bottom-1/4 -left-10 w-40 h-px bg-zinc-800 rotate-45" />
                            </div>
                        </div>
                    );
                })}

                {/* Progress Indicators (Vertical Original Style) */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className="group flex items-center gap-4 focus:outline-none"
                        >
                            <span className={cn(
                                "text-[10px] font-bold transition-all duration-500",
                                idx === current ? "text-brand-burgundy translate-x-0" : "text-zinc-700 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                            )}>
                                0{idx + 1}
                            </span>
                            <div className={cn(
                                "w-10 h-[1px] transition-all duration-500",
                                idx === current ? "bg-brand-burgundy w-16" : "bg-zinc-800"
                            )} />
                        </button>
                    ))}
                </div>

                {/* Bottom Bar Controls */}
                <div className="absolute bottom-0 left-0 w-full h-24 border-t border-white/5 flex items-center justify-between px-12 lg:px-24 z-40 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-12">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Active Edition</span>
                            <span className="text-[12px] text-white font-medium">Local Bazar Hub 2025</span>
                        </div>
                        <div className="w-px h-8 bg-zinc-800" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Gallery</span>
                            <span className="text-[12px] text-white font-medium">0{current + 1} / 0{slides.length}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <button onClick={prev} className="p-4 rounded-full border border-zinc-800 text-zinc-400 hover:border-white hover:text-white transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={next} className="p-4 rounded-full border border-zinc-800 text-zinc-400 hover:border-white hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
