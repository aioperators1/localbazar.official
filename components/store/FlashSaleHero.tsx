"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn, formatPrice } from "@/lib/utils";

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
    name: "Velvet Couture",
    description: "The pinnacle of sartorial achievement. Handmade velvet with gold-threaded embroidery, designed for the most prestigious evening events.",
    originalPrice: 8500,
    price: 6490,
    discount: 25,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200",
    slug: "velvet-couture-evening-gown"
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

    const formattedPrice = formatPrice(product.price);

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative w-full py-12 px-4 md:px-8 lg:px-12 overflow-hidden"
            dir={isAr ? "rtl" : "ltr"}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full min-h-[550px] lg:h-[70vh] rounded-[2rem] overflow-hidden bg-[#111111] shadow-2xl flex items-center"
            >
                {/* AMBIENT LUXURY GRADIENT */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -left-1/4 -top-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(89,44,47,0.15)_0%,rgba(17,17,17,0)_60%)] opacity-80"
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="relative z-20 w-full h-full grid lg:grid-cols-2 items-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 gap-12">
                    
                    {/* INFO BLOCK */}
                    <div className="space-y-10 text-center lg:text-start order-2 lg:order-1">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                            >
                                <Sparkles className="w-3 h-3 text-[#E2D8C5]" />
                                <span className="text-[10px] font-black text-[#E2D8C5] uppercase tracking-[0.3em] font-sans">
                                    {t("flash.premiere")}
                                </span>
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className={cn(
                                    "text-white leading-[0.9] tracking-tighter",
                                    isAr 
                                        ? "text-5xl md:text-7xl lg:text-8xl font-black" 
                                        : "text-6xl md:text-8xl lg:text-[10rem] font-black uppercase italic"
                                )}
                            >
                                {t("flash.zenith.title").split(' ')[0]} <br />
                                <span className="text-[#E2D8C5] opacity-50 not-italic">
                                    {t("flash.zenith.title").split(' ').slice(1).join(' ')}
                                </span>
                            </motion.h2>

                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-[#DBDBD9]/60 text-sm md:text-base font-medium max-w-lg leading-relaxed font-sans"
                            >
                                {t("flash.zenith.desc")}
                            </motion.p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#DBDBD9]/30 uppercase tracking-[0.4em] font-black">{t("flash.reservePrice")}</span>
                                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
                                    {formattedPrice}
                                </div>
                            </div>

                            <Link
                                href={`/product/${product.slug}`}
                                className="h-14 md:h-16 px-10 bg-[#E2D8C5] text-[#111111] font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-[#DBDBD9] hover:scale-105 transition-all duration-300 rounded-full group shadow-[0_0_30px_rgba(226,216,197,0.2)]"
                            >
                                <span className="flex items-center gap-3">
                                    {t("flash.acquire")}
                                    <ArrowRight className={cn(
                                        "w-4 h-4 transition-transform group-hover:translate-x-1",
                                        isAr && "rotate-180"
                                    )} />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* VISUAL BLOCK */}
                    <div className="relative order-1 lg:order-2 flex items-center justify-center h-full min-h-[300px] lg:min-h-[500px]">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full h-full max-w-[450px] lg:max-w-none"
                        >
                            {/* GLOW BEHIND IMAGE */}
                            <div className="absolute inset-0 bg-[#592C2F]/20 blur-[120px] rounded-full scale-75 animate-pulse" />
                            
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-[0_0_80px_rgba(0,0,0,0.8)] z-30"
                                priority
                                unoptimized
                            />
                        </motion.div>

                        {/* FLOATING DATA CHIPS */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/4 right-0 lg:right-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hidden md:block"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-[#E2D8C5]/40 font-bold uppercase tracking-widest">Authentication</span>
                                <span className="text-[12px] text-white font-black italic">VERIFIED GENUINE</span>
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* BOTTOM MARQUEE */}
                <div className="absolute bottom-6 left-0 w-full overflow-hidden opacity-20 whitespace-nowrap hidden lg:block">
                    <div className="animate-marquee inline-flex gap-12 text-[10px] font-black text-white uppercase tracking-[0.8em]">
                        <span>• EXCLUSIVE ACCESS • BI-LATERAL LOGISTICS • LUXURY PROTOCOL • QATAR DELIVERY</span>
                        <span>• EXCLUSIVE ACCESS • BI-LATERAL LOGISTICS • LUXURY PROTOCOL • QATAR DELIVERY</span>
                        <span>• EXCLUSIVE ACCESS • BI-LATERAL LOGISTICS • LUXURY PROTOCOL • QATAR DELIVERY</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
