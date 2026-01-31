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
        <aside className="w-full lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-32 space-y-6">
                {/* 🏳️‍🌈 PRO SIDEBAR CONTAINER (Solid High Contrast) */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[24px] overflow-hidden shadow-lg transition-all duration-300">
                    <Accordion type="multiple" defaultValue={["categories", "stock", "price"]} className="w-full">

                        {/* Categories Section */}
                        <AccordionItem value="categories" className="border-b border-border/50 px-6">
                            <AccordionTrigger className="hover:no-underline py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors group">
                                <span className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>{t("shop.sidebar.classification")}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <div className="space-y-1">
                                    {/* All Products Option */}
                                    <div
                                        className="flex items-center gap-4 group/item cursor-pointer py-2"
                                        onClick={() => updateCategory(null)}
                                    >
                                        <div className="relative flex items-center justify-center w-5 h-5">
                                            <div
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                    !currentCategory
                                                        ? "bg-blue-600 scale-150"
                                                        : "bg-zinc-300 dark:bg-zinc-700 group-hover/item:bg-zinc-400"
                                                )}
                                            />
                                        </div>
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-all duration-300", !currentCategory ? "text-blue-600" : "text-zinc-500 group-hover/item:text-foreground")}>
                                            {t("shop.title.fullCatalogue")}
                                        </span>
                                    </div>

                                    {/* Mapped Categories */}
                                    {categories.map((cat) => {
                                        const isActive = currentCategory === cat.slug;
                                        return (
                                            <div key={cat.id} className="space-y-1">
                                                <div
                                                    className="flex items-center gap-4 group/item cursor-pointer py-2"
                                                    onClick={() => updateCategory(cat.slug)}
                                                >
                                                    <div className="relative flex items-center justify-center w-5 h-5">
                                                        <div
                                                            className={cn(
                                                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                                isActive
                                                                    ? "bg-blue-600 scale-150"
                                                                    : "bg-zinc-300 dark:bg-zinc-700 group-hover/item:bg-zinc-400"
                                                            )}
                                                        />
                                                    </div>
                                                    <span
                                                        className={cn("text-[10px] font-black uppercase tracking-widest transition-all duration-300", isActive ? "text-blue-600" : "text-zinc-500 group-hover/item:text-foreground")}
                                                    >
                                                        {cat.name}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Stock Status */}
                        <AccordionItem value="stock" className="border-b border-border/50 px-6">
                            <AccordionTrigger className="hover:no-underline py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors">
                                <span className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>{t("shop.sidebar.allocationStatus")}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <div className="space-y-1">
                                    <div
                                        onClick={() => updateFilter("instock")}
                                        className="flex items-center gap-4 group/item cursor-pointer py-2"
                                    >
                                        <div className="relative flex items-center justify-center w-5 h-5">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                currentFilter === "instock"
                                                    ? "bg-emerald-500"
                                                    : "bg-zinc-300 dark:bg-zinc-700 group-hover/item:bg-zinc-400"
                                            )} />
                                        </div>
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-all duration-300", currentFilter === "instock" ? "text-emerald-500" : "text-zinc-500 group-hover/item:text-foreground")}>
                                            {t("shop.sidebar.readyForDispatch")}
                                        </span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Price Range */}
                        <AccordionItem value="price" className="px-6 border-none">
                            <AccordionTrigger className="hover:no-underline py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors">
                                <span className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>{t("shop.sidebar.valueRange")}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-8">
                                <div className="space-y-8">
                                    <Slider
                                        defaultValue={[0, 75000]}
                                        value={priceRange}
                                        max={75000}
                                        step={500}
                                        minStepsBetweenThumbs={1}
                                        onValueChange={handlePriceChange}
                                        onValueCommit={commitPriceChange}
                                        className="py-4"
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-muted/40 border border-border rounded-lg flex items-center px-4 py-3">
                                            <span className="text-[8px] text-muted-foreground font-black mr-2">MAD</span>
                                            <input
                                                type="text"
                                                value={priceRange[0].toLocaleString()}
                                                className="w-full bg-transparent text-xs font-mono focus:outline-none text-right text-foreground font-bold"
                                                readOnly
                                            />
                                        </div>
                                        <div className="w-4 h-[1px] bg-border" />
                                        <div className="flex-1 bg-muted/40 border border-border rounded-lg flex items-center px-4 py-3">
                                            <span className="text-[8px] text-muted-foreground font-black mr-2">MAD</span>
                                            <input
                                                type="text"
                                                value={priceRange[1].toLocaleString()}
                                                className="w-full bg-transparent text-xs font-mono focus:outline-none text-right text-foreground font-bold"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="p-8 rounded-[24px] bg-muted/30 border border-border text-center relative overflow-hidden">
                    <p className="text-[8px] font-black text-primary mb-3 uppercase tracking-[0.4em]">{t("shop.sidebar.protocolSupport")}</p>
                    <p className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest leading-relaxed">{t("shop.sidebar.speakArchitect")}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-full border-border bg-card hover:bg-foreground hover:text-background transition-all duration-300 uppercase text-[9px] font-black tracking-widest py-6 shadow-sm">
                        {t("shop.sidebar.initiateContact")}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
