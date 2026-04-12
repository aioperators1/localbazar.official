"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function FeatureCards() {
    const { t } = useLanguage();

    const FEATURES = [
        {
            title: t('features.title1'),
            description: t('features.desc1'),
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000",
            link: "/shop?category=evening-wear"
        },
        {
            title: t('features.title2'),
            description: t('features.desc2'),
            image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000",
            link: "/shop?category=suits"
        },
        {
            title: t('features.title3'),
            description: t('features.desc3'),
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000",
            link: "/shop?category=accessories"
        }
    ];

    return (
        <section className="py-20 bg-transparent flex flex-col items-center">
            <div className="flex items-center gap-3 mb-12">
                <div className="h-[1px] w-12 bg-white/10" />
                <h2 className="text-white/40 font-bold text-xs uppercase tracking-[0.4em] text-center">
                    {t('features.tagline')}
                </h2>
                <div className="h-[1px] w-12 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <div key={i} className="bg-black/20 rounded-xl p-8 shadow-sm border border-white/10 flex flex-col justify-between group h-[350px]">
                        <div>
                            <h3 className="text-xl font-medium text-white uppercase tracking-tighter mb-4 italic font-serif ">{f.title}</h3>
                            <p className="text-white/40 text-[11px] leading-relaxed mb-8 font-medium uppercase tracking-wider">
                                {f.description}
                            </p>
                            <Link
                                href={f.link}
                                className="inline-block border-b border-white text-white pb-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white/60 hover:border-white/60 transition-all"
                            >
                                {t('features.discover')}
                            </Link>
                        </div>
                        <div className="relative h-40 w-full mt-4 self-center">
                            <Image
                                src={f.image}
                                alt={f.title}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
