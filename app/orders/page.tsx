import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrdersClientHub from "./OrdersClientHub";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    let orders: any[] = [];
    if (session?.user) {
        orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Serialize orders
        orders = orders.map((order: any) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            total: Number(order.total),
            items: order.items.map((item: any) => ({
                ...item,
                price: Number(item.price),
                product: {
                    ...item.product,
                    price: Number(item.product.price),
                    salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                    createdAt: item.product.createdAt.toISOString(),
                    updatedAt: item.product.updatedAt.toISOString(),
                }
            }))
        }));
    }

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20">
            <OrdersClientHub initialOrders={orders} isGuest={!session} />
        </div>
    );
}
