"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
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
    }
    className?: string;
}

export function ProductCard({ product, className }: ProductProps) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const categoryName = typeof product.category === 'object'
        ? product.category?.name
        : (product.category || "Fashion");

    let mainImage = product.image || product.images;
    try {
        if (mainImage && typeof mainImage === 'string' && mainImage.startsWith('[')) {
            const parsed = JSON.parse(mainImage);
            mainImage = parsed[0];
        }
    } catch { }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: mainImage || "",
            quantity: 1,
            category: categoryName,
            size: null,
            color: null
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className={cn("bg-white flex flex-col group relative overflow-hidden h-full border border-[#E3E3E3]/50 hover:border-brand-burgundy/20 hover:shadow-2xl transition-all duration-700", className)}>
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-brand-beige/20">
                <Image
                    src={mainImage || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    unoptimized
                />
                
                {/* Branding Accent */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-brand-burgundy text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        NEW SEASON
                    </div>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={cn(
                            "w-full h-12 flex items-center justify-center font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 bg-white shadow-xl text-[#111111] hover:bg-brand-burgundy hover:text-white rounded-full",
                            isAdded && "bg-brand-burgundy text-white"
                        )}
                    >
                        {isAdded ? "AJOUTÉ AU PANIER" : "ACQUISITION RAPIDE"}
                    </button>
                </div>
            </Link>

            {/* Content Container */}
            <div className="flex flex-col items-center flex-1 px-6 py-8 text-center bg-white">
                {/* Category Ref */}
                <span className="text-[9px] text-brand-burgundy font-black uppercase tracking-[0.4em] mb-4 opacity-70">
                    {categoryName}
                </span>

                {/* Title */}
                <Link href={`/product/${product.slug}`} className="block mb-3">
                    <h3 className="font-serif italic text-lg text-[#111111] hover:text-brand-burgundy line-clamp-2 leading-tight transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-auto pt-2">
                    <span className="text-[#111111] font-black text-[16px] tracking-tighter italic">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
