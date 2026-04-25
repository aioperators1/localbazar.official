"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

interface CheckoutItem {
    id: string; // Product ID
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
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
    total: number; // Provided total (requested)
    voucherId?: string;
    shippingMethodId?: string;
    shippingCost?: number;
}

// Default fallback if no shipping settings set
const DEFAULT_SHIPPING_COST = 35;

export async function placeOrder(data: CheckoutData) {
    try {
        const { firstName, lastName, email, items, address, city, zip, paymentMethod, voucherId } = data;

        if (!items || items.length === 0) {
            return { success: false, error: "Empty cart. Please add items before checking out." };
        }

        const name = `${firstName} ${lastName}`.trim();

        // RUN EVERYTHING IN A TRANSACTION FOR ATOMICITY
        const result = await prisma.$transaction(async (tx: any) => {
            // Fetch Shipping Settings securely on server
            const settings = await tx.setting.findUnique({ where: { key: 'shippingMethods' } });
            let currentShippingCost = Object.prototype.hasOwnProperty.call(data, 'shippingCost') ? Number(data.shippingCost) : DEFAULT_SHIPPING_COST;
            
            if (settings && settings.value) {
                try {
                    const methods = JSON.parse(settings.value);
                    if (Array.isArray(methods) && methods.length > 0) {
                        const method = data.shippingMethodId ? methods.find((m: any) => m.id === data.shippingMethodId) : methods[0];
                        if (method) {
                            currentShippingCost = Number(method.price);
                        }
                    }
                } catch (e: any) {
                    // fallback to provided or default
                }
            }

            // 1. Server-Side Total Verification (Security)
            const productIds = items.map((i: CheckoutItem) => i.id);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, price: true }
            });

            const productPriceMap = new Map(products.map((p: any) => [p.id, Number(p.price)]));
            
            // Re-calculate subtotal
            let calculatedSubtotal = 0;
            const validItems = [];

            for (const item of items) {
                const dbPrice = productPriceMap.get(item.id);
                if (dbPrice !== undefined) {
                    calculatedSubtotal += (dbPrice as number) * item.quantity;
                    validItems.push({
                        ...item,
                        price: dbPrice as number // Use DB price for security
                    });
                }
            }

            if (validItems.length === 0) {
                throw new Error("Product availability has changed. Please refresh your cart.");
            }

            // Handle Voucher
            let discount = 0;
            if (voucherId) {
                const voucher = await tx.voucher.findUnique({
                    where: { id: voucherId }
                });

                if (voucher && voucher.active) {
                    const voucherValue = Number(voucher.value);
                    if (voucher.type === 'PERCENTAGE') {
                        discount = (calculatedSubtotal * voucherValue) / 100;
                    } else {
                        discount = voucherValue;
                    }

                    // Update voucher usage
                    const newUsedCount = (voucher.usedCount || 0) + 1;
                    const shouldAutoDeactivate = voucher.usageLimit > 0 && newUsedCount >= voucher.usageLimit;

                    await tx.voucher.update({
                        where: { id: voucherId },
                        data: {
                            usedCount: newUsedCount,
                            active: !shouldAutoDeactivate
                        }
                    });
                }
            }

            const finalTotal = Math.max(0, calculatedSubtotal - discount + currentShippingCost);

            // 2. Find or Create User
            let user = await tx.user.findUnique({
                where: { email },
            });

            if (!user) {
                const password = await hash(Math.random().toString(36).slice(-8) + (process.env.NEXTAUTH_SECRET || "lb_secret"), 10);
                let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                
                const existingUsername = await tx.user.findUnique({ where: { username } });
                if (existingUsername) {
                    username += Math.random().toString(36).slice(2, 6);
                }

                user = await tx.user.create({
                    data: {
                        email,
                        name,
                        username,
                        password,
                        phone: data.phone,
                        role: "USER",
                    }
                });
            } else if (!user.phone && data.phone) {
                // Update existing user with phone if missing
                await tx.user.update({
                    where: { id: user.id },
                    data: { phone: data.phone }
                });
            }

            // 3. Create Address
            await tx.address.create({
                data: {
                    userId: user.id,
                    street: address,
                    city,
                    zip,
                    country: "Qatar",
                }
            });

            // Handle Shipping Method Name for Record
            let selectedMethodName = "Standard Delivery";
            if (settings && settings.value) {
                try {
                    const methods = JSON.parse(settings.value);
                    const method = data.shippingMethodId ? methods.find((m: any) => m.id === data.shippingMethodId) : methods[0];
                    if (method) selectedMethodName = method.name;
                } catch (e: any) {}
            }

            // 4. Create Order
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    total: finalTotal,
                    status: (paymentMethod === "COD" || !paymentMethod) ? "PENDING" : "DRAFT",
                    paymentMethod: paymentMethod || "COD",
                    voucherId: voucherId || null,
                    phone: data.phone || null,
                    shippingMethod: selectedMethodName,
                    items: {
                        create: validItems.map((item: any) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            size: item.size,
                            color: item.color
                        }))
                    }
                }
            });

            return { 
                success: true, 
                orderId: order.id,
                userEmail: user.email as string,
                userName: user.name as string,
                totalAmount: finalTotal
            };
        });

        // 5. Post-transaction: External Payment Initiation
        if (result.success && paymentMethod && (paymentMethod === "MYFATOORAH" || paymentMethod === "CARD" || paymentMethod === "APPLE_PAY" || paymentMethod === "GOOGLE_PAY")) {
            try {
                const { initiatePayment } = await import("@/lib/utils/myfatoorah");
                const paymentInfo = await initiatePayment(
                    result.totalAmount,
                    result.orderId,
                    result.userEmail,
                    result.userName
                );

                // Update order with external payment ID
                await prisma.order.update({
                    where: { id: result.orderId },
                    data: { paymentId: paymentInfo.invoiceId }
                });

                return { 
                    success: true, 
                    orderId: result.orderId, 
                    paymentUrl: paymentInfo.paymentUrl 
                };
            } catch (paymentError: unknown) {
                const errMsg = paymentError instanceof Error ? paymentError.message : "Payment provider could not be reached.";
                console.error("Payment Initiation Failure:", paymentError);
                return {
                    success: false,
                    error: errMsg
                };
            }
        }

        // Global Revalidation
        revalidatePath('/admin');
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');

        return { success: true, orderId: result.orderId };

    } catch (error: unknown) {
        console.error("Checkout Engine Error:", error);

        const msg = error instanceof Error ? error.message : "";
        if (msg.includes("P1001") || msg.includes("Can't reach database")) {
            return {
                success: false,
                error: "Store is currently in read-only mode (Database connection issue). Please try again in 1 minute."
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Internal system error during order processing."
        };
    }
}
