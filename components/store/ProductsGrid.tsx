"use client";

import { ProductCard } from "@/components/store/ProductCard";

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



export function ProductsGrid({ products }: ProductsGridProps) {
    if (products.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
                <div key={p.id}>
                    <ProductCard
                        product={{
                            id: p.id,
                            name: p.name,
                            slug: p.slug,
                            price: Number(p.price),
                            image: p.image,
                            images: p.images,
                            category: p.category?.name || "Catégorie",
                            specs: typeof p.specs === 'string' ? p.specs : JSON.stringify(p.specs || {}),
                            colors: typeof p.colors === 'string' ? p.colors : JSON.stringify(p.colors || [])
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
