"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderById(orderId: string) {
    if (!orderId) return { error: "Order ID is required" };

    const cleanId = orderId.replace('#', '').trim();

    const orderInclude = {
        items: {
            include: {
                product: true
            }
        },
        user: {
            select: {
                name: true,
                email: true,
                addresses: {
                    take: 1,
                    orderBy: { createdAt: 'desc' } as const,
                    select: {
                        street: true,
                        city: true,
                        zip: true,
                        country: true
                    }
                }
            }
        }
    };

    try {
        // 1. Exact match
        let order = await prisma.order.findUnique({
            where: { id: cleanId },
            include: orderInclude
        });

        // 2. Suffix match (for short IDs)
        if (!order && cleanId.length >= 4) {
            order = await prisma.order.findFirst({
                where: {
                    id: { endsWith: cleanId }
                },
                include: orderInclude
            });

            // 3. Lowercase suffix match
            if (!order) {
                order = await prisma.order.findFirst({
                    where: {
                        id: { endsWith: cleanId.toLowerCase() }
                    },
                    include: orderInclude
                });
            }
        }

        if (!order) {
            return { error: "Order not found" };
        }

        // Serialize Decimal objects
        const serializedOrder = {
            ...order,
            total: Number(order.total),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            items: order.items.map(item => ({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: Number(item.price),
                size: item.size || null,
                color: item.color || null,
                product: item.product ? {
                    id: item.product.id,
                    name: item.product.name,
                    price: Number(item.product.price),
                    salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                    images: item.product.images,
                    slug: item.product.slug,
                    categoryId: item.product.categoryId,
                    sku: item.product.sku,
                } : null
            }))
        };

        return { order: serializedOrder };
    } catch (error) {
        console.error("Order Lookup Error:", error);
        return { error: "Failed to fetch order details" };
    }
}
