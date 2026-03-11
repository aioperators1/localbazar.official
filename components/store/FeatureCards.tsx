"use client";

import Image from "next/image";
import Link from "next/link";

const FEATURES = [
    {
        title: "Haute Couture",
        description: "Des créations d'exception réalisées dans nos ateliers parisiens, alliant tradition et innovation.",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000",
        link: "/shop?category=evening-wear"
    },
    {
        title: "Prêt-à-Porter",
        description: "L'élégance au quotidien. Une sélection de pièces intemporelles pour une allure sophistiquée.",
        image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000",
        link: "/shop?category=suits"
    },
    {
        title: "Accessoires",
        description: "Complétez votre silhouette avec notre maroquinerie iconique et nos bijoux raffinés.",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000",
        link: "/shop?category=accessories"
    }
];

export function FeatureCards() {
    return (
        <section className="py-20 bg-zinc-50 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-12">
                <div className="h-[1px] w-12 bg-[#111111]" />
                <h2 className="text-[#111111] font-bold text-xs uppercase tracking-[0.4em] text-center">
                    L'EXCELLENCE DU LUXE À QATAR
                </h2>
                <div className="h-[1px] w-12 bg-[#111111]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <div key={i} className="bg-[#f2f2f2] rounded-lg p-8 shadow-sm border border-zinc-200 flex flex-col justify-between group h-[350px]">
                        <div>
                            <h3 className="text-xl font-medium text-[#111111] uppercase tracking-tighter mb-4">{f.title}</h3>
                            <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 font-medium uppercase tracking-wider">
                                {f.description}
                            </p>
                            <Link
                                href={f.link}
                                className="inline-block border-b border-[#111111] text-[#111111] pb-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-brand-burgundy hover:border-brand-burgundy transition-all"
                            >
                                Découvrir
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
