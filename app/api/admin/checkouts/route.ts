import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const checkouts = await (prisma as any).abandonedCheckout.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        const serialized = checkouts.map((c: any) => ({
            ...c,
            cartTotal: Number(c.cartTotal),
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
        }));

        return NextResponse.json(serialized);
    } catch (error: any) {
        console.error("[GET_CHECKOUTS]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
