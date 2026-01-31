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
        <div className="bg-[#030303] min-h-screen pt-32 pb-40">
            <div className="container mx-auto px-6 mb-20">
                <FlashSaleHero />
            </div>

            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <Zap className="w-6 h-6 text-yellow-500 fill-current animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                            Tactical Drops
                        </h2>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                            Limited supply. High priority acquisition.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={{
                            id: p.id,
                            name: p.name,
                            slug: p.slug,
                            price: p.price,
                            image: p.images,
                            category: p.categoryId || 'Product'
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
