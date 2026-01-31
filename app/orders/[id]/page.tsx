import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderTrackingClient from "./OrderTrackingClient";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: {
                include: {
                    addresses: true
                }
            }
        }
    });

    if (!order) return notFound();

    // Serialize data
    const serializedOrder = {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        total: Number(order.total),
        items: order.items.map(item => ({
            ...item,
            price: Number(item.price),
            product: {
                ...item.product,
                price: Number(item.product.price),
                salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                createdAt: item.product.createdAt.toISOString(),
                updatedAt: item.product.updatedAt.toISOString(),
            }
        })),
        user: order.user ? {
            ...order.user,
            createdAt: order.user.createdAt.toISOString(),
            updatedAt: order.user.updatedAt.toISOString(),
        } : null
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20">
            <OrderTrackingClient order={serializedOrder as any} />
        </div>
    );
}
