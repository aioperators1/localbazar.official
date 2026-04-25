"use server";

import { prisma } from "@/lib/prisma";
import { Order } from "@/lib/types";
export async function getLatestOrder(): Promise<Order | null> {
    try {
        const order = await prisma.order.findFirst({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) return null;

        const anyOrder = order as any;

        // Ensure all required fields for Order interface are present and correctly typed
        return {
            id: anyOrder.id,
            userId: anyOrder.userId,
            total: Number(anyOrder.total),
            status: anyOrder.status,
            paymentMethod: anyOrder.paymentMethod,
            paymentStatus: anyOrder.paymentStatus || "PENDING",
            // Other fields are optional in the interface and missing in the DB schema
            // Derive email from user if present
            email: anyOrder.user?.email || null,
            firstName: anyOrder.user?.name?.split(' ')[0] || null,
            lastName: anyOrder.user?.name?.split(' ').slice(1).join(' ') || null,
            createdAt: anyOrder.createdAt.toISOString(),
            updatedAt: anyOrder.updatedAt.toISOString(),
            user: anyOrder.user,
            orderItems: anyOrder.items.map((item: any) => ({
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
                    brandId: item.product.brandId,
                } : null
            }))
        } as any;
    } catch (error) {
        console.error("Failed to fetch latest order record:", error);
        return null;
    }
}
