"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            take: 4,
            where: { featured: true },
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                seller: {
                    select: { name: true, image: true }
                }
            }
        });
        return products.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

export async function getAllProducts(
    categorySlug?: string,
    sort?: string,
    filter?: string,
    minPrice?: number,
    maxPrice?: number
) {
    try {
        const where: Prisma.ProductWhereInput = {
            status: "APPROVED"
        };

        // Category Filter
        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        // Stock Filter
        if (filter === 'instock') {
            where.inStock = true;
        }

        // Sale Filter
        if (filter === 'onsale') {
            where.salePrice = { not: null };
        }

        // Price Range Filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        // Sorting Logic
        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }; // Default
        if (sort === 'price_asc') {
            orderBy = { price: 'asc' };
        } else if (sort === 'price_desc') {
            orderBy = { price: 'desc' };
        } else if (sort === 'newest') {
            orderBy = { createdAt: 'desc' };
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                seller: {
                    select: { name: true, image: true }
                }
            },
            orderBy
        });

        return products.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany();
        return categories.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString()
        }));
    } catch {
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!product) return null;
        return {
            ...product,
            price: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    } catch {
        return null;
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.update({
            where: { slug },
            data: {
                views: { increment: 1 }
            },
            include: { category: true }
        });
        if (!product) return null;
        return {
            ...product,
            price: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    } catch {
        return null;
    }
}

export async function getMarketplaceProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                status: "APPROVED",
                sellerId: { not: null }
            },
            include: {
                category: true,
                seller: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return products.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Marketplace Fetch Error:", error);
        return [];
    }
}
