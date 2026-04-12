"use client";

import { ProductCard } from "@/components/store/ProductCard";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

import { Product } from "@/lib/types";

interface ProductsGridProps {
    products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
    const { t } = useLanguage();

    if (products.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-8 border border-white/5 bg-white/[0.02] rounded-3xl"
            >
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <ShoppingBag className="w-10 h-10 text-white/20" />
                    </div>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-burgundy/10 flex items-center justify-center border border-brand-burgundy/20"
                    >
                        <Sparkles className="w-5 h-5 text-brand-burgundy" />
                    </motion.div>
                </div>
                
                <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-serif italic text-white tracking-tight">
                        {t('shop.noPieces') || "Curating Excellence"}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-[0.2em]">
                        {t('shop.noPiecesDesc') || "Our exclusive collection is currently reaching its next phase of evolution. Please return soon."}
                    </p>
                </div>

                <div className="pt-4">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Synchronized
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((p, idx) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <ProductCard product={p} />
                </motion.div>
            ))}
        </div>
    );
}
