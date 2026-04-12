"use server";

import { prisma } from "@/lib/prisma";
import { Product } from "@/lib/types";

export interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: { name: string } | null;
    image: string;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { brandName: { contains: query } },
                    { category: { name: { contains: query } } }
                ]
            },
            take: 10,
            include: {
                category: true
            }
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            category: p.category ? { name: p.category.name } : null,
            image: p.images ? (p.images.startsWith('[') ? JSON.parse(p.images)[0] : p.images.split(',')[0]) : '/placeholder.jpg'
        }));

    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
