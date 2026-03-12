"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface ProductProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        image?: string;
        images?: string;
        category: any;
        specs?: string | null;
        colors?: string | null;
    }
    className?: string;
}

export function ProductCard({ product, className }: ProductProps) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const categoryName = typeof product.category === 'object'
        ? product.category?.name
        : (product.category || "Fashion");

    // Parse images
    let imagesList: string[] = [];
    try {
        if (product.images && typeof product.images === 'string' && product.images.startsWith('[')) {
            imagesList = JSON.parse(product.images);
        } else if (product.image) {
            imagesList = [product.image];
        } else if (product.images) {
            imagesList = product.images.split(',').map(img => img.trim());
        }
    } catch {
        imagesList = product.image ? [product.image] : [];
    }

    if (imagesList.length === 0) {
        imagesList = ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"];
    }

    const currentImage = imagesList[imageIndex];

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImageIndex((prev: number) => (prev + 1) % imagesList.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImageIndex((prev: number) => (prev - 1 + imagesList.length) % imagesList.length);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: currentImage,
            quantity: 1,
            category: categoryName,
            size: null,
            color: null
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className={cn("bg-white flex flex-col group relative overflow-hidden h-full border border-zinc-100 transition-all duration-300 hover:shadow-2xl", className)}>
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F9F9] p-2">
                <Link href={`/product/${product.slug}`} className="block h-full w-full relative rounded-md overflow-hidden">
                    <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        unoptimized
                    />
                </Link>
                
                {/* Wishlist Icon */}
                <button className="absolute top-4 right-4 z-20 p-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-[#555] transition-all">
                    <Heart className="w-4 h-4" />
                </button>

                {/* Gallery Navigation Arrows */}
                {imagesList.length > 1 && (
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button 
                            onClick={prevImage}
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white text-[#111111] shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white text-[#111111] shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 px-4 py-4 text-left">
                {/* Color Variants */}
                <div className="flex items-center gap-1.5 mb-3 min-h-[16px]">
                    {(() => {
                        let colorList: any[] = [];
                        try {
                            if (product.colors && typeof product.colors === 'string' && product.colors.startsWith('[')) {
                                colorList = JSON.parse(product.colors);
                            }
                        } catch (e) {
                            console.error("Error parsing colors", e);
                        }

                        if (colorList.length > 0) {
                            return (
                                <>
                                    {colorList.slice(0, 3).map((clr: any, idx: number) => (
                                        <div 
                                            key={idx} 
                                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                            style={{ backgroundColor: clr.hex || clr.color || clr.name }}
                                            title={clr.name}
                                        />
                                    ))}
                                    {colorList.length > 3 && (
                                        <span className="text-[11px] text-[#888] font-medium">+{colorList.length - 3} more</span>
                                    )}
                                </>
                            );
                        }
                        
                        // Default placeholders that match image 2 vibe
                        return (
                            <>
                                <div className="w-4 h-4 rounded-full bg-pink-100 border border-gray-100" />
                                <div className="w-4 h-4 rounded-full bg-yellow-100 border border-gray-100" />
                                <div className="w-4 h-4 rounded-full bg-blue-50 border border-gray-100" />
                                <span className="text-[11px] text-[#888] font-medium">+1 more</span>
                            </>
                        );
                    })()}
                </div>

                {/* Title */}
                <Link href={`/product/${product.slug}`} className="block mb-2">
                    <h3 className="font-sans font-bold text-[13px] text-[#111] uppercase tracking-wider line-clamp-2 leading-tight min-h-[32px]">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mb-5">
                    <span className="text-[#111] font-black text-[16px]">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Add To Cart Button - Minimalist Border Style */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                        "w-full h-[52px] flex items-center justify-center gap-3 font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-500 bg-white border border-[#111] text-[#111] hover:bg-black hover:text-white rounded-none",
                        isAdded && "bg-black text-white"
                    )}
                >
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    {isAdded ? "ADDED TO CART" : "ADD TO CART"}
                </button>
            </div>
        </div>
    );
}
