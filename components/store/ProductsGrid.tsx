"use client";

import { motion, Variants } from "framer-motion";
import { ProductCard } from "@/components/store/ProductCard";
import { Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    image?: string;
    images?: string;
    category?: { name: string };
    [key: string]: unknown;
}

interface ProductsGridProps {
    products: Product[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

export function ProductsGrid({ products }: ProductsGridProps) {
    const { t } = useLanguage();

    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[400px] rounded-[40px] bg-zinc-950/50 border border-white/5 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative mb-8 p-6 bg-zinc-900/80 rounded-full border border-white/10 shadow-glow">
                    <Filter className="w-10 h-10 text-blue-500 relative z-10" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 z-10">{t("shop.empty.title")}</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.3em] z-10">{t("shop.empty.desc")}</p>
                <Button asChild variant="outline" className="mt-10 rounded-full border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-glow transition-all px-10 py-6 text-[9px] font-black uppercase tracking-widest z-10">
                    <Link href="/shop">{t("shop.empty.reset")}</Link>
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {products.map((p) => (
                <div key={p.id}>
                    <ProductCard
                        product={{
                            id: p.id,
                            name: p.name,
                            slug: p.slug,
                            price: Number(p.price),
                            image: p.image || p.images || "",
                            category: p.category?.name || "Series",
                            specs: typeof p.specs === 'string' ? p.specs : JSON.stringify(p.specs || {})
                        }}
                    />
                </div>
            ))}
        </div>
    );

}
