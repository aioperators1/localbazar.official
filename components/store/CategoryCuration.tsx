"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

import { Category } from "@/lib/types";

export function CategoryCuration({ categories }: { categories?: Category[] }) {
    const { t, language } = useLanguage();

    const collections = categories?.map(c => ({
        title: c.name,
        subtitle: "COLLECTION",
        image: c.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
        link: `/shop?category=${c.slug}`,
    })) || [];

    return (
        <section className={`py-8 sm:py-12 bg-transparent overflow-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="container mx-auto px-4 lg:px-24">
                {/* Section Title */}
                <div className="mb-6 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-px bg-white" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-white/50 uppercase">
                            {language === 'ar' ? "التصنيفات" : "Categories"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {collections.map((item, idx) => (
                        <div key={idx} className="relative group">
                            <Link href={item.link} className="block aspect-[3/4] relative overflow-hidden bg-black/20 rounded-[2px] shadow-sm">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                
                                <div className={cn(
                                    "absolute inset-0 flex flex-col justify-end p-8 text-white",
                                    language === 'ar' ? "text-right" : "text-left"
                                )}>
                                    <span className="text-[8px] font-black tracking-[0.4em] uppercase mb-2 opacity-60">
                                        {item.subtitle}
                                    </span>
                                    <h2 className="font-serif text-[24px] lg:text-[28px] leading-tight font-medium tracking-tight mb-2">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                                            {t('home.viewCatalogue')}
                                        </span>
                                        <ChevronRight className={cn("w-3 h-3", language === 'ar' && "rotate-180")} strokeWidth={3} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
