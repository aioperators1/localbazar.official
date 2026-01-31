"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/components/providers/language-provider";
import { startConversation } from "@/lib/actions/marketplace";

interface ProductProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        image: string;
        category: string;
        sellerId?: string | null;
        seller?: {
            name: string | null;
            image: string | null;
        } | null;
    }
    className?: string;
}

export function ProductCard({ product, className }: ProductProps) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    let mainImage = product.image;
    try {
        if (mainImage && mainImage.startsWith('[')) {
            const parsed = JSON.parse(mainImage);
            mainImage = parsed[0];
        }
    } catch { }

    const formattedPrice = new Intl.NumberFormat(isAr ? 'ar-MA' : 'en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(product.price));

    const [imageError, setImageError] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: mainImage,
            quantity: 1,
            category: product.category
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleContactSeller = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setLoading(true);
        try {
            await startConversation(product.id);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className={cn("group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-pro hover:border-blue-500/30", className)}>
            {/* Image Area */}
            <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950/20">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <motion.div whileHover={{ scale: 1.05 }} className="relative w-full h-full transition-transform duration-700">
                        <Image
                            src={!imageError ? (mainImage || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000") : "https://placehold.co/600x400/101010/FFFFFF/png?text=Hardware"}
                            alt={product.name}
                            fill unoptimized
                            className="object-contain p-8"
                            onError={() => setImageError(true)}
                        />
                    </motion.div>
                </Link>

                {/* Seller Info Overlay */}
                {product.seller && (
                    <div className={cn(
                        "absolute top-3 z-10 flex items-center gap-2 p-1 pr-3 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full",
                        isAr ? "right-3 flex-row-reverse pl-3 pr-1" : "left-3"
                    )}>
                        <div className="w-5 h-5 rounded-full bg-blue-600 overflow-hidden relative">
                            {product.seller.image ? (
                                <Image src={product.seller.image} alt={product.seller.name || ""} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[9px] font-black text-white">
                                    {(product.seller.name || "U")[0]}
                                </div>
                            )}
                        </div>
                        <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">
                            {product.seller.name?.split(' ')[0]}
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                <div className={cn(
                    "absolute bottom-3 z-10",
                    isAr ? "left-3" : "right-3"
                )}>
                    <div className="px-2 py-0.5 bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 rounded text-[8px] font-black uppercase tracking-widest border border-white/5">
                        {product.category || "General"}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col gap-4 flex-grow border-t border-zinc-100 dark:border-white/5">
                <div className="space-y-1">
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight hover:text-blue-500 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-500">
                        {formattedPrice}
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    {product.sellerId ? (
                        <button
                            onClick={handleContactSeller}
                            disabled={loading}
                            className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {loading ? "..." : (isAr ? "تواصل" : "Contact")}
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={cn(
                                "flex-1 h-9 font-black text-[9px] uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2",
                                isAdded ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-950 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                            )}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {isAdded ? (isAr ? "تمت الإضافة" : "Added") : (isAr ? "أضف للسلة" : "Add to Cart")}
                        </button>
                    )}
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-9 h-9 flex items-center justify-center bg-zinc-100 dark:bg-white/5 border border-transparent hover:border-blue-500/30 rounded-lg transition-all text-zinc-400 group/link"
                    >
                        <ArrowRight className={cn("w-3.5 h-3.5 transition-transform", isAr ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5")} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
