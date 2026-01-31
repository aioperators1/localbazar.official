"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface CheckoutItem {
    id: string; // Product ID
    quantity: number;
    price: number;
}

interface CheckoutData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: string;
    items: CheckoutItem[];
    total: number;
}

export async function placeOrder(data: CheckoutData) {
    try {
        const { firstName, lastName, email, items, total, address, city, zip, paymentMethod } = data;

        if (!items || items.length === 0) {
            return { success: false, error: "Empty acquisition matrix." };
        }

        const name = `${firstName} ${lastName}`.trim();

        // RUN EVERYTHING IN A TRANSACTION FOR ATOMICITY
        return await prisma.$transaction(async (tx) => {
            // 1. Find or Create User
            let user = await tx.user.findUnique({
                where: { email },
            });

            if (!user) {
                const password = await hash(Math.random().toString(36).slice(-8) + (process.env.NEXTAUTH_SECRET || "default_secret"), 10);
                user = await tx.user.create({
                    data: {
                        email,
                        name,
                        username: email.split('@')[0].toLowerCase() + Math.random().toString(36).slice(2, 6),
                        password,
                        role: "USER",
                    }
                });
            }

            // 2. Verified Product Existence - Prevents Foreign Key Failures
            const productIds = items.map(i => i.id);
            const foundProducts = await tx.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true }
            });

            const foundIds = new Set(foundProducts.map(p => p.id));
            const validItems = items.filter(i => foundIds.has(i.id));

            if (validItems.length === 0) {
                throw new Error("Target units not detected in central database.");
            }

            // 3. Create Address Layer
            await tx.address.create({
                data: {
                    userId: user.id,
                    street: address,
                    city,
                    zip,
                    country: "Morocco",
                }
            });

            // 4. Create Order + OrderItems
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    total: total,
                    status: "PENDING",
                    paymentMethod: paymentMethod || "COD",
                    items: {
                        create: validItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            return { success: true, orderId: order.id };
        });

    } catch (error: unknown) {
        console.error("Zenith Checkout Failure:", error);
        const message = error instanceof Error ? error.message : "Protocol failure during order allocation.";
        return {
            success: false,
            error: message
        };
    }
}

