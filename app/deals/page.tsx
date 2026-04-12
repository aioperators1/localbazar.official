import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { Zap } from "lucide-react";
import { FlashSaleHero } from "@/components/store/FlashSaleHero";

async function getDeals() {
    // For now, fetch random products or products with a specific tag if schema supported it.
    // We will just fetch the cheapest 4 items as "Deals"
    return (await prisma.product.findMany({
        orderBy: { price: 'asc' },
        take: 8
    })).map(p => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));
}

export default async function DealsPage() {
    const products = await getDeals();

    return (
        <div className="bg-transparent min-h-screen pt-32 pb-40">
            <div className="container mx-auto px-6 mb-20">
                <FlashSaleHero />
            </div>

            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
                    <div className="p-3 bg-white/10 border border-white/20 rounded-xl">
                        <Zap className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                            Exquisite <span className="text-white/50">Collections</span>
                        </h2>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
                            Limited availability. Curated with heritage.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p as any} />
                    ))}
                </div>
            </div>
        </div>
    );
}
