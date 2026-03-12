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
import { cn, formatPrice } from "@/lib/utils";

interface ProductPageClientProps {
    product: any;
    images: string[];
    similarProducts?: any[];
}

export default function ProductPageClient({ product, images, similarProducts }: ProductPageClientProps) {
    const router = useRouter();
    const addItem = useCart(state => state.addItem);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<string>("details");

    const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

    // Parse sizes and colors
    const sizes = product.sizes ? JSON.parse(product.sizes) : [];
    const colors = product.colors ? JSON.parse(product.colors) : [];

    useEffect(() => {
        if (colors.length > 0 && !selectedColor) {
            setSelectedColor(colors[0]);
        }
    }, [colors]);

    const handleBuyNow = () => {
        if (sizes.length > 0 && !selectedSize) {
            alert("Please select a size");
            return;
        }
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: images[0],
            category: categoryName || "Fashion",
            quantity: quantity,
            size: selectedSize,
            color: selectedColor?.name
        });
        router.push("/checkout");
    };

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="bg-white min-h-screen pb-32 pt-6 text-[#111111]">
            <div className="container mx-auto px-4 lg:px-20 max-w-[1500px]">
                {/* Breadcrumbs - Minimalist */}
                <div className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/shop" className="hover:text-[#111111] transition-colors">Collections</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#111111]">{categoryName}</span>
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
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4 block">
                                {product.brand || "LOCAL BAZAR COUTURE"}
                            </span>
                            <h1 className="text-[32px] lg:text-[42px] font-black text-[#111111] leading-[1.1] tracking-tight font-serif mb-6">
                                {product.name}
                            </h1>
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <span className="text-[22px] lg:text-[26px] font-medium text-[#111111]">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="mb-10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block text-zinc-500">
                                    Color: <span className="text-[#111111]">{selectedColor?.name}</span>
                                </span>
                                <div className="flex gap-4">
                                    {colors.map((color: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-zinc-200 p-0.5 transition-all duration-300",
                                                selectedColor?.name === color.name ? "ring-1 ring-[#111111] scale-110" : "hover:scale-105"
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
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Select Size</span>
                                    <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-[#111111] transition-colors">
                                        <Ruler className="w-3.5 h-3.5" />
                                        Size Guide
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
                                                    ? "bg-[#111111] border-[#111111] text-white" 
                                                    : "bg-white border-zinc-200 text-[#111111] hover:border-[#111111]"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4 mb-12">
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
                                className="h-16 w-full bg-[#111111] text-white font-bold text-[12px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all rounded-none"
                            />
                            <button
                                onClick={handleBuyNow}
                                className="h-16 w-full bg-white border border-[#111111] text-[#111111] font-bold text-[12px] uppercase tracking-[0.3em] hover:bg-[#111111] hover:text-white transition-all rounded-none"
                            >
                                Buy It Now
                            </button>
                        </div>

                        {/* Product Utility Links */}
                        <div className="flex items-center justify-center lg:justify-start gap-8 border-b border-zinc-100 pb-10 mb-10">
                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-[#111111] transition-colors">
                                <Heart className="w-4 h-4" />
                                Wishlist
                            </button>
                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-[#111111] transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        {/* Accordion Details */}
                        <div className="space-y-6">
                            <AccordionItem 
                                title="Description & Details" 
                                isOpen={activeSection === "details"}
                                onClick={() => setActiveSection(activeSection === "details" ? "" : "details")}
                            >
                                <div className="space-y-4 text-[13px] text-zinc-600 leading-relaxed font-medium">
                                    <p>{product.description}</p>
                                    {product.materials && (
                                        <p><strong className="text-[#111111] lowercase first-letter:uppercase font-bold">Material:</strong> {product.materials}</p>
                                    )}
                                    <p><strong className="text-[#111111] lowercase first-letter:uppercase font-bold">Season:</strong> New Collection {new Date().getFullYear()}</p>
                                    <p><strong className="text-[#111111] lowercase first-letter:uppercase font-bold">Reference:</strong> {product.id?.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </AccordionItem>

                            <AccordionItem 
                                title="Care Instructions" 
                                isOpen={activeSection === "care"}
                                onClick={() => setActiveSection(activeSection === "care" ? "" : "care")}
                            >
                                <p className="text-[13px] text-zinc-600 leading-relaxed font-medium capitalize first-letter:uppercase">
                                    {product.careInstructions || "Professional cleaning recommended to preserve fabric quality."}
                                </p>
                            </AccordionItem>

                            <AccordionItem 
                                title="Shipping & Returns" 
                                isOpen={activeSection === "shipping"}
                                onClick={() => setActiveSection(activeSection === "shipping" ? "" : "shipping")}
                            >
                                <ul className="text-[13px] text-zinc-600 leading-relaxed font-medium space-y-2">
                                    <li className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-[#111111]" />
                                        <span>Free express shipping to Qatar</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-[#111111]" />
                                        <span>Free returns within 7 days</span>
                                    </li>
                                </ul>
                            </AccordionItem>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section */}
                {similarProducts && similarProducts.length > 0 && (
                    <div className="mt-32 pt-24 border-t border-zinc-100">
                        <div className="text-center mb-16">
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4 block">Suggestions</span>
                            <h2 className="text-[28px] lg:text-[36px] font-black text-[#111111] font-serif uppercase tracking-tight">You May Also Like</h2>
                        </div>
                        <ProductCarousel products={similarProducts} title="" />
                    </div>
                )}
            </div>
        </div>
    );
}

function AccordionItem({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) {
    return (
        <div className="border-b border-zinc-100 last:border-0 pb-6">
            <button 
                onClick={onClick}
                className="w-full flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] py-2 hover:opacity-70 transition-opacity"
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
