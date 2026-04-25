import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://localbazar.com';

    // Static pages
    const routes = [
        '',
        '/shop',
        '/deals',
        '/support',
        '/login',
        '/register',
        '/cart',
        '/contact',
    ].map((route: string) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Dynamic Products
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }));

    // Dynamic Categories
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    const categoryRoutes = categories.map((cat: any) => ({
        url: `${baseUrl}/shop?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
}
