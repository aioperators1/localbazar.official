"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCart } from "@/components/store/AddToCart";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductCarousel } from "@/components/store/ProductCarousel";
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart, Share2, Ruler, Info, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";

import { Product, Category } from "@/lib/types";

interface ProductPageClientProps {
    product: Product;
    images: string[];
    similarProducts?: Product[];
}

export default function ProductPageClient({ product, images, similarProducts }: ProductPageClientProps) {
    const router = useRouter();
    const addItem = useCart(state => state.addItem);
    const { formatPrice: formatCurrency } = useCurrency();
    const { t, language } = useLanguage();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<{ name: string, hex: string } | null>(null);
    const [activeSection, setActiveSection] = useState<string>("details");

    const displayTitle = language === 'ar' && product.nameAr ? product.nameAr : product.name;
    const displayDescription = language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
    const displayMaterials = language === 'ar' && product.materialsAr ? product.materialsAr : product.materials;

    
    const categoryObject = product.category;
    const displayCategory = language === 'ar' && categoryObject?.nameAr 
        ? categoryObject.nameAr 
        : (categoryObject?.name || "Fashion");

    // Parse sizes and colors with backward compatibility and safety
    const safeParse = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object') return [data];
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const rawSizes = safeParse(product.sizes);
    const sizes = rawSizes.map((s: any) => 
        typeof s === 'string' ? { name: s, price: null } : s
    );
    const rawColors = safeParse(product.colors);
    const colors = rawColors;

    const [currentPrice, setCurrentPrice] = useState<number>(Number(product.price));

    useEffect(() => {
        if (selectedSize) {
            const sizeObj = sizes.find((s: any) => s.name === selectedSize);
            if (sizeObj && sizeObj.price) {
                setCurrentPrice(sizeObj.price);
            } else {
                setCurrentPrice(Number(product.price));
            }
        } else {
            setCurrentPrice(Number(product.price));
        }
    }, [selectedSize, sizes, product.price]);

    useEffect(() => {
        if (colors.length > 0 && !selectedColor) {
            const timer = setTimeout(() => {
                setSelectedColor(colors[0]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [colors]);

    const isOutOfStock = product.stock <= 0;

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        if (sizes.length > 0 && !selectedSize) {
            toast.error(t('product.selectSize'));
            return;
        }
        addItem({
            id: product.id,
            name: displayTitle,
            price: currentPrice,
            image: images[0],
            category: displayCategory,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor?.name
        });
        router.push("/checkout");
    };

    const { toggleItem, isInWishlist } = useWishlist();

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: displayTitle,
                    text: displayDescription?.replace(/<[^>]*>?/gm, '').slice(0, 100),
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t('common.copiedToClipboard') || "Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const handleToggleWishlist = () => {
        const isCurrentlyInWishlist = isInWishlist(product.id);
        
        toggleItem({
            id: product.id,
            name: displayTitle,
            price: Number(product.price),
            image: images[0],
            slug: product.slug,
            category: displayCategory
        });
        
        if (isCurrentlyInWishlist) {
            toast.success(t('product.removedFromWishlist') || "Removed from wishlist");
        } else {
            toast.success(t('product.addedToWishlist') || "Added to wishlist");
        }
    };

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-transparent min-h-screen pb-32 pt-6 text-white">
            <div className="container mx-auto px-4 lg:px-20 max-w-[1500px]">
                {/* Breadcrumbs - Minimalist */}
                <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-3 mb-8 lg:mb-12 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/50">
                    <Link href="/" className="hover:text-white transition-all duration-500 whitespace-nowrap">{t('shop.breadcrumb.home')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-white/40 flex-shrink-0", language === 'ar' && "rotate-180")} />
                    <Link href="/shop" className="hover:text-white transition-all duration-500 whitespace-nowrap">{t('shop.breadcrumb.shop')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-white/40 flex-shrink-0", language === 'ar' && "rotate-180")} />
                    <span className="text-white font-black">{displayCategory}</span>
                </div>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    
                    {/* LEFT COLUMN: Premium Gallery */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={images} name={product.name} />
                    </div>

                    {/* RIGHT COLUMN: Product Info */}
                    <div className="lg:col-span-5 flex flex-col">
                        {/* Brand, Title & Price Block */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mb-6 shadow-2xl backdrop-blur-xl">
                            <div className="text-center">

                                <h1 className="text-[28px] lg:text-[38px] font-black text-white leading-[1.2] tracking-tight mb-6">
                                    {displayTitle}
                                </h1>
                                <div className="flex flex-col items-center justify-center gap-1">
                                    {product.salePrice && product.salePrice > 0 && (
                                        <span className="text-[16px] lg:text-[18px] text-white/40 line-through font-medium tracking-tight">
                                            {formatCurrency(product.salePrice)}
                                        </span>
                                    )}
                                    <span className="text-[26px] lg:text-[32px] !font-sans font-medium text-white tracking-tight">
                                        {formatCurrency(currentPrice)}
                                    </span>
                                </div>
                            </div>
                            {isOutOfStock && (
                                <div className="mt-6 flex justify-center border-t border-white/5 pt-6">
                                    <div className="relative group">
                                        <span className="relative z-10 bg-black/60 backdrop-blur-xl text-red-500 text-[10px] font-black tracking-[0.4em] uppercase px-5 py-2 border border-red-500/20 flex items-center gap-2 rounded-full shadow-xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            {language === 'ar' ? "نفذت الكمية" : "OUT OF STOCK"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selectors Block (Colors & Sizes) */}
                        {(colors.length > 0 || sizes.length > 0) && (
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mb-6 shadow-2xl backdrop-blur-xl">
                                {/* Color Selection */}
                                {colors.length > 0 && (
                                    <div className={cn(sizes.length > 0 ? "border-b border-white/10 pb-6 mb-6" : "")}>
                                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 block text-white/50">
                                            {t('product.color')}: <span className="text-white">{selectedColor?.name}</span>
                                        </span>
                                        <div className="flex gap-4">
                                            {colors.map((color: { name: string, hex: string }, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full border border-white/20 p-0.5 transition-all duration-300",
                                                        selectedColor?.name === color.name ? "ring-2 ring-white scale-110" : "hover:scale-105"
                                                    )}
                                                >
                                                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Selection */}
                                {sizes.length > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">{t('product.selectSize')}</span>
                                            <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-white/50 hover:text-white transition-colors">
                                                <Ruler className="w-3.5 h-3.5" />
                                                {t('product.sizeGuide')}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {sizes.map((size: { name: string, price: number | null }) => (
                                                <button
                                                    key={size.name}
                                                    onClick={() => setSelectedSize(size.name)}
                                                    className={cn(
                                                        "min-w-14 h-12 rounded-xl border text-[12px] font-bold tracking-widest transition-all duration-300 flex flex-col items-center justify-center px-4",
                                                        selectedSize === size.name 
                                                            ? "bg-white border-white text-black shadow-lg scale-105" 
                                                            : "bg-transparent border-white/20 text-white hover:border-white/50"
                                                    )}
                                                >
                                                    <span>{size.name}</span>
                                                    {size.price && size.price > 0 && (
                                                        <span className={cn(
                                                            "text-[9px] font-bold opacity-60",
                                                            selectedSize === size.name ? "text-black" : "text-emerald-400"
                                                        )}>
                                                            {formatCurrency(size.price)}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions Block */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mb-6 shadow-2xl backdrop-blur-xl space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "flex items-center border border-white/10 bg-black/20 rounded-2xl h-14 w-32 px-2 shadow-inner transition-opacity",
                                    isOutOfStock && "opacity-20 pointer-events-none"
                                )}>
                                    <button onClick={decreaseQty} className="flex-1 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-black text-[15px]">{quantity}</span>
                                    <button onClick={increaseQty} className="flex-1 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <AddToCart
                                    disabled={isOutOfStock}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: currentPrice,
                                        image: images[0],
                                        size: selectedSize,
                                        color: selectedColor?.name
                                    }}
                                    quantity={quantity}
                                    className={cn(
                                        "h-14 flex-1 font-bold text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all duration-300",
                                        isOutOfStock 
                                            ? "bg-red-950/20 text-red-500 border border-red-500/30 cursor-not-allowed"
                                            : "bg-white text-black hover:scale-[1.02] active:scale-95"
                                    )}
                                />
                            </div>
                            <button
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className={cn(
                                    "h-14 w-full font-bold text-[12px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-300 shadow-lg",
                                    isOutOfStock
                                        ? "bg-red-950/10 text-red-800 border border-red-900/20 cursor-not-allowed"
                                        : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black"
                                )}
                            >
                                {isOutOfStock ? (language === 'ar' ? "نفذت الكمية" : "OUT OF STOCK") : t('product.buyNow')}
                            </button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 border-b border-white/10 pb-10 mb-10">
                            <button 
                                onClick={handleToggleWishlist}
                                className={cn(
                                    "flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
                                    isInWishlist(product.id) ? "text-brand-burgundy" : "text-white/50 hover:text-white"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-brand-burgundy")} />
                                {t('product.wishlist')}
                            </button>
                            <button 
                                onClick={handleShare}
                                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                {t('product.share')}
                            </button>
                        </div>

                        {/* Accordion Details Block */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                            <AccordionItem 
                                title={t('product.description')} 
                                isOpen={activeSection === "details"}
                                onClick={() => setActiveSection(activeSection === "details" ? "" : "details")}
                            >
                                <div className={cn(
                                    "space-y-4 text-[13px] text-white/70 leading-relaxed font-medium",
                                    language === 'ar' && "text-right font-sans text-[15px]"
                                )}>
                                    <div dangerouslySetInnerHTML={{ __html: displayDescription }} />
                                    {displayMaterials && (
                                        <p><strong className="text-white lowercase first-letter:uppercase font-bold">{t('product.material')}:</strong> {displayMaterials}</p>
                                    )}
                                    <p><strong className="text-white lowercase first-letter:uppercase font-bold">{t('product.season')}:</strong> New Collection {new Date().getFullYear()}</p>
                                    <p><strong className="text-white lowercase first-letter:uppercase font-bold">{t('product.reference')}:</strong> {product.id?.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </AccordionItem>



                            <AccordionItem 
                                title={t('product.shipping')} 
                                isOpen={activeSection === "shipping"}
                                onClick={() => setActiveSection(activeSection === "shipping" ? "" : "shipping")}
                            >
                                <ul className="text-[13px] text-white/70 leading-relaxed font-medium space-y-2">
                                    <li className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-white" />
                                        <span>{t('footer.trust.delivery.title')} — Qatar Wide</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-white" />
                                        <span>{t('footer.trust.warranty.title')}</span>
                                    </li>
                                </ul>
                            </AccordionItem>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section */}
                {similarProducts && similarProducts.length > 0 && (
                    <div className="mt-32 pt-24 border-t border-white/10">
                        <div className="text-center mb-16">
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/50 mb-4 block">{t('product.suggestions')}</span>
                            <h2 className="text-[28px] lg:text-[36px] font-black text-white font-serif uppercase tracking-tight">{t('product.youMayLike')}</h2>
                        </div>
                        <ProductCarousel products={similarProducts} />
                    </div>
                )}
            </div>
        </div>
    );
}

function AccordionItem({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) {
    return (
        <div className="border-b border-white/10 last:border-0 pb-6">
            <button 
                onClick={onClick}
                className="w-full flex justify-between items-center text-[13px] font-bold uppercase tracking-[0.2em] text-white py-2 hover:opacity-70 transition-opacity"
            >
                {title}
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
