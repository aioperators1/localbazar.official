"use client";

import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
    { name: "Couture du Soir", slug: "evening-wear", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000" },
    { name: "L'Art du Tailleur", slug: "suits", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000" },
    { name: "Héritage", slug: "traditional", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000" },
    { name: "Accessoires", slug: "accessories", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000" },
    { name: "Nouveautés", slug: "new-arrivals", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000" },
];

export function CollectionCircles() {
    return (
        <section className="py-20 bg-white container mx-auto px-4 lg:px-20">
            <div className="flex items-center gap-3 mb-10">
                <h2 className="text-[#111111] font-bold text-[22px] uppercase tracking-[0.2em]">Collections Populaires</h2>
            </div>

            <div className="flex justify-start lg:justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-12 2xl:gap-16 overflow-x-auto no-scrollbar pb-6 px-2 lg:px-0 after:content-[''] after:w-4 after:shrink-0 lg:after:hidden">
                {COLLECTIONS.map((c, i) => (
                    <Link key={i} href={`/shop?category=${c.slug}`} className="flex flex-col items-center gap-4 group flex-shrink-0">
                        <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-60 lg:w-28 lg:h-48 xl:w-36 xl:h-60 2xl:w-44 2xl:h-72 rounded-t-full rounded-b-sm bg-[#f9f9f9] flex items-center justify-center overflow-hidden transition-all relative shadow-sm border border-zinc-100 group-hover:shadow-xl group-hover:-translate-y-1">
                            <Image
                                src={c.image}
                                alt={c.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <span className="text-[#111111] font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-center max-w-[120px] md:max-w-[140px] group-hover:text-brand-burgundy transition-colors font-serif">
                            {c.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
