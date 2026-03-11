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
    image: string;
    brand: string;
    sku: string;
    specs?: string;
};

export async function getDashboardStats() {
    try {
        const [totalRevenue, totalOrders, totalProducts, recentOrders] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true }
            }),
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            })
        ]);

        return {
            revenue: Number(totalRevenue._sum.total || 0),
            orders: totalOrders,
            products: totalProducts,
            users: await prisma.user.count(),
            recentOrders: recentOrders.map(order => ({
                ...order,
                total: Number(order.total),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
            }))
        };
    } catch (error) {
        console.error("Stats Error:", error);
        return { revenue: 0, orders: 0, products: 0, users: 0, recentOrders: [] };
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
                images: JSON.stringify([data.image]), // Simplification for now
                brand: data.brand,
                sku: data.sku,
                specs: data.specs,
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
            updateData.images = JSON.stringify([image]);
        }

        if (specs !== undefined) {
            updateData.specs = specs;
        }

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
                }
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

export async function createBanner(data: { title: string, subtitle?: string, image: string, link?: string, active?: boolean, order?: number }) {
    try {
        const prismaAny = prisma as any;
        await prismaAny.banner.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
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

export async function updateBanner(id: string, data: Partial<{ title: string, subtitle: string, image: string, link: string, active: boolean, order: number }>) {
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
        const prismaAny = prisma as any;
        const settings = await prismaAny.setting.findMany();
        return settings.reduce((acc: any, setting: any) => {
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
        const prismaAny = prisma as any;
        // Use a transaction to update all settings
        const updates = Object.entries(data).map(([key, value]) => {
            return prismaAny.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });

        await prismaAny.$transaction(updates);
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

export async function createCategory(data: { name: string, slug: string, image?: string, parentId?: string }) {
    try {
        await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                parentId: data.parentId || null
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

export async function updateCategory(id: string, data: Partial<{ name: string, slug: string, image: string, parentId: string }>) {
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
