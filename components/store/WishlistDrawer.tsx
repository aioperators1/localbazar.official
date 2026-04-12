
"use client";

import { X, ShoppingBag, Heart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
    const { items, removeItem, clearWishlist } = useWishlist();
    const { addItem } = useCart();
    const { t, language } = useLanguage();
    const { formatPrice: formatCurrency } = useCurrency();
    const isAr = language === "ar";

    const handleMoveToCart = (item: { 
        id: string; 
        name: string; 
        price: number; 
        image: string; 
        slug: string; 
        category?: string 
    }) => {
        addItem({
            ...item,
            quantity: 1,
            size: null,
            color: null
        });
        removeItem(item.id);
        toast.success(t('product.addedToCart'));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: isAr ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isAr ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "relative w-full max-w-[450px] h-full bg-[#1A0306] text-white shadow-2xl flex flex-col",
                            isAr ? "left-0" : "right-0"
                        )}
                    >
                        {/* Header */}
                        <div className={cn(
                            "p-8 lg:p-10 flex items-center justify-between border-b border-white/5",
                            isAr && "flex-row-reverse"
                        )}>
                            <div className={cn("flex items-center gap-4", isAr && "flex-row-reverse")}>
                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div className={cn("flex flex-col", isAr && "text-right")}>
                                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">{t('wishlist.title')}</h2>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{items.length} {t('cart.items')}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 lg:p-10 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                    <Heart className="w-12 h-12 stroke-[1]" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t('wishlist.empty')}</p>
                                    <button 
                                        onClick={onClose}
                                        className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/20 pb-1 hover:border-white transition-all"
                                    >
                                        {t('cart.continueShopping')}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-6 group",
                                            isAr && "flex-row-reverse pt-2"
                                        )}
                                    >
                                        {/* Image */}
                                        <div className="relative w-24 aspect-[3/4] overflow-hidden bg-white/5 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className={cn("flex flex-col flex-1 justify-between py-1", isAr && "text-right")}>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none block">
                                                    {item.category || "Boutique"}
                                                </span>
                                                <Link 
                                                    href={`/product/${item.slug}`}
                                                    onClick={onClose}
                                                    className="text-[13px] font-serif font-light text-white hover:text-white/70 transition-colors line-clamp-2 uppercase tracking-tight"
                                                >
                                                    {item.name}
                                                </Link>
                                                <span className="text-[14px] font-serif italic text-white/60">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </div>

                                            <div className={cn("flex items-center gap-4 pt-4", isAr && "flex-row-reverse")}>
                                                <button
                                                    onClick={() => handleMoveToCart(item)}
                                                    className="flex-1 h-10 bg-white text-black hover:bg-white/90 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                    {t('cart.add')}
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-10 h-10 border border-white/10 hover:border-rose-500/40 hover:text-rose-500 transition-all flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 lg:p-10 border-t border-white/5 space-y-6">
                                <Link
                                    href="/wishlist"
                                    onClick={onClose}
                                    className="w-full h-14 border border-white/10 hover:border-white transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] group"
                                >
                                    {t('product.wishlist')}
                                    <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isAr && "rotate-180 group-hover:-translate-x-1")} />
                                </Link>
                                <button
                                    onClick={clearWishlist}
                                    className="w-full text-[9px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-rose-500 transition-colors"
                                >
                                    Clear All Protocol
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
