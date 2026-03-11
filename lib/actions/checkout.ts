"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

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

// Fallback IDs allowed for demo mode
const ALLOWED_DEMO_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export async function placeOrder(data: CheckoutData) {
    try {
        const { firstName, lastName, email, items, total, address, city, zip, paymentMethod } = data;

        if (!items || items.length === 0) {
            return { success: false, error: "Empty acquisition matrix." };
        }

        const name = `${firstName} ${lastName}`.trim();

        // RUN EVERYTHING IN A TRANSACTION FOR ATOMICITY
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find or Create User
            let user = await tx.user.findUnique({
                where: { email },
            });

            if (!user) {
                const password = await hash(Math.random().toString(36).slice(-8) + (process.env.NEXTAUTH_SECRET || "default_secret"), 10);

                // Ensure unique username
                let username = email.split('@')[0].toLowerCase();
                const existingUsername = await tx.user.findUnique({ where: { username } });
                if (existingUsername) {
                    username += Math.random().toString(36).slice(2, 6);
                }

                user = await tx.user.create({
                    data: {
                        email,
                        name,
                        username: username,
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

        // Revalidate admin paths to reflect new order immediately
        revalidatePath('/admin');
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');

        return result;

    } catch (error: unknown) {
        console.error("Zenith Checkout Failure:", error);

        const message = error instanceof Error ? error.message : "idk";
        const isDbError = message.includes("Can't reach database server") ||
            message.includes("password authentication failed") ||
            message.includes("connect ECONNREFUSED") ||
            message.includes("P1001");

        if (isDbError) {
            console.log("⚠️ DATABASE UNREACHABLE. ACTIVATING ZENITH DEMO MODE.");
            return {
                success: true,
                orderId: "DEMO-" + Math.random().toString(36).substring(2, 9).toUpperCase()
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Protocol failure during order allocation."
        };
    }
}
