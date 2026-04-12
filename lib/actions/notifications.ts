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
                }
            }
        });

        if (!order) return null;

        // Ensure all required fields for Order interface are present and correctly typed
        return {
            id: order.id,
            userId: order.userId,
            total: Number(order.total),
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: (order as any).paymentStatus || "PENDING",
            // Other fields are optional in the interface and missing in the DB schema
            // Derive email from user if present
            email: order.user?.email || null,
            firstName: order.user?.name?.split(' ')[0] || null,
            lastName: order.user?.name?.split(' ').slice(1).join(' ') || null,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            user: order.user
        };
    } catch (error) {
        console.error("Failed to fetch latest order record:", error);
        return null;
    }
}
