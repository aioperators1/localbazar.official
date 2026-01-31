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
         
        const { image, price, stock, ...rest } = data;

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
