"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CURATED_COLLECTIONS = [
    {
        title: "Abayas",
        subtitle: "ABAYAS COLLECTION",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000",
        link: "/shop?category=abayas",
        size: "large"
    },
    {
        title: "Dresses & Jalabiyas",
        subtitle: "DRESSES & JALABIYAS",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
        link: "/shop?category=dresses-jalabiyas",
        size: "small"
    },
    {
        title: "Perfumes & Oud",
        subtitle: "PERFUMES & OUD",
        image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1000",
        link: "/shop?category=perfumes-oud",
        size: "small"
    }
];

export function CategoryCuration({ categories }: { categories?: any[] }) {
    const collections = categories && categories.length >= 3 ? categories.slice(0, 3).map(c => ({
        title: c.name,
        subtitle: c.description || "COLLECTION",
        image: c.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
        link: `/shop?category=${c.slug}`,
        size: "large"
    })) : CURATED_COLLECTIONS;

    return (
        <section className="py-24 container mx-auto px-4 lg:px-12 xl:px-24">
            <div className="flex flex-col md:flex-row gap-8 h-[600px] md:h-[700px]">
                {/* Large Tile */}
                <div className="flex-[1.5] relative group overflow-hidden">
                    <Link href={collections[0].link} className="block w-full h-full relative">
                        <Image
                            src={collections[0].image}
                            alt={collections[0].title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        <div className="absolute bottom-12 left-12 text-white">
                            <span className="text-[12px] font-bold tracking-[0.3em] uppercase mb-4 block">{collections[0].subtitle}</span>
                            <h2 className="font-serif text-[42px] leading-tight mb-8">{collections[0].title}</h2>
                            <button className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-10 py-4 hover:bg-black hover:text-white transition-all">
                               Explore
                            </button>
                        </div>
                    </Link>
                </div>

                {/* Vertical Stack for Small Tiles */}
                <div className="flex-1 flex flex-col gap-8">
                    {collections.slice(1).map((item) => (
                        <div key={item.title} className="flex-1 relative group overflow-hidden">
                            <Link href={item.link} className="block w-full h-full relative">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">{item.subtitle}</span>
                                    <h2 className="font-serif text-[28px] leading-tight">{item.title}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
