"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface Category {
    id: string;
    slug: string;
    name: string;
    [key: string]: unknown;
}

interface ShopSidebarProps {
    categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t, isAr } = useLanguage();

    const currentCategory = searchParams.get("category");
    const currentFilter = searchParams.get("filter");

    // Price Range State
    const [priceRange, setPriceRange] = useState([0, 75000]);

    // Initialize from URL
    useEffect(() => {
        const min = Number(searchParams.get("minPrice")) || 0;
        const max = Number(searchParams.get("maxPrice")) || 75000;
        if (min !== priceRange[0] || max !== priceRange[1]) {
            setPriceRange([min, max]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const commitPriceChange = (value: number[]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", value[0].toString());
        params.set("maxPrice", value[1].toString());

        // Reset page if needed (not implemented yet, but good practice)
        // params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const updateCategory = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set("category", slug);
        } else {
            params.delete("category");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const updateFilter = (filterKey: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get("filter") === filterKey) {
            params.delete("filter");
        } else {
            params.set("filter", filterKey);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <aside className="w-full hidden lg:block">
            <div className="bg-white p-6 shadow-sm border border-zinc-100 rounded-[4px]">
                <h3 className="text-[#592C2F] text-[17px] font-bold mb-6">Filtres</h3>

                <Accordion type="multiple" defaultValue={["categories", "price"]} className="w-full space-y-4">
                    {/* Categories Section */}
                    <AccordionItem value="categories" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-[12px] font-bold text-[#592C2F] uppercase tracking-wide group flex justify-between">
                            <span className={`text-left`}>Catégories</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-2">
                            <ul className="space-y-3 pl-1">
                                <li className="text-[13px]">
                                    <button
                                        onClick={() => updateCategory(null)}
                                        className={cn("flex items-center gap-2 hover:text-[#592C2F] transition-colors w-full text-left font-medium", !currentCategory ? "text-[#592C2F] font-bold" : "text-zinc-600")}
                                    >
                                        <div className={cn("w-3 h-3 border rounded-sm flex-shrink-0 flex items-center justify-center transition-colors", !currentCategory ? "border-[#592C2F] bg-[#592C2F]" : "border-zinc-300")}>
                                            {!currentCategory && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        {t("shop.title.fullCatalogue")}
                                    </button>
                                </li>
                                {categories.map((cat) => {
                                    const isActive = currentCategory === cat.slug;
                                    return (
                                        <li key={cat.id} className="text-[13px]">
                                            <button
                                                onClick={() => updateCategory(cat.slug)}
                                                className={cn("flex items-center gap-2 hover:text-[#592C2F] transition-colors w-full text-left font-medium", isActive ? "text-[#592C2F] font-bold" : "text-zinc-600")}
                                            >
                                                <div className={cn("w-3 h-3 border rounded-sm flex-shrink-0 flex items-center justify-center transition-colors", isActive ? "border-[#592C2F] bg-[#592C2F]" : "border-zinc-300")}>
                                                    {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                                                </div>
                                                {cat.name}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <div className="w-full h-px bg-zinc-100 my-2" />

                    {/* Stock Status */}
                    <AccordionItem value="stock" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-[12px] font-bold text-[#592C2F] uppercase tracking-wide">
                            <span className="text-left">Disponibilité</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-3 pl-1">
                                <button
                                    onClick={() => updateFilter("instock")}
                                    className="flex items-center gap-2 hover:text-[#592C2F] transition-colors w-full text-left font-medium text-[13px] text-zinc-600"
                                >
                                    <div className={cn("w-3 h-3 border rounded-sm flex-shrink-0 flex items-center justify-center transition-colors", currentFilter === "instock" ? "border-[#592C2F] bg-[#592C2F]" : "border-zinc-300")}>
                                        {currentFilter === "instock" && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className={cn(currentFilter === "instock" && "text-[#592C2F] font-bold")}>En stock</span>
                                </button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <div className="w-full h-px bg-zinc-100 my-2" />

                    {/* Price Range */}
                    <AccordionItem value="price" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-[12px] font-bold text-[#592C2F] uppercase tracking-wide flex justify-between">
                            <span className="text-left">Prix</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-4 px-1">
                            <div className="space-y-6">
                                <Slider
                                    defaultValue={[0, 75000]}
                                    value={priceRange}
                                    max={75000}
                                    step={50}
                                    minStepsBetweenThumbs={1}
                                    onValueChange={handlePriceChange}
                                    onValueCommit={commitPriceChange}
                                    className="py-1"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white border border-zinc-200 rounded-[3px] flex items-center px-3 py-2">
                                        <input
                                            type="text"
                                            value={priceRange[0]}
                                            className="w-full bg-transparent text-[13px] font-medium focus:outline-none text-zinc-900"
                                            readOnly
                                        />
                                        <span className="text-[11px] text-zinc-500 font-bold ml-1">QAR</span>
                                    </div>
                                    <span className="text-zinc-400">-</span>
                                    <div className="flex-1 bg-white border border-zinc-200 rounded-[3px] flex items-center px-3 py-2">
                                        <input
                                            type="text"
                                            value={priceRange[1]}
                                            className="w-full bg-transparent text-[13px] font-medium focus:outline-none text-zinc-900"
                                            readOnly
                                        />
                                        <span className="text-[11px] text-zinc-500 font-bold ml-1">QAR</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </aside>
    );
}
