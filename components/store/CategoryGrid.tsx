"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, Shirt, ShoppingBag, Activity, Shield, Zap, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

// --- Zenith HUD Border Component ---
function ProFrame({ color }: { color: string }) {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
            <motion.path
                d="M 20 0 H 0 V 20 M 0 calc(100% - 20) V 100% H 20 M calc(100% - 20) 100% H 100% V calc(100% - 20) M 100% 20 V 0 H calc(100% - 20)"
                fill="none"
                stroke={color}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.2 }}
                className="group-hover:opacity-100 transition-opacity duration-500"
            />
        </svg>
    );
}

// --- Category Card ---
function CategoryCard({
    href,
    title,
    image,
    icon: Icon,
    className,
    accentColor = "blue",
    dataPoints = []
}: {
    href: string;
    title: string;
    image: string;
    icon: any;
    className?: string;
    accentColor?: "blue" | "zinc" | "slate";
    dataPoints?: { label: string, value: string }[];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === "ar";

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { damping: 25, stiffness: 150 });
    const mouseYSpring = useSpring(y, { damping: 25, stiffness: 150 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const colors = {
        blue: "var(--color-brand-charcoal)",
        zinc: "#71717a",
        slate: "#64748b"
    };

    const activeColor = colors[accentColor];

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900/50 shadow-pro",
                className
            )}
        >
            <Link href={href} className="block w-full h-full relative p-8">
                <ProFrame color={activeColor} />

                {/* Background Layer */}
                <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-900">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover opacity-100 dark:opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                </div>

                {/* Header */}
                <div className="relative z-50 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className={cn(
                            "font-black text-white mix-blend-difference flex items-center gap-2",
                            isAr ? "text-[10px]" : "text-[8px] uppercase tracking-widest"
                        )}>
                            <Activity className="w-3 h-3 text-brand-burgundy" /> {t("home.protocol")}
                        </span>
                        <div className="h-px w-16 bg-brand-burgundy/50" />
                    </div>

                    <div className="p-3 rounded-lg border border-black/5 dark:border-white/5 bg-white/50 backdrop-blur-xl transition-all duration-500">
                        <Icon style={{ color: activeColor }} className="w-5 h-5 transition-transform" />
                    </div>
                </div>

                {/* Title */}
                <div className="relative z-40 mt-12 mb-8" style={{ transform: "translateZ(40px)" }}>
                    <motion.div
                        className="inline-block p-4 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/5"
                    >
                        <h3
                            className={cn(
                                "font-black text-zinc-900 dark:text-white",
                                isAr ? "text-4xl leading-tight" : "text-5xl uppercase tracking-tighter leading-none"
                            )}
                        >
                            {title.split(' ')[0]} <br />
                            <span className="text-brand-burgundy">{title.split(' ').slice(1).join(' ')}</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="relative z-50 flex flex-wrap gap-4 pt-6 mt-auto" style={{ transform: "translateZ(20px)" }}>
                    {dataPoints.map((point, i) => (
                        <div key={i} className="flex flex-col gap-0.5 bg-white/70 dark:bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 dark:border-white/5 shadow-sm">
                            <span className={cn(
                                "font-black text-zinc-600 dark:text-zinc-400",
                                isAr ? "text-[9px]" : "text-[7px] uppercase tracking-widest"
                            )}>{point.label}</span>
                            <span className="text-[10px] font-bold text-zinc-900 dark:text-white">
                                {point.value}
                            </span>
                        </div>
                    ))}
                    <div className="ms-auto mt-auto">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-brand-burgundy/20 rounded-full">
                            <Target className="w-2.5 h-2.5 text-brand-burgundy" />
                            <span className={cn(
                                "font-black text-foreground",
                                isAr ? "text-[10px]" : "text-[8px] tracking-widest uppercase"
                            )}>{t("cat.selectTier")}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function CategoryGrid() {
    const { t, language } = useLanguage();
    const isAr = language === "ar";

    return (
        <section className="container mx-auto px-6 py-24 relative" dir={isAr ? "rtl" : "ltr"}>
            {/* Header Section */}
            <div className="relative z-10 mb-16 grid lg:grid-cols-2 gap-8 items-end">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 text-brand-burgundy"
                    >
                        <Shield className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">{t("home.hardwarePriority")}</span>
                    </motion.div>
                    <h2 className={cn(
                        "font-black text-foreground [text-wrap:balance]",
                        isAr ? "text-5xl md:text-7xl lg:text-8xl leading-tight" : "text-5xl md:text-8xl uppercase tracking-tighter leading-[0.8]"
                    )}>
                        {t("home.globalGear").split(' ')[0]} <br />
                        <span className="text-brand-burgundy opacity-30">{t("home.matrix")}</span>
                    </h2>
                </div>
                <div className="p-8 bg-card border border-black/5 dark:border-white/5 backdrop-blur-3xl rounded-xl space-y-4 max-w-md shadow-pro">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-brand-burgundy" />
                        <span className={cn(
                            "font-black text-muted-foreground",
                            isAr ? "text-[10px]" : "text-[8px] uppercase tracking-widest"
                        )}>{t("home.protocol")}</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-bold leading-relaxed uppercase tracking-widest">
                        {t("home.navigateGrid")}
                    </p>
                </div>
            </div>

            {/* The Luxury Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 min-h-[900px]">
                {/* Abayas */}
                <CategoryCard
                    href="/shop?category=abayas"
                    title={t("cat.couture")}
                    image="https://images.unsplash.com/photo-1585487000160-afffbfc767ab?q=80&w=1200"
                    icon={Sparkles}
                    className="md:col-span-3 lg:col-span-8 lg:row-span-2"
                    accentColor="blue"
                    dataPoints={[
                        { label: t("spec.uptime"), value: "Exclusive" },
                        { label: t("spec.coreSync"), value: "Traditional" },
                        { label: t("spec.refresh"), value: "Handmade" }
                    ]}
                />

                {/* Dresses & Jalabiyas */}
                <CategoryCard
                    href="/shop?category=dresses-jalabiyas"
                    title={t("cat.suits")}
                    image="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200"
                    icon={Scissors}
                    className="md:col-span-3 lg:col-span-4 lg:row-span-2"
                    accentColor="zinc"
                    dataPoints={[
                        { label: t("spec.thermal"), value: "Signature" },
                        { label: t("spec.bandwidth"), value: "Silk" }
                    ]}
                />

                {/* Perfumes */}
                <CategoryCard
                    href="/shop?category=perfumes-oud"
                    title={t("cat.heritage")}
                    image="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200"
                    icon={Shirt}
                    className="md:col-span-3 lg:col-span-6"
                    accentColor="blue"
                    dataPoints={[
                        { label: t("spec.latency"), value: "Royal" },
                        { label: t("spec.keyPolling"), value: "Oud" }
                    ]}
                />

                {/* Accessories */}
                <CategoryCard
                    href="/shop?category=accessories"
                    title={t("cat.accessories")}
                    image="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200"
                    icon={ShoppingBag}
                    className="md:col-span-3 lg:col-span-6"
                    accentColor="slate"
                    dataPoints={[
                        { label: t("spec.drivers"), value: "Finest" },
                        { label: t("spec.isolation"), value: "Unique" }
                    ]}
                />
            </div>
        </section>
    );
}
