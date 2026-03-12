"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- DASHBOARD STATS ---
type ProductInput = {
    name: string;
    slug: string;
    description: string;
    price: string | number;
    stock: string | number;
    categoryId: string;
    image: string | string[]; // Can be single URL or array
    brandId?: string;
    brandName?: string;
    sku: string;
    specs?: string;
    sizes?: string;
    colors?: string;
    materials?: string;
    careInstructions?: string;
};

export async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalRevenue, 
            totalOrders, 
            totalProducts, 
            recentOrders,
            totalUsers,
            
            thisMonthRevenue,
            lastMonthRevenue,
            
            thisMonthOrders,
            lastMonthOrders,
            
            thisMonthUsers,
            lastMonthUsers
        ] = await Promise.all([
            prisma.order.aggregate({ 
                _sum: { total: true },
                where: { status: { not: 'CANCELLED' } } 
            }),
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.user.count({ where: { role: 'USER' } }),
            
            prisma.order.aggregate({ 
                where: { createdAt: { gte: startOfThisMonth }, status: { not: 'CANCELLED' } },
                _sum: { total: true } 
            }),
            prisma.order.aggregate({ 
                where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }, status: { not: 'CANCELLED' } },
                _sum: { total: true } 
            }),
            
            prisma.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
            
            prisma.user.count({ where: { role: 'USER', createdAt: { gte: startOfThisMonth } } }),
            prisma.user.count({ where: { role: 'USER', createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } })
        ]);

        const calcTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? { change: "+100%", trend: "up" } : { change: "0%", trend: "neutral" };
            const diff = ((current - previous) / previous) * 100;
            return {
                change: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
                trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral"
            };
        };

        const revenueCurrent = Number(thisMonthRevenue._sum.total || 0);
        const revenuePrevious = Number(lastMonthRevenue._sum.total || 0);

        return {
            revenue: Number(totalRevenue._sum.total || 0),
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            recentOrders: recentOrders.map(order => ({
                ...order,
                total: Number(order.total),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
            })),
            trends: {
                revenue: calcTrend(revenueCurrent, revenuePrevious),
                orders: calcTrend(thisMonthOrders, lastMonthOrders),
                users: calcTrend(thisMonthUsers, lastMonthUsers)
            }
        };
    } catch (error) {
        console.error("Stats Error:", error);
        return { 
            revenue: 0, orders: 0, products: 0, users: 0, recentOrders: [],
            trends: {
                revenue: { change: "0%", trend: "neutral" },
                orders: { change: "0%", trend: "neutral" },
                users: { change: "0%", trend: "neutral" }
            }
        };
    }
}

// --- PRODUCT MANAGEMENT ---
export async function createProduct(data: ProductInput) {
    try {
        await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: parseFloat(String(data.price)),
                stock: parseInt(String(data.stock)),
                categoryId: data.categoryId,
                images: Array.isArray(data.image) ? JSON.stringify(data.image) : JSON.stringify([data.image]),
                brandId: data.brandId,
                brandName: data.brandName,
                sku: data.sku,
                specs: data.specs,
                sizes: data.sizes,
                colors: data.colors,
                materials: data.materials,
                careInstructions: data.careInstructions,
            }
        });
        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    try {
        // Destructure image specifically to handle the mapping to 'images'

        const { image, price, stock, specs, ...rest } = data;

        const updateData: Record<string, unknown> = {
            ...rest,
        };

        if (price !== undefined) {
            updateData.price = parseFloat(String(price));
        }

        if (stock !== undefined) {
            updateData.stock = parseInt(String(stock));
        }

        // Map 'image' input to 'images' database field
        if (image) {
            updateData.images = Array.isArray(image) ? JSON.stringify(image) : JSON.stringify([image]);
        }

        if (specs !== undefined) updateData.specs = specs;
        if (data.sizes !== undefined) updateData.sizes = data.sizes;
        if (data.colors !== undefined) updateData.colors = data.colors;
        if (data.materials !== undefined) updateData.materials = data.materials;
        if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions;

        await prisma.product.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Update Product Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function approveListing(productId: string) {
    // Assuming role check would happen here or in layout
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { status: "APPROVED" }
        });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Approve Listing Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- ORDER MANAGEMENT ---
