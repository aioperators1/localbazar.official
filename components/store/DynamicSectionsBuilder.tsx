"use client";

import { StoreSection } from "@/components/admin/StoreBuilder";
import { Product, Category, Brand, Banner } from "@/lib/types";
import { HeroSection } from "@/components/store/HeroSection";
import { ProductsGrid } from "@/components/store/ProductsGrid";
import { HomeBrands } from "@/components/store/HomeBrands";
import { NewArrivalsTabs } from "@/components/store/NewArrivalsTabs";
import { CategoryCuration } from "@/components/store/CategoryCuration";
import { HomeContent } from "@/components/store/HomeContent";
import { ProductCard } from "@/components/store/ProductCard";
import { ScrollReveal } from "@/components/store/ScrollReveal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface DynamicSectionsBuilderProps {
  sections: StoreSection[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
  activeBanners: Banner[];
}

export function DynamicSectionsBuilder({ sections, products, categories, brands, activeBanners }: DynamicSectionsBuilderProps) {
  const sortedSections = [...sections].sort((a, b) => a.position - b.position).filter(s => s.is_visible);
  
  const activeSortedSections = sortedSections.filter(s => {
      if (s.type === "system_hero") return s.banner_ids && s.banner_ids.length > 0;
      return true;
  });

  if (activeSortedSections.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {activeSortedSections.map((section, idx) => {
        // Shared Background Logic
        const bgClass = section.settings?.background === "white" ? "bg-white text-black" : 
                       section.settings?.background === "black" ? "bg-[#0A0A0A] text-white" : 
                       section.settings?.background === "accent" ? "bg-[#592C2F] text-white" : "bg-transparent";
        
        const isDark = section.settings?.background === "black" || section.settings?.background === "accent";
        const isFirst = idx === 0;

        // Base section wrapper classes
        const sectionWrapperClasses = cn(
            "w-full transition-colors duration-700 relative",
            bgClass,
            isFirst && section.type !== "system_hero" && "pt-12 sm:pt-20", 
            !isFirst && "mt-0"
        );

        if (section.type === "system_hero") {
            const displayBanners = section.banner_ids && section.banner_ids.length > 0
                ? activeBanners.filter(b => section.banner_ids!.includes(b.id))
                : [];

            if (displayBanners.length === 0) return null;

            return (
                <div key={section.id} className="w-full relative">
                    <HeroSection banners={displayBanners as any} />
                </div>
            );
        }

        if (section.type === "slider" && (section.banner_ids?.length || section.images?.length)) {
           const displayBanners = section.banner_ids && section.banner_ids.length > 0
               ? activeBanners.filter(b => section.banner_ids!.includes(b.id)).map(b => ({
                   id: b.id,
                   image: b.image,
                   mobileImage: b.mobileImage || b.image,
                   link: b.link || "/shop"
               }))
               : section.images.map((img: any, i: number) => ({
                   id: `${section.id}-img-${i}`,
                   image: img.url,
                   mobileImage: img.mobileUrl || img.url,
                   link: img.link || "/shop"
               }));

           return (
              <div key={section.id} className="w-full relative">
                 {section.title && (
                    <div className="absolute top-12 left-0 right-0 z-40 text-center pointer-events-none">
                        <h2 className="font-black text-xl sm:text-2xl uppercase tracking-[0.3em] text-white drop-shadow-2xl">{section.title}</h2>
                    </div>
                 )}
                 <HeroSection banners={displayBanners as any} />
              </div>
           );
        }

        if (section.type === "group_products" && section.product_ids?.length > 0) {
           const sectionProducts = section.product_ids
             .map(id => products.find(p => p.id === id))
             .filter(Boolean) as Product[];

           if (sectionProducts.length === 0) return null;

            return (
               <div key={section.id} className={cn(sectionWrapperClasses, "py-8 sm:py-12")}>
                 <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                   <ScrollReveal delay={0.1}>
                     <div className="mb-8 text-center flex flex-col items-center gap-4">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-[0.5px] bg-current opacity-10" />
                            <h2 className="text-[28px] sm:text-[34px] md:text-[44px] font-black uppercase tracking-tighter leading-none">
                               {section.title}
                            </h2>
                            <div className="w-12 h-[0.5px] bg-current opacity-10" />
                         </div>
                     </div>
                     <ProductsGrid products={sectionProducts} />
                   </ScrollReveal>
                 </div>
               </div>
            );
        }

        if (section.type === "single_product" && section.product_ids?.length > 0) {
           const product = products.find(p => p.id === section.product_ids[0]);
           if (!product) return null;

            return (
               <div key={section.id} className={cn(sectionWrapperClasses, "py-8 sm:py-12")}>
                 <div className="max-w-[400px] mx-auto px-4">
                   <ScrollReveal delay={0.1}>
                     <div className="mb-6 text-center flex flex-col items-center gap-2">
                         <h2 className="text-[24px] md:text-[28px] font-black uppercase tracking-tighter leading-none">
                            {section.title}
                         </h2>
                         <div className="w-8 h-[0.5px] bg-current opacity-10" />
                     </div>
                     <ProductCard product={product} />
                   </ScrollReveal>
                 </div>
               </div>
            );
        }

        if (section.type === "reviews") {
            return (
                <div key={section.id} className={cn(sectionWrapperClasses, "py-8 sm:py-12")}>
                    <div className="max-w-[1400px] mx-auto px-4">
                        <ScrollReveal delay={0.1}>
                            <div className="mb-8 text-center flex flex-col items-center gap-4">
                                <h2 className="text-[28px] md:text-[38px] font-black uppercase tracking-tighter leading-none">
                                    {section.title || "Customer Reviews"}
                                </h2>
                                <div className="w-12 h-[0.5px] bg-current opacity-10" />
                            </div>
                            <div className={cn("p-8 sm:p-12 text-center rounded-2xl border", isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100 shadow-soft")}>
                                <p className="font-medium italic text-base opacity-60">Experience real-time feedback from our community.</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            );
        }

        if (section.type === "system_curation") {
            const curated = (section.category_ids && section.category_ids.length > 0)
                ? section.category_ids.map(id => categories.find(c => c.id === id)).filter(Boolean)
                : categories.filter((c: any) => c.showInHomeCurated);
                
            if (curated.length === 0) return null;

            return (
                <div key={section.id} className={sectionWrapperClasses}>
                    <ScrollReveal delay={0.2}>
                        <CategoryCuration categories={curated as Category[]} />
                    </ScrollReveal>
                </div>
            );
        }

        if (section.type === "system_featured_category") {
            let selectionCategory = null;
            if (section.category_ids && section.category_ids.length > 0) {
                selectionCategory = categories.find(c => c.id === section.category_ids![0]);
            } else {
                const featuredCategories = categories.filter((c: any) => c.featured);
                const curated = categories.filter((c: any) => c.showInHomeCurated);
                selectionCategory = featuredCategories.length > 0 ? featuredCategories[0] : (curated.length > 0 ? curated[0] : null);
            }

            if (!selectionCategory) return null;
            const selectionProducts = products.filter(p => p.categoryId === selectionCategory.id || p.category?.slug === selectionCategory.slug).slice(0, 8);

            return (
                <div key={section.id} className={sectionWrapperClasses}>
                    <HomeContent selectionProducts={selectionProducts} selectionCategory={selectionCategory} />
                </div>
            );
        }

        if (section.type === "system_brands") {
            const displayBrands = (section.brand_ids && section.brand_ids.length > 0)
                ? section.brand_ids.map(id => brands.find(b => b.id === id)).filter(Boolean)
                : brands;

            if (displayBrands.length === 0) return null;

            return (
                <div key={section.id} className={sectionWrapperClasses}>
                    <HomeBrands brands={displayBrands as Brand[]} />
                </div>
            );
        }

        if (section.type === "system_new_arrivals") {
            const tabs = (section.category_ids && section.category_ids.length > 0)
                ? section.category_ids.map(id => categories.find(c => c.id === id)).filter(Boolean)
                : categories.filter((c: any) => c.showInHomeTabs);
                
            if (tabs.length === 0) return null;

            return (
                <div key={section.id} className={sectionWrapperClasses}>
                    <ScrollReveal delay={0.2}>
                        <NewArrivalsTabs products={products} categories={tabs as Category[]} />
                    </ScrollReveal>
                </div>
            );
        }

        if (section.type === "brand_group" && (section.brand_ids?.length ?? 0) > 0) {
            const sectionBrands = section.brand_ids!
                .map(id => brands.find((b: any) => b.id === id))
                .filter(Boolean) as Brand[];

            if (sectionBrands.length === 0) return null;

            return (
                <div key={section.id} className={sectionWrapperClasses}>
                    <HomeBrands brands={sectionBrands} />
                </div>
            );
        }

        if (section.type === "category_group" && (section.category_ids?.length ?? 0) > 0) {
            const sectionCategories = section.category_ids!
                .map(id => categories.find((c: any) => c.id === id))
                .filter(Boolean) as Category[];

            if (sectionCategories.length === 0) return null;

            const categoryProducts = products.filter(p => 
                sectionCategories.some(c => c.id === p.categoryId || c.slug === (p as any).category?.slug)
            );

            return (
                <div key={section.id} className={cn(sectionWrapperClasses, "py-8 sm:py-12")}>
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                        <ScrollReveal delay={0.1}>
                            <div className="mb-8 text-center flex flex-col items-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                   <div className="w-12 h-[0.5px] bg-current opacity-10" />
                                   <h2 className="text-[28px] sm:text-[34px] md:text-[44px] font-black uppercase tracking-tighter leading-none">
                                      {section.title}
                                   </h2>
                                   <div className="w-12 h-[0.5px] bg-current opacity-10" />
                                </div>
                            </div>
                            <ProductsGrid products={categoryProducts.slice(0, section.settings?.limit || 12)} />
                        </ScrollReveal>
                    </div>
                </div>
            );
        }

        return null;
      })}
    </div>
  );
}
