"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
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

interface ShopSidebarProps {
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

export function ShopSidebar({ categories, brands = [] }: ShopSidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { t } = useLanguage();
    const currentCategory = searchParams.get("category");
    const currentBrand = searchParams.get("brand");
    const currentColor = searchParams.get("color");

    const [priceRange, setPriceRange] = useState([0, 5000]);

    useEffect(() => {
        const min = Number(searchParams.get("minPrice")) || 0;
        const max = Number(searchParams.get("maxPrice")) || 5000;
        const timer = setTimeout(() => {
            setPriceRange([min, max]);
        }, 0);
        return () => clearTimeout(timer);
    }, [searchParams]);

    const updateCategory = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) params.set("category", slug);
        else params.delete("category");
        router.push(`${pathname}?${params.toString()}`);
    };

    const updateBrand = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) params.set("brand", slug);
        else params.delete("brand");
        router.push(`${pathname}?${params.toString()}`);
    };

    const updateColor = (colorName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get("color") === colorName) params.delete("color");
        else params.set("color", colorName);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <aside className="w-full hidden lg:block sticky top-32">
            <div className="space-y-8">
                <div>
                    <h2 className="text-[20px] font-serif font-black tracking-tight text-white mb-6">{t('shop.filters')}</h2>
                    <div className="h-0.5 w-8 bg-white/50 mb-8" />
                </div>

                <Accordion type="multiple" defaultValue={["categories", "brands", "price", "colors"]} className="w-full space-y-2">
                    {/* Categories */}
                    <AccordionItem value="categories" className="border-b border-white/10">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em]">{t('shop.collections')}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => updateCategory(null)}
                                        className={cn(
                                            "text-[13px] transition-all duration-300 hover:pl-2",
                                            !currentCategory ? "font-bold text-white" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        {t('shop.allCollections')}
                                    </button>
                                </li>
                                {categories.map((cat: Category) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => updateCategory(cat.slug)}
                                            className={cn(
                                                "text-[13px] transition-all duration-300 hover:pl-2 text-left",
                                                currentCategory === cat.slug ? "font-bold text-white" : "text-white/60 hover:text-white"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Brands */}
                    {brands && brands.length > 0 && (
                        <AccordionItem value="brands" className="border-b border-white/10">
                            <AccordionTrigger className="hover:no-underline py-4 group">
                                <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em]">Brands</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() => updateBrand(null)}
                                            className={cn(
                                                "text-[13px] transition-all duration-300 hover:pl-2 text-left",
                                                !currentBrand ? "font-bold text-white" : "text-white/60 hover:text-white"
                                            )}
                                        >
                                            All Brands
                                        </button>
                                    </li>
                                    {brands.map((brand: Brand) => (
                                        <li key={brand.id}>
                                            <button
                                                onClick={() => updateBrand(brand.slug)}
                                                className={cn(
                                                    "text-[13px] transition-all duration-300 hover:pl-2 text-left",
                                                    currentBrand === brand.slug ? "font-bold text-white" : "text-white/60 hover:text-white"
                                                )}
                                            >
                                                {brand.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Price */}
                    <AccordionItem value="price" className="border-b border-white/10">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em]">{t('shop.price')}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8 pt-4">
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
                            <div className="flex justify-between mt-6 text-[12px] font-bold text-white">
                                <span>{priceRange[0]} QAR</span>
                                <span>{priceRange[1]} QAR</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Colors - Visual Swatches */}
                    <AccordionItem value="colors" className="border-b border-white/10">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em]">{t('shop.color')}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                            <div className="flex flex-wrap gap-3 pt-2">
                                {LUXURY_COLORS.map((color: {name: string, hex: string}) => (
                                    <button
                                        key={color.name}
                                        onClick={() => updateColor(color.name)}
                                        title={color.name}
                                        className={cn(
                                            "w-7 h-7 rounded-full border border-[#E3E3E3] transition-all duration-300 relative",
                                            currentColor === color.name ? "ring-2 ring-black ring-offset-2 scale-110" : "hover:scale-110"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {currentColor === color.name && (
                                            <Check className={cn(
                                                "w-3 h-3 absolute inset-0 m-auto",
                                                color.name === "White" ? "text-black" : "text-white"
                                            )} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                {/* Reset Filters */}
                <button 
                    onClick={() => router.push(pathname)}
                    className="text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:underline pt-4"
                >
                    {t('shop.reset')}
                </button>
            </div>
        </aside>
    );
}