export async function getAdminOrders() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    return orders.map(order => ({
        ...order,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map(item => ({
            ...item,
            price: Number(item.price)
        }))
    }));
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath('/admin/orders');
        revalidatePath('/orders');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- CUSTOMER MANAGEMENT ---
export async function getAdminCustomers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                orders: {
                    select: { id: true, total: true }
                }
            }
        });

        return users.map(user => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            orders: user.orders.map(order => ({
                ...order,
                total: Number(order.total)
            }))
        }));
    } catch (error) {
        console.error("Customers Error:", error);
        return [];
    }
}

// --- ANALYTICS ---
export async function getMonthlyRevenue() {
    try {
        const currentYear = new Date().getFullYear();
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01`),
                    lt: new Date(`${currentYear + 1}-01-01`)
                },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });

        const monthlyData = new Array(12).fill(0).map((_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            total: 0
        }));

        orders.forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            monthlyData[month].total += Number(order.total);
        });

        return monthlyData;
    } catch (error) {
        console.error("Revenue Error:", error);
        return [];
    }
}

// --- BANNER MANAGEMENT ---
export async function getAdminBanners() {
    try {
        const prismaAny = prisma as any;
        const banners = await prismaAny.banner.findMany({
            orderBy: { order: 'asc' }
        });
        return banners.map((banner: any) => ({
            ...banner,
            createdAt: banner.createdAt.toISOString(),
            updatedAt: banner.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Get Banners Error:", error);
        return [];
    }
}

export async function createBanner(data: { title: string, subtitle?: string, description?: string, image: string, link?: string, active?: boolean, order?: number }) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.banner.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                image: data.image,
                link: data.link,
                active: data.active ?? true,
                order: data.order ?? 0,
            }
        });
        revalidatePath('/'); // Revalidate homepage where banners are shown
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateBanner(id: string, data: Partial<{ title: string, subtitle: string, description: string, image: string, link: string, active: boolean, order: number }>) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.banner.update({
            where: { id },
            data
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function deleteBanner(id: string) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.banner.delete({ where: { id } });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// --- SETTINGS MANAGEMENT ---
export async function getAdminSettings() {
    try {
        const settings = await prisma.setting.findMany();
        return settings.reduce((acc: Record<string, string>, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    } catch (error) {
        console.error("Get Settings Error:", error);
        return {};
    }
}

export async function updateAdminSettings(data: Record<string, string>) {
    try {
        // Use a transaction to update all settings
        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });

        await prisma.$transaction(updates);
        revalidatePath('/');
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Update Settings Error:", error);
        return { success: false, error: String(error) };
    }
}

// --- CATEGORY MANAGEMENT ---
export async function getAdminCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' }
        });

        return categories.map(cat => ({
            ...cat,
            createdAt: cat.createdAt.toISOString(),
            parent: cat.parent ? {
                ...cat.parent,
                createdAt: cat.parent.createdAt.toISOString()
            } : null
        }));
    } catch (error) {
        console.error("Get Categories Error:", error);
        return [];
    }
}

export async function createCategory(data: { name: string, slug: string, image?: string, parentId?: string, description?: string, featured?: boolean }) {
    try {
        await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                parentId: data.parentId || null,
                description: data.description,
                featured: data.featured ?? false,
            }
        });
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Create Category Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function updateCategory(id: string, data: Partial<{ name: string, slug: string, image: string, parentId: string, description: string, featured: boolean }>) {
    try {
        const { parentId, ...rest } = data;
        await prisma.category.update({
            where: { id },
            data: {
                ...rest,
                parentId: parentId || null
            }
        });
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Update Category Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Delete Category Error:", error);
        return { success: false, error: String(error) };
    }
}
// --- BRAND MANAGEMENT ---
export async function getAdminBrands() {
    try {
        const prismaAny = prisma as any;
        const brands = await prismaAny.brand.findMany({
            orderBy: { name: 'asc' }
        });
        return brands;
    } catch (error) {
        console.error("Get Brands Error:", error);
        return [];
    }
}

export async function createBrand(data: { name: string, slug: string, logo?: string, description?: string, featured?: boolean }) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.brand.create({
            data
        });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateBrand(id: string, data: Partial<{ name: string, slug: string, logo: string, description: string, featured: boolean }>) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.brand.update({
            where: { id },
            data
        });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function deleteBrand(id: string) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.brand.delete({ where: { id } });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}
