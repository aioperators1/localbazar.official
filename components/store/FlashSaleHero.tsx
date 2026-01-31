"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface FlashSaleHeroProps {
    product?: {
        name: string;
        description: string;
        price: number;
        originalPrice: number;
        discount: number;
        image: string;
        slug: string;
    }
}

const defaultProduct = {
    name: "Ultimate Configuration",
    description: "The pinnacle of technical achievement. Multi-node liquid cooling, enterprise-grade processing, and verified performance for critical workloads.",
    originalPrice: 48990,
    price: 42990,
    discount: 12,
    image: "/images/god-tier-build.png",
    slug: "ultimate-configuration"
};

export function FlashSaleHero({ product = defaultProduct }: FlashSaleHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const springConfig = { damping: 20, stiffness: 100 };
    const mouseX = useSpring(mousePos.x, springConfig);
    const mouseY = useSpring(mousePos.y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    const formattedPrice = new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
    }).format(product.price);

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative w-full py-16 perspective-2000"
            dir={isAr ? "rtl" : "ltr"}
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative w-full aspect-[21/9] min-h-[600px] rounded-xl overflow-hidden bg-white dark:bg-black border border-black/5 dark:border-white/5 shadow-pro flex items-center"
            >
                {/* BACKLIGHT MATRIX */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 dark:from-black/20 via-transparent to-black/5 dark:to-black/20" />
                </div>

                {/* BACKGROUND TEXT */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <motion.h1
                        style={{
                            x: useTransform(mouseX, [-0.5, 0.5], [100, -100]),
                            opacity: useTransform(scrollYProgress, [0, 0.5], [0.05, 0.01])
                        }}
                        className="text-[25vw] font-black text-black/5 dark:text-white/5 uppercase tracking-tighter leading-none select-none"
                    >
                        PREMIUM
                    </motion.h1>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="relative z-20 w-full grid lg:grid-cols-12 items-center h-full px-8 md:px-16 lg:px-24 gap-12 py-16 lg:py-0">

                    {/* Visual Area - Image on top for mobile */}
                    <div className="lg:col-span-6 h-full flex items-center justify-center relative min-h-[350px] lg:min-h-0 order-1 lg:order-2">
                        <motion.div
                            style={{
                                scale: useTransform(mouseY, [-0.5, 0.5], [0.95, 1.05]),
                            }}
                            className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none transition-colors"
                        />

                        <motion.div
                            style={{
                                x: useTransform(mouseX, [-0.5, 0.5], isAr ? [30, -30] : [-30, 30]),
                                y: useTransform(mouseY, [-0.5, 0.5], [-30, 30]),
                                transformStyle: "preserve-3d"
                            }}
                            className="relative w-full aspect-square max-h-[450px] lg:max-h-[550px]"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-30"
                                priority
                                unoptimized
                            />
                        </motion.div>
                    </div>

                    {/* Info Area */}
                    <div className="lg:col-span-6 space-y-12 lg:space-y-16 order-2 lg:order-1 text-center lg:text-start">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 justify-center lg:justify-start"
                            >
                                <div className="h-[2px] w-10 bg-blue-600" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">
                                    {t("flash.premiere")}
                                </span>
                            </motion.div>

                            <h2 className={cn(
                                "font-black text-foreground",
                                isAr
                                    ? "text-4xl md:text-6xl lg:text-7xl leading-[1.2] tracking-normal"
                                    : "text-5xl md:text-8xl uppercase tracking-tighter leading-[0.85]"
                            )}>
                                {t("flash.zenith.title").split(' ')[0]} <br />
                                <span className="text-muted-foreground">
                                    {t("flash.zenith.title").split(' ').slice(1).join(' ')}
                                </span>
                            </h2>

                            <p className={cn(
                                "text-muted-foreground text-sm md:text-lg font-bold max-w-lg leading-relaxed tracking-widest uppercase border-blue-600/10 dark:border-white/10 mx-auto lg:mx-0",
                                isAr ? "border-r-2 pr-8" : "border-l-2 pl-8"
                            )}>
                                {t("flash.zenith.desc")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-center lg:justify-start gap-12">
                            <div className="space-y-3">
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] font-black">{t("flash.reservePrice")}</span>
                                <div className="text-4xl md:text-6xl font-black text-foreground tracking-tighter flex items-center gap-6 justify-center lg:justify-start">
                                    {formattedPrice}
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest whitespace-nowrap">
                                        {t("flash.active")}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/product/${product.slug}`}
                                className="h-16 md:h-20 px-12 md:px-16 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-blue-500 transition-all duration-500 rounded-lg group shadow-pro mb-2"
                            >
                                <span className="flex items-center gap-4">
                                    {t("flash.acquire")}
                                    <ArrowRight className={cn(
                                        "w-5 h-5 transition-transform",
                                        isAr ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"
                                    )} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
