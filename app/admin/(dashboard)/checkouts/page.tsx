import { prisma } from "@/lib/prisma";
import CheckoutsClient from "./CheckoutsClient";

export const dynamic = 'force-dynamic';

export default async function AdminCheckoutsPage() {
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

    return <CheckoutsClient initialCheckouts={serialized} />;
}
