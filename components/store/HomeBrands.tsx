"use client";

import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/lib/types";

export function HomeBrands({ brands }: { brands: Brand[] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="py-12 md:py-16 relative">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* Divider top */}
                <div className="mb-10 md:mb-14">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Static Grid / Flex container */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-12">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/shop?brand=${brand.slug}`}
                            className="group flex items-center justify-center shrink-0"
                        >
                            <div className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] lg:w-[140px] lg:h-[140px] rounded-full bg-white border border-white/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-500">
                                {brand.logo ? (
                                    <div className="relative w-3/4 h-3/4">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <span className="text-[18px] md:text-[20px] font-bold tracking-wide uppercase text-[#592C2F]">
                                        {brand.name.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Divider bottom */}
                <div className="mt-10 md:mt-14">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                
            </div>
        </section>
    );
}
