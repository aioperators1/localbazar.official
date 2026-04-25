"use client";

import { ScrollReveal } from "./ScrollReveal";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCarousel } from "./ProductCarousel";

import { Product, Category } from "@/lib/types";

export function HomeContent({ selectionProducts, selectionCategory }: { selectionProducts: Product[], selectionCategory: Category }) {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <section className={isAr ? 'rtl' : 'ltr'}>
            {/* Premium Brand Values - Ultra Pro Minimalism */}
            <section className="py-12 sm:py-16 bg-transparent overflow-hidden">
                <div className="container mx-auto px-6 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                        <ScrollReveal delay={0.1} className="space-y-6 group cursor-default flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-6">
                                <div className="hidden md:block w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                                <span className="text-[11px] font-black tracking-[0.6em] text-white/30 uppercase group-hover:text-white transition-colors duration-1000">{t('home.purity')}</span>
                                <div className="md:hidden w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                            </div>
                            <h3 className="text-[32px] lg:text-[40px] font-serif tracking-tighter text-white leading-[1.1] transition-all duration-1000 md:group-hover:translate-x-2">
                                <span className="block mb-2 group-hover:opacity-60 transition-opacity duration-1000">{t('home.purityText')}</span>
                                <span className="italic font-extralight text-white/40 group-hover:text-white transition-colors duration-1000">{t('home.purityItalic')}</span>
                            </h3>
                            <p className="text-[14px] text-white/40 leading-relaxed font-medium max-w-xs group-hover:text-white/70 transition-colors duration-1000">{t('home.qualityDesc')}</p>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={0.3} className="space-y-6 group cursor-default flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-6">
                                <div className="hidden md:block w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                                <span className="text-[11px] font-black tracking-[0.6em] text-white/30 uppercase group-hover:text-white transition-colors duration-1000">{t('home.authenticity')}</span>
                                <div className="md:hidden w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                            </div>
                            <h3 className="text-[32px] lg:text-[40px] font-serif tracking-tighter text-white leading-[1.1] transition-all duration-1000 md:group-hover:translate-x-2">
                                <span className="block mb-2 group-hover:opacity-60 transition-opacity duration-1000">{t('home.heritageText')}</span>
                                <span className="italic font-extralight text-white/40 group-hover:text-white transition-colors duration-1000">{t('home.heritageItalic')}</span>
                            </h3>
                            <p className="text-[14px] text-white/40 leading-relaxed font-medium max-w-xs group-hover:text-white/70 transition-colors duration-1000">{t('home.heritageDesc')}</p>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={0.5} className="space-y-6 group cursor-default flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-6">
                                <div className="hidden md:block w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                                <span className="text-[11px] font-black tracking-[0.6em] text-white/30 uppercase group-hover:text-white transition-colors duration-1000">{t('home.exclusivity')}</span>
                                <div className="md:hidden w-12 h-[0.5px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-1000 ease-out" />
                            </div>
                            <h3 className="text-[32px] lg:text-[40px] font-serif tracking-tighter text-white leading-[1.1] transition-all duration-1000 md:group-hover:translate-x-2">
                                <span className="block mb-2 group-hover:opacity-60 transition-opacity duration-1000">{t('home.signaturesText')}</span>
                                <span className="italic font-extralight text-white/40 group-hover:text-white transition-colors duration-1000">{t('home.signaturesItalic')}</span>
                            </h3>
                            <p className="text-[14px] text-white/40 leading-relaxed font-medium max-w-xs group-hover:text-white/70 transition-colors duration-1000">{t('home.signaturesDesc')}</p>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Curated Selection Rail */}
            <section className="py-16 bg-transparent relative overflow-hidden">
                {/* Subtle Watermark BG */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.05] w-full text-center">
                    <span className="text-[15vw] font-serif font-black tracking-tighter text-white uppercase whitespace-nowrap">
                        {selectionCategory.name}
                    </span>
                </div>

                <div className="container mx-auto px-4 lg:px-24 mb-10 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-[1px] bg-white mb-2" />
                        <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] block">{t('home.curateSelection')}</span>
                        <h2 className="font-serif text-[48px] lg:text-[64px] text-white leading-[0.9] tracking-tighter">
                            {selectionCategory.name.split(' ').map((word: string, i: number) => (
                                <span key={i} className={cn(
                                    i % 2 !== 0 ? "italic font-extralight text-white/50 block lg:inline" : "font-medium",
                                    i % 2 !== 0 && (isAr ? "lg:mr-4" : "lg:ml-4")
                                )}>{word} </span>
                            ))}
                        </h2>
                    </div>
                </div>

                <div className="relative z-10">
                    <ProductCarousel products={selectionProducts} />
                </div>

                <div className="text-center mt-12 relative z-10">
                    <Link href={`/shop?category=${selectionCategory.slug}`} className="group relative inline-flex items-center gap-8 overflow-hidden bg-white text-[#592C2F] px-12 py-6 rounded-[1px] text-[12px] font-bold uppercase tracking-[0.3em] transition-all">
                        <span className="relative z-10">{t('home.exploreFull')}</span>
                        <div className="absolute inset-0 bg-white/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-500">{isAr ? "←" : "→"}</span>
                    </Link>
                </div>
            </section>
        </section>
    );
}
