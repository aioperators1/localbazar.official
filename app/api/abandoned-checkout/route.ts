import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, firstName, lastName, phone, address, city, zip, cartItems, cartTotal } = body;

        // Need at least email or phone to be useful for retargeting
        if (!email && !phone) {
            return NextResponse.json({ success: false }, { status: 200 });
        }

        // Check if we already have an abandoned checkout with this email in the last 30 minutes
        // to avoid duplicates from page refreshes
        if (email) {
            const recent = await (prisma as any).abandonedCheckout.findFirst({
                where: {
                    email,
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes
                    }
                }
            });

            if (recent) {
                // Update existing instead of creating duplicate
                await (prisma as any).abandonedCheckout.update({
                    where: { id: recent.id },
                    data: {
                        firstName: firstName || recent.firstName,
                        lastName: lastName || recent.lastName,
                        phone: phone || recent.phone,
                        address: address || recent.address,
                        city: city || recent.city,
                        zip: zip || recent.zip,
                        cartItems: cartItems ? JSON.stringify(cartItems) : recent.cartItems,
                        cartTotal: cartTotal || recent.cartTotal,
                    }
                });
                return NextResponse.json({ success: true, updated: true });
            }
        }

        await (prisma as any).abandonedCheckout.create({
            data: {
                email: email || null,
                firstName: firstName || null,
                lastName: lastName || null,
                phone: phone || null,
                address: address || null,
                city: city || null,
                zip: zip || null,
                cartItems: cartItems ? JSON.stringify(cartItems) : "[]",
                cartTotal: cartTotal || 0,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[ABANDONED_CHECKOUT]", error);
        return NextResponse.json({ success: false }, { status: 200 }); // Don't break UX
    }
}
