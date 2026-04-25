
"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { useLanguage } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { ProductCard } from "@/components/store/ProductCard";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
    const { items } = useWishlist();
    const { t, language } = useLanguage();
    const isAr = language === "ar";

    return (
        <div className="min-h-screen bg-transparent text-white pb-24 pt-10" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className={cn(
                    "flex flex-col gap-6 mb-16",
                    isAr ? "text-right items-end" : "text-left items-start"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#0A0A0A] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-black/20">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-tighter uppercase italic">{t('wishlist.title')}</h1>
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] max-w-md leading-relaxed">
                        {items.length} {t('cart.items')} • Carefully curated selection for your excellence and heritage.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="min-h-[70vh] flex flex-col justify-center items-center gap-6 bg-transparent text-white" dir={isAr ? 'rtl' : 'ltr'}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-zinc-100 blur-[100px] scale-150 rounded-full opacity-50" />
                            <Heart className="w-24 h-24 text-zinc-100 stroke-[1] relative z-10 group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h2 className="text-2xl font-serif italic text-zinc-800">{t('wishlist.empty')}</h2>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Your vault of inspiration is currently vacant.</p>
                        </div>
                        <Link 
                            href="/shop"
                            className="h-16 px-12 bg-[#0A0A0A] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-zinc-800 transition-all shadow-2xl"
                        >
                            {t('hero.shopNow')}
                            <ArrowRight className={cn("w-4 h-4", isAr && "rotate-180")} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                        {items.map((item) => (
                            <ProductCard 
                                key={item.id}
                                product={{
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    slug: item.slug,
                                    category: { name: (item.category as string) || "Fashion", slug: (item.category as string)?.toLowerCase().replace(/\s+/g, '-') || "fashion" },
                                    images: item.image || ""
                                } as any}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
