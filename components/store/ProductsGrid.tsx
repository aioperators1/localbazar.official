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
                className="flex flex-col items-center justify-center min-h-[400px] rounded-[40px] bg-muted/20 border border-dashed border-border/40 group"
            >
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-1000" />
                    <Filter className="w-12 h-12 text-muted-foreground relative z-10 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2">{t("shop.empty.title")}</h3>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em]">{t("shop.empty.desc")}</p>
                <Button asChild variant="outline" className="mt-10 rounded-full border-border/20 text-muted-foreground hover:bg-foreground hover:text-background transition-all px-10 py-6 text-[9px] font-black uppercase tracking-widest">
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
                            category: p.category?.name || "Series"
                        }}
                    />
                </div>
            ))}
        </div>
    );

}
