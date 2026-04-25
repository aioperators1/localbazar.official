"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";

import { Product } from "@/lib/types";

interface ProductProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();
    const { formatPrice: formatCurrency } = useCurrency();
    const { t, language } = useLanguage();
    const [isAdded, setIsAdded] = useState(false);
    const isWishlisted = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem({
            id: product.id,
            name: displayTitle,
            price: product.price,
            image: imagesList[0],
            slug: product.slug,
            category: displayCategory
        });
        
        if (!isWishlisted) {
            toast.success(t('wishlist.added'));
        } else {
            toast.info(t('wishlist.removed'));
        }
    };

    const categoryObject = product.category;
    const displayCategory = (language === 'ar' && categoryObject?.nameAr 
        ? categoryObject.nameAr 
        : (categoryObject?.name || "Fashion")) as string;
    
    const displayTitle = (language === 'ar' && product.nameAr 
        ? product.nameAr 
        : product.name) as string;

    // Parse images
    let imagesList: string[] = [];
    try {
        if (product.images && typeof product.images === 'string' && product.images.trim().startsWith('[')) {
            imagesList = JSON.parse(product.images);
        } else if (product.images) {
            imagesList = product.images.split(',').map(img => img.trim());
        }
    } catch {
        // Fallback for non-JSON strings
        if (product.images) {
            imagesList = product.images.split(',').map(img => img.trim());
        }
    }

    if (imagesList.length === 0) {
        imagesList = ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"];
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stock <= 0) return;

        addItem({
            id: product.id,
            name: displayTitle,
            price: product.price,
            image: imagesList[0],
            quantity: 1,
            category: displayCategory,
            size: null,
            color: null
        });
        setIsAdded(true);
        
        toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart', {
            description: displayTitle,
            action: {
                label: "CHECKOUT",
                onClick: () => router.push("/checkout")
            },
            style: {
                background: 'rgba(32, 8, 11, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });

        setTimeout(() => setIsAdded(false), 2000);
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={cn("bg-transparent flex flex-col group relative overflow-hidden h-full border border-white/10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:border-white/30 rounded-[2px]", className)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
                <Link href={`/product/${product.slug || product.id}`} className="block h-full w-full relative group/image">
                    {/* Primary Image with Ken Burns Hover */}
                    <div className={cn(
                        "absolute inset-0 transition-transform duration-[3s] ease-out z-10",
                        imagesList.length > 1 ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-110"
                    )}>
                        <Image
                            src={imagesList[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Secondary Image */}
                    {imagesList.length > 1 && (
                        <div className="absolute inset-0 transition-all duration-[1.5s] ease-out opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 z-0">
                            <Image
                                src={imagesList[1]}
                                alt={`${product.name} - alternate`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Luxury Floating Frame Overlay - Ultra Minimal */}
                    <div className="absolute inset-0 border-[0.5px] border-white/0 group-hover:border-white/10 transition-all duration-1000 z-20 pointer-events-none m-4 rounded-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
                </Link>

                {/* Wishlist Icon - Premium Positioning */}
                <button 
                    onClick={toggleWishlist}
                    className={cn(
                        "absolute top-6 z-30 w-9 h-9 glass rounded-full flex items-center justify-center transition-all duration-1000 lg:opacity-0 lg:group-hover:opacity-100",
                        isWishlisted ? "bg-white text-rose-500 scale-110 opacity-100" : "text-white/40 hover:bg-white hover:text-[#0A0A0A] hover:scale-110",
                        language === 'ar' ? "left-6" : "right-6"
                    )}
                >
                    <Heart className={cn("w-[18px] h-[18px] stroke-[1.5]", isWishlisted && "fill-current")} />
                </button>

                <div className={cn("absolute top-4 z-30 flex flex-col gap-2", language === 'ar' ? "right-4 items-end" : "left-4 items-start")}>
                    {isOutOfStock && (
                        <div className="relative">
                            <span className="relative z-10 bg-black/60 backdrop-blur-md text-red-500 text-[9px] font-black tracking-[0.3em] uppercase px-3 py-1.5 border border-red-500/20 flex items-center gap-2 rounded-full">
                                <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                {language === 'ar' ? "نفذت الكمية" : "OUT OF STOCK"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className={cn(
                "flex flex-col flex-1 p-4 sm:p-5 space-y-3",
                language === 'ar' ? "text-right" : "text-left"
            )}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-black tracking-[0.4em] text-white/30 uppercase">
                        {displayCategory}
                    </span>

                    {/* Minimal Color Swatches */}
                    <div className="flex gap-1.5">
                        {(() => {
                            let colorList: Array<{ hex?: string; color?: string; name?: string }> = [];
                            try {
                                if (product.colors && typeof product.colors === 'string' && product.colors.startsWith('[')) {
                                    colorList = JSON.parse(product.colors);
                                }
                            } catch { }

                            return colorList.slice(0, 2).map((clr, i) => (
                                <div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full border border-zinc-100 shadow-sm"
                                    style={{ backgroundColor: clr.hex || clr.color || clr.name }}
                                />
                            ));
                        })()}
                    </div>
                </div>

                {/* Title */}
                <Link href={`/product/${product.slug || product.id}`} className="block">
                    <h3 className={cn(
                        "text-[18px] sm:text-[20px] text-white tracking-tight group-hover:text-white/70 transition-colors line-clamp-2 min-h-[44px] leading-snug",
                        language === 'ar' ? "font-sans font-black" : "font-serif"
                    )}>
                        {displayTitle}
                    </h3>
                </Link>

                {/* Footer Section */}
                <div className="pt-1 flex flex-col gap-4">
                    <div className="flex items-baseline justify-between gap-4">
                        <div className="flex flex-col">
                            {product.salePrice && product.salePrice > 0 && (
                                <span className="text-[14px] sm:text-[16px] text-white/30 line-through font-medium tracking-tight mb-0.5">
                                    {formatCurrency(product.salePrice)}
                                </span>
                            )}
                            <span className="text-white font-serif italic text-[26px] sm:text-[32px] tracking-tighter leading-none">
                                {formatCurrency(product.price)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded || isOutOfStock}
                        className={cn(
                            "w-full h-[60px] flex items-center justify-center gap-4 font-black text-[13px] tracking-[0.5em] uppercase transition-all duration-1000 relative overflow-hidden border rounded-[2px]",
                            isAdded ? "bg-white text-[#0A0A0A] border-white" : 
                            isOutOfStock ? "bg-red-950/20 text-red-500 border-red-500/30 cursor-not-allowed" :
                            "bg-[#111]/40 text-white border-white/10 hover:border-white/40 group/btn"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-4 transition-colors duration-1000 group-hover/btn:text-[#0A0A0A]">
                            {isAdded ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {t('product.addedShort')}
                                </motion.div>
                            ) : isOutOfStock ? (
                                <>
                                    {language === 'ar' ? "غير متوفر" : "OUT OF STOCK"}
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5 stroke-[1.2]" />
                                    {t('product.acquirePiece')}
                                </>
                            )}
                        </span>

                        {!isAdded && !isOutOfStock && (
                            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-1000 ease-[0.19,1,0.22,1]" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
