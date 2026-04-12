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
import { useToast } from "@/components/ui/use-toast";

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
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<{ name: string, hex: string } | null>(null);
    const [activeSection, setActiveSection] = useState<string>("details");

    const displayTitle = language === 'ar' && product.nameAr ? product.nameAr : product.name;
    const displayDescription = language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
    const displayMaterials = language === 'ar' && product.materialsAr ? product.materialsAr : product.materials;
    const displayCare = language === 'ar' && product.careInstructionsAr ? product.careInstructionsAr : product.careInstructions;
    
    const categoryObject = product.category;
    const displayCategory = language === 'ar' && categoryObject?.nameAr 
        ? categoryObject.nameAr 
        : (categoryObject?.name || "Fashion");

    // Parse sizes and colors
    const sizes = product.sizes ? JSON.parse(product.sizes) : [];
    const colors = product.colors ? JSON.parse(product.colors) : [];

    useEffect(() => {
        if (colors.length > 0 && !selectedColor) {
            const timer = setTimeout(() => {
                setSelectedColor(colors[0]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [colors]);

    const handleBuyNow = () => {
        if (sizes.length > 0 && !selectedSize) {
            toast({
                title: t('product.selectSize'),
                variant: "destructive",
            });
            return;
        }
        addItem({
            id: product.id,
            name: displayTitle,
            price: Number(product.price),
            image: images[0],
            category: displayCategory,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor?.name
        });
        router.push("/checkout");
    };

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="bg-transparent min-h-screen pb-32 pt-6 text-white">
            <div className="container mx-auto px-4 lg:px-20 max-w-[1500px]">
                {/* Breadcrumbs - Minimalist */}
                <div className="flex items-center gap-2 mb-12 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                    <Link href="/" className="hover:text-white transition-all duration-500">{t('shop.breadcrumb.home')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-white/40", language === 'ar' && "rotate-180")} />
                    <Link href="/shop" className="hover:text-white transition-all duration-500">{t('shop.breadcrumb.shop')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-white/40", language === 'ar' && "rotate-180")} />
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
                        {/* Brand & Title */}
                        <div className="mb-10 text-center lg:text-left">
                            <span className="text-[13px] font-bold uppercase tracking-[0.4em] text-white/50 mb-4 block">
                                {product.brand || "LOCAL BAZAR COUTURE"}
                            </span>
                            <h1 className={cn(
                                "text-[32px] lg:text-[42px] font-black text-white leading-[1.1] tracking-tight mb-6",
                                language === 'ar' ? "font-sans text-right" : "font-serif"
                            )}>
                                {displayTitle}
                            </h1>
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <span className="text-[22px] lg:text-[26px] font-medium text-white">
                                    {formatCurrency(product.price)}
                                </span>
                            </div>
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="mb-10">
                                <span className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 block text-white/50">
                                    {t('product.color')}: <span className="text-white">{selectedColor?.name}</span>
                                </span>
                                <div className="flex gap-4">
                                    {colors.map((color: { name: string, hex: string }, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-white/20 p-0.5 transition-all duration-300",
                                                selectedColor?.name === color.name ? "ring-1 ring-white scale-110" : "hover:scale-105"
                                            )}
                                        >
                                            <div 
                                                className="w-full h-full rounded-full" 
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">{t('product.selectSize')}</span>
                                    <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-white/50 hover:text-white transition-colors">
                                        <Ruler className="w-3.5 h-3.5" />
                                        {t('product.sizeGuide')}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "min-w-12 h-12 border text-[11px] font-bold tracking-widest transition-all duration-300 flex items-center justify-center px-4",
                                                selectedSize === size 
                                                    ? "bg-white border-white text-[#592C2F]" 
                                                    : "bg-transparent border-white/20 text-white hover:border-white"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-white/20 h-16 w-32 px-4 shadow-sm">
                                    <button 
                                        onClick={decreaseQty}
                                        className="flex-1 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-black text-[14px]">{quantity}</span>
                                    <button 
                                        onClick={increaseQty}
                                        className="flex-1 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <AddToCart
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: Number(product.price),
                                        image: images[0],
                                        size: selectedSize,
                                        color: selectedColor?.name
                                    }}
                                    quantity={quantity}
                                    className="h-16 flex-1 bg-white text-[#592C2F] font-bold text-[12px] uppercase tracking-[0.4em] hover:bg-white/80 transition-all rounded-[1px] shadow-lg"
                                />
                            </div>
                            <button
                                onClick={handleBuyNow}
                                className="h-16 w-full bg-transparent border border-white/20 text-white font-bold text-[12px] uppercase tracking-[0.4em] hover:bg-white hover:text-[#592C2F] hover:border-white transition-all duration-500 rounded-[1px]"
                            >
                                {t('product.buyNow')}
                            </button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 border-b border-white/10 pb-10 mb-10">
                            <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
                                <Heart className="w-4 h-4" />
                                {t('product.wishlist')}
                            </button>
                            <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
                                <Share2 className="w-4 h-4" />
                                {t('product.share')}
                            </button>
                        </div>

                        {/* Accordion Details */}
                        <div className="space-y-6">
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
                                title={t('product.care')} 
                                isOpen={activeSection === "care"}
                                onClick={() => setActiveSection(activeSection === "care" ? "" : "care")}
                            >
                                <p className={cn(
                                    "text-[13px] text-white/70 leading-relaxed font-medium capitalize first-letter:uppercase",
                                    language === 'ar' && "text-right font-sans text-[15px]"
                                )}>
                                    {displayCare || (language === 'ar' ? "يوصى بالتنظيف الجاف للمحافظة على جودة المنتج." : "Professional cleaning recommended to preserve fabric quality.")}
                                </p>
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
