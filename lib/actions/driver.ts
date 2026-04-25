
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAvailableOrders() {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: "confirmed",
                assignedDriverId: null
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, images: true }
                        }
                    }
                },
                user: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return orders;
    } catch (error) {
        console.error("Get Available Orders Error:", error);
        return [];
    }
}

export async function claimOrder(orderId: string, driverId: string) {
    try {
        // Atomic update to prevent double-claiming
        const order = await prisma.order.update({
            where: {
                id: orderId,
                assignedDriverId: null,
                status: "confirmed"
            },
            data: {
                assignedDriverId: driverId,
                status: "processing"
            }
        });
        
        revalidatePath('/driver/dashboard');
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error("Claim Order Error:", error);
        return { success: false, error: "Order already claimed or unavailable." };
    }
}

export async function updateDeliveryStatus(orderId: string, driverId: string, status: string) {
    try {
        await prisma.order.update({
            where: {
                id: orderId,
                assignedDriverId: driverId
            },
            data: { status }
        });
        
        revalidatePath('/driver/dashboard');
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Failed to update delivery status." };
    }
}

export async function getDriverActiveOrders(driverId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                assignedDriverId: driverId,
                NOT: {
                    status: { in: ['delivered', 'failed'] }
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, images: true }
                        }
                    }
                },
                user: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return orders;
    } catch (error) {
        console.error("Get Driver Active Orders Error:", error);
        return [];
    }
}
