"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface ShopHeaderProps {
    categoryName: string;
    slug?: string;
    productCount: number;
}

export function ShopHeader({ categoryName, slug, productCount }: ShopHeaderProps) {
    const { t, isAr } = useLanguage();

    // Resolve Title
    const title = slug
        ? t(`cat.${slug}` as Parameters<typeof t>[0])
        : (categoryName === "Full Catalogue" ? t("shop.title.fullCatalogue") : categoryName);

    // Fallback if translation returns key (simple check, or just accept it might happen for unknown slugs)
    // Actually t() usually returns key if missing, so we might want to check if it looks like a key? 
    // For now assuming slugs match translation keys 'cat.laptops' etc.

    const displayTitle = title.startsWith("cat.") ? categoryName : title;

    return (
        <div className="relative py-24 mb-12 overflow-hidden rounded-[48px] bg-neutral-950 border border-white/10 shadow-2xl group">
            {/* Clean Background with subtle gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900 to-black pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 container mx-auto px-12 lg:px-20 flex flex-col md:flex-row md:items-end justify-between gap-12 h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-[2px] w-12 bg-blue-600" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">
                            {t("shop.zenithPremiere")}
                        </span>
                    </div>

                    <h1 className={cn(
                        "text-5xl md:text-7xl lg:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.85]",
                        isAr && "font-sans leading-tight tracking-normal"
                    )}>
                        {displayTitle}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex items-center gap-8"
                >
                    <div className="h-20 w-[1px] bg-white/10 hidden md:block" />
                    <div className="space-y-1">
                        <span className="text-5xl font-black text-white tracking-tighter tabular-nums block">
                            {productCount}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                            {t("shop.availableUnits")}
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
