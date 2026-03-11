"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

const SLIDES = [
    {
        id: 1,
        subtitle: "L'ÉLÉGANCE REDÉFINIE",
        title: "Collection Couture",
        description: "Découvrez l'exclusivité de nos robes du soir, conçues pour les moments inoubliables.",
        buttonText: "DÉCOUVRIR LA COLLECTION",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000",
        bgColor: "bg-[#E2D8C5]",
        textColor: "text-[#111111]",
        link: "/shop?category=evening-wear"
    },
    {
        id: 2,
        subtitle: "SUR-MESURE",
        title: "L'Art du Tailleur",
        description: "L'excellence du costume masculin. Une coupe parfaite, des tissus d'exception.",
        buttonText: "VOIR LES COSTUMES",
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1200",
        bgColor: "bg-[#111111]",
        textColor: "text-white",
        link: "/shop?category=suits"
    }
];

export function HeroSection({ banners }: { banners?: any[] }) {
    const [current, setCurrent] = useState(0);

    const slides = banners && banners.length > 0 ? banners.map(b => ({
        id: b.id,
        subtitle: b.subtitle || "EXCLUSIVITÉ",
        title: b.title,
        description: b.link ? "Ne ratez pas nos offres à prix compétitifs" : "Découvrez nos offres exceptionnelles",
        buttonText: "DÉCOUVRIR",
        image: b.image,
        bgColor: "bg-zinc-900", // Fallback, could be added to DB if needed
        link: b.link || "/shop"
    })) : SLIDES;

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const slide = slides[current] || SLIDES[0];

    return (
        <section className={`relative w-full min-h-[460px] lg:h-[520px] overflow-hidden ${slide.bgColor} group cursor-default rounded-[12px]`}>
            {/* Background Decorative Pattern (Simulation of brand motifs) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] repeat" />
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_rgba(89,44,47,0.4),_transparent_50%)]" />
            </div>

            <div className="container mx-auto h-full px-4 lg:px-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12 lg:py-0">

                    {/* Left Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:pt-10">
                        <span className="text-brand-burgundy font-bold text-[12px] md:text-[13px] tracking-[0.5em] uppercase mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
                            {slide.subtitle} — EST. 2013
                        </span>
                        <h1 className="text-white font-black text-[38px] md:text-[54px] lg:text-[68px] leading-[1.05] tracking-tight mb-8 animate-in fade-in slide-in-from-left-6 duration-1000 uppercase">
                            {slide.title}
                        </h1>
                        <p className="text-white/60 text-[14px] md:text-[15px] max-w-md leading-relaxed mb-10 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200 uppercase tracking-widest">
                            {slide.description}
                        </p>

                        <Link
                            href={slide.link}
                            className="bg-white hover:bg-brand-burgundy text-[#111111] hover:text-white font-bold px-10 py-5 rounded-[2px] text-[12px] uppercase tracking-[0.3em] transition-all shadow-2xl hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500"
                        >
                            {slide.buttonText}
                        </Link>
                    </div>

                    {/* Right Product Image (Stands out more) */}
                    <div className="relative w-full lg:w-[45%] h-[300px] lg:h-[450px] mt-12 lg:mt-0 flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                        {/* Glow effect under product */}
                        <div className="absolute w-[80%] h-[60%] bg-white opacity-10 blur-[120px] rounded-full z-0" />

                        <div className="relative w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] z-10 transition-transform duration-700 hover:scale-110"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav Arrows */}
            <button
                onClick={(e) => { e.preventDefault(); prev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 backdrop-blur-sm"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); next(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 backdrop-blur-sm"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Indicators Container */}
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-300 ${current === i ? "w-10 h-1.5 bg-[#592C2F] rounded-full" : "w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/50"}`}
                    />
                ))}
            </div>
        </section>
    );
}
