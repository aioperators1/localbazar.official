"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check, X, ChevronDown, Filter } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Category, Brand } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    brands?: Brand[];
}

const LUXURY_COLORS = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Gold", hex: "#D4AF37" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Burgundy", hex: "#800020" },
    { name: "Navy", hex: "#000080" },
];

export function MobileFilterDrawer({ isOpen, onClose, categories, brands = [] }: MobileFilterDrawerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    const currentCategory = searchParams.get("category");
    const currentBrand = searchParams.get("brand");
    const currentColor = searchParams.get("color");

    const [priceRange, setPriceRange] = useState([0, 5000]);

    useEffect(() => {
        const min = Number(searchParams.get("minPrice")) || 0;
        const max = Number(searchParams.get("maxPrice")) || 5000;
        setPriceRange([min, max]);
    }, [searchParams]);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    const updateColor = (colorName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get("color") === colorName) params.delete("color");
        else params.set("color", colorName);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        router.push(pathname);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isAr ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isAr ? "100%" : "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed top-0 bottom-0 w-[85%] max-w-sm bg-[#1A050A] z-[1001] lg:hidden shadow-2xl flex flex-col",
                            isAr ? "right-0" : "left-0"
                        )}
                        dir={isAr ? "rtl" : "ltr"}
                    >
                        {/* Header */}
                        <div className="p-8 flex justify-between items-start border-b border-white/5">
                            <div className="space-y-4">
                                <h2 className="text-[32px] font-black tracking-tight text-white uppercase italic">
                                    {t('shop.filters')}
                                </h2>
                                <div className="h-0.5 w-12 bg-white/40" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                            <Accordion type="multiple" defaultValue={["categories"]} className="w-full space-y-4">
                                {/* Collections */}
                                <AccordionItem value="categories" className="border-b border-white/5 pb-2">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">
                                            {t('shop.collections')}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="flex flex-col gap-4 pt-2">
                                            <button
                                                onClick={() => updateFilter("category", null)}
                                                className={cn(
                                                    "text-[15px] font-medium transition-all text-right",
                                                    !currentCategory ? "text-white" : "text-white/40"
                                                )}
                                            >
                                                {t('shop.allCollections')}
                                            </button>
                                            {categories.map((cat: Category) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => updateFilter("category", cat.slug)}
                                                    className={cn(
                                                        "text-[15px] font-medium transition-all text-right",
                                                        currentCategory === cat.slug ? "text-white" : "text-white/40"
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Brands */}
                                {brands.length > 0 && (
                                    <AccordionItem value="brands" className="border-b border-white/5 pb-2">
                                        <AccordionTrigger className="hover:no-underline py-4 text-white uppercase tracking-[0.2em] font-black text-[14px]">
                                            BRANDS
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6">
                                            <div className="flex flex-col gap-4 pt-2">
                                                <button
                                                    onClick={() => updateFilter("brand", null)}
                                                    className={cn(
                                                        "text-[15px] font-medium transition-all text-right",
                                                        !currentBrand ? "text-white" : "text-white/40"
                                                    )}
                                                >
                                                    All Brands
                                                </button>
                                                {brands.map((brand: Brand) => (
                                                    <button
                                                        key={brand.id}
                                                        onClick={() => updateFilter("brand", brand.slug)}
                                                        className={cn(
                                                            "text-[15px] font-medium transition-all text-right",
                                                            currentBrand === brand.slug ? "text-white" : "text-white/40"
                                                        )}
                                                    >
                                                        {brand.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                {/* Price */}
                                <AccordionItem value="price" className="border-b border-white/5 pb-2">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">
                                            {t('shop.price')}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-8 pt-6 px-2">
                                        <Slider
                                            defaultValue={[0, 5000]}
                                            value={priceRange}
                                            max={5000}
                                            step={50}
                                            onValueChange={setPriceRange}
                                            onValueCommit={(val: number[]) => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.set("minPrice", val[0].toString());
                                                params.set("maxPrice", val[1].toString());
                                                router.push(`${pathname}?${params.toString()}`);
                                            }}
                                        />
                                        <div className="flex justify-between mt-6 text-[13px] font-black text-white italic">
                                            <span>{priceRange[0]} QAR</span>
                                            <span>{priceRange[1]} QAR</span>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Color */}
                                <AccordionItem value="colors" className="border-b border-white/5 pb-2">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">
                                            {t('shop.color')}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {LUXURY_COLORS.map((color: {name: string, hex: string}) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => updateColor(color.name)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full border transition-all relative flex items-center justify-center",
                                                        currentColor === color.name 
                                                            ? "border-white scale-110 shadow-lg" 
                                                            : "border-white/10"
                                                    )}
                                                    style={{ backgroundColor: color.hex }}
                                                >
                                                    {currentColor === color.name && (
                                                        <Check className={cn(
                                                            "w-4 h-4",
                                                            color.name === "White" ? "text-black" : "text-white"
                                                        )} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 border-t border-white/5 bg-black/20 gap-4 flex flex-col">
                            <button
                                onClick={handleReset}
                                className="w-full h-14 border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                            >
                                {t('shop.reset')}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full h-14 bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all"
                            >
                                {t('common.apply') || "APPLY FILTERS"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
