"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { ShopSidebar } from "@/components/store/ShopSidebar";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ProductsGrid } from "@/components/store/ProductsGrid";
import { EmptyState } from "@/components/store/EmptyState";
import { MobileFilterDrawer } from "@/components/store/MobileFilterDrawer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Product, Category, Brand } from "@/lib/types";

interface ShopContentProps {
    products: Product[];
    categories: Category[];
    brands?: Brand[];
    params: {
        category?: string;
        sort?: string;
        filter?: string;
        minPrice?: string;
        maxPrice?: string;
        search?: string;
    };
    currentCategoryName: string;
}

export function ShopContent({ products, categories, brands, params, currentCategoryName }: ShopContentProps) {
    const { t, language } = useLanguage();

    const catDescriptions: Record<string, string> = {
        'abayas': t('slide1.desc'),
        'dresses-jalabiyas': t('slide2.desc'),
        'perfumes-oud': t('slide3.desc'),
        'men': t('nav.men'), // Add more specific ones if needed
        'accessories': t('nav.accessories'),
        'kids': t('nav.premiumFashion')
    };

    const categorySl = params.category?.toLowerCase() || '';
    const descText = catDescriptions[categorySl] || t('footer.about');

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsMobileFiltersOpen(true);
        window.addEventListener('open-mobile-filters', handleOpen);
        return () => window.removeEventListener('open-mobile-filters', handleOpen);
    }, []);

    return (
        <div className="bg-transparent min-h-screen pb-32 pt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <main className="container mx-auto px-4 lg:px-12 xl:px-24">
                {/* Breadcrumbs - Minimalist */}
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-12">
                    <Link href="/" className="hover:text-white transition-colors">{t('shop.breadcrumb.home')}</Link>
                    <ChevronRight className={cn("w-3 h-3 text-white/50", language === 'ar' && "rotate-180")} />
                    <span className="text-white">{currentCategoryName === "Full Catalogue" ? t('shop.breadcrumb.shop') : currentCategoryName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Sidebar - Precision Width */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <ShopSidebar categories={categories} brands={brands} />
                    </div>

                    {/* Catalog Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* High-End Editorial Header */}
                        <div className="mb-16">
                            <h1 className="font-serif text-[42px] sm:text-[56px] text-white leading-tight tracking-tight mb-6 uppercase">
                                {currentCategoryName === "Full Catalogue" ? t('shop.allCollections') : currentCategoryName}
                            </h1>
                            <p className="text-white/80 text-[15px] leading-relaxed max-w-3xl font-medium">
                                {descText}
                            </p>
                        </div>

                        {/* Professional Toolbar */}
                        <div className="border-t border-white/10 pt-8">
                           <ShopToolbar totalProducts={products.length} />
                        </div>

                        {products.length === 0 ? (
                            <div className="py-20">
                                <EmptyState 
                                    title={t('shop.noPieces')} 
                                    description={t('shop.noPiecesDesc')}
                                    showReset={!!(params.category || params.search || params.minPrice || params.maxPrice)}
                                />
                            </div>
                        ) : (
                            <div className="mt-8">
                                <ProductsGrid products={products} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <MobileFilterDrawer 
                isOpen={isMobileFiltersOpen} 
                onClose={() => setIsMobileFiltersOpen(false)} 
                categories={categories}
                brands={brands}
            />
        </div>
    );
}
