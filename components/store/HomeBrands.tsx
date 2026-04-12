import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { Brand } from "@/lib/types";

export function HomeBrands({ brands }: { brands: Brand[] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="py-20 relative">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <ScrollReveal>
                    <div className="flex flex-col items-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-serif text-white text-center">
                            Our Brands - علاماتنا التجارية
                        </h2>
                        <span className="text-[14px] md:text-[16px] font-medium text-white/90 text-center">
                            نفتخر بالشراكة مع أفضل العلامات التجارية العالمية
                        </span>
                    </div>
                </ScrollReveal>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {brands.map((brand, idx) => (
                        <ScrollReveal key={brand.id} delay={0.1 * idx}>
                            <Link href={`/shop?brand=${brand.slug}`} className="group flex flex-col items-center justify-center transition-all duration-500">
                                <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-white border-2 border-[#E2D8C5] flex items-center justify-center overflow-hidden relative shadow-lg group-hover:scale-105 transition-all duration-500">
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
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xl font-bold text-[#592C2F]">{brand.name.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
