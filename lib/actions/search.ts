"use server";

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
    if (!query || query.trim().length === 0) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } }, // Case insensitive by default in SQLite? usage dependent on provider, but usually yes for generic setup. Prisma explicit mode: 'insensitive' might be needed for Postgres.
                    { description: { contains: query } },
                    { brand: { contains: query } },
                    { category: { name: { contains: query } } }
                ]
            },
            take: 5,
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true
            }
        });

        // Normalize image (since schema says String, assuming it might be JSON or single URL)
        return products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            image: p.images ? (p.images.startsWith('[') ? JSON.parse(p.images)[0] : p.images.split(',')[0]) : '/placeholder.jpg'
        }));

    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
