"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface ShopHeaderProps {
    categoryName: string;
    slug?: string;
    productCount: number;
}

export function ShopHeader({ categoryName, slug, productCount }: ShopHeaderProps) {
    const { t, isAr } = useLanguage();

    // Resolve Title
    const title = slug
        ? t(`cat.${slug}` as Parameters<typeof t>[0])
        : (categoryName === "Full Catalogue" ? "All Products" : categoryName);

    // Fallback if translation returns key
    const displayTitle = title.startsWith("cat.") ? categoryName : title;

    return (
        <div className="flex items-center gap-4">
            <h1 className={cn(
                "text-3xl font-bold text-[#592C2F] capitalize tracking-tight",
                isAr && "font-sans leading-tight tracking-normal"
            )}>
                {displayTitle}
            </h1>
        </div>
    );
}
