"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2000&auto=format&fit=crop",
        metaKeys: ["meta1", "meta2", "meta3"]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
        metaKeys: ["meta1", "meta2", "meta3"]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop",
        metaKeys: ["meta1", "meta2", "meta3"]
    }
];

export function HeroSection() {
    const [current, setCurrent] = useState(0);
    const { t, language } = useLanguage();
    const isAr = language === "ar";
    const dir = isAr ? "rtl" : "ltr";

    const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];
    // @ts-expect-error - dynamic keys
    const tagline = t(`slide${slide.id}.tagline`);
    // @ts-expect-error - dynamic keys
    const title = t(`slide${slide.id}.title`);
    // @ts-expect-error - dynamic keys
    const subtitle = t(`slide${slide.id}.subtitle`);
    // @ts-expect-error - dynamic keys
    const desc = t(`slide${slide.id}.desc`);

    return (
        <section className="relative w-full h-screen bg-background text-foreground overflow-hidden" dir={dir}>

            {/* Background Image Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    {/* Gradient Overlay - Dark Mode Only */}
                    <div className={cn(
                        "absolute inset-0 z-10 hidden dark:block",
                        isAr
                            ? "bg-gradient-to-l from-black via-black/80 to-transparent"
                            : "bg-gradient-to-r from-black via-black/80 to-transparent"
                    )} />
                    {/* Light Mode Subtle Gradient for text safety (optional, very minimal) */}
                    <div className="absolute inset-0 z-10 block dark:hidden bg-gradient-to-b from-white/30 via-transparent to-white/30" />

                    <div className="absolute inset-0 z-20 bg-black/10 dark:bg-black/40" />

                    <Image
                        src={slide.image}
                        alt="Hero"
                        fill
                        className="object-cover object-center opacity-100 dark:opacity-70"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content Content - Staggered */}
            <div className="container mx-auto px-6 relative z-20 h-full flex flex-col items-center justify-center text-center">
                <motion.div
                    key={current + "text"}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                    className="max-w-5xl space-y-6"
                >
                    {/* Text Container with Glass Effect for readability */}
                    <div className="p-8 rounded-3xl bg-white/30 dark:bg-transparent backdrop-blur-sm border border-white/20 dark:border-none shadow-lg dark:shadow-none">
                        {/* Tagline */}
                        <motion.div
                            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className={cn(
                                "text-blue-700 dark:text-blue-500 font-black text-xs mb-4",
                                isAr ? "font-bold" : "uppercase tracking-[0.4em]"
                            )}
                        >
                            <span>&mdash; {tagline} &mdash;</span>
                        </motion.div>

                        {/* Giant Typography */}
                        <motion.div variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-4">
                            <h1 className={cn(
                                "font-black leading-[0.8] text-zinc-900 dark:text-white drop-shadow-md dark:drop-shadow-none",
                                isAr ? "text-6xl md:text-8xl lg:text-9xl" : "text-5xl sm:text-6xl md:text-8xl lg:text-[140px] tracking-tighter uppercase"
                            )}>
                                {title}
                            </h1>
                            <h2 className={cn(
                                "font-bold text-zinc-600 dark:text-zinc-500 tracking-tighter",
                                isAr ? "text-3xl md:text-5xl" : "text-2xl sm:text-3xl md:text-6xl uppercase"
                            )}>
                                {subtitle}
                            </h2>
                        </motion.div>
                    </div>

                    {/* Description */}
                    <motion.p
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        {desc}
                    </motion.p>

                    {/* CTA & Specs */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        className="pt-12 flex flex-col items-center gap-10"
                    >
                        <Link href="/shop" className={cn(
                            "group relative px-12 py-5 bg-blue-600 text-white font-black hover:bg-blue-500 transition-all rounded-full shadow-2xl shadow-blue-600/20",
                            isAr ? "font-bold" : "uppercase tracking-widest text-sm"
                        )}>
                            <span className="flex items-center gap-3">
                                {t("hero.shopNow")}
                                <ArrowRight className={cn(
                                    "w-5 h-5 transition-transform",
                                    isAr ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"
                                )} />
                            </span>
                        </Link>

                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                            {slide.metaKeys.map((key, i) => (
                                <div key={i} className={cn(
                                    "flex items-center gap-3 px-6 py-2 border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-500",
                                    isAr ? "font-bold" : "uppercase tracking-widest"
                                )}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {/* @ts-expect-error - dynamic key access */}
                                    {t(`slide${slide.id}.${key}`)}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-4">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 transition-all duration-500 ${current === i ? "w-16 bg-blue-500" : "w-4 bg-zinc-300 dark:bg-zinc-800"}`}
                    />
                ))}
            </div>

            {/* Nav Arrows */}
            <div className={cn(
                "absolute bottom-12 z-30 flex gap-2",
                isAr ? "left-12" : "right-12"
            )}>
                <button onClick={prev} className="p-4 border border-zinc-200 dark:border-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-zinc-900 dark:text-white transition-colors rounded-full group bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    {isAr ? <ChevronRight className="w-6 h-6 group-hover:translate-x-1" /> : <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1" />}
                </button>
                <button onClick={next} className="p-4 border border-zinc-200 dark:border-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-zinc-900 dark:text-white transition-colors rounded-full group bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    {isAr ? <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1" /> : <ChevronRight className="w-6 h-6 group-hover:translate-x-1" />}
                </button>
            </div>
        </section>
    );
}
