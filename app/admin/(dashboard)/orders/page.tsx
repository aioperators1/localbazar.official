import { getAdminOrders } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import Link from "next/link";

interface Order {
    id: string;
    createdAt: Date;
    status: string;
    total: { toNumber: () => number } | number | string; // Handle Prisma Decimal
    user: {
        name: string | null;
        email: string | null;
    } | null;
}

export default async function AdminOrdersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders: any[] = await getAdminOrders();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Orders</h1>
                <p className="text-zinc-400">Manage and track customer orders.</p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-zinc-300">
                                                <Link href={`/admin/orders/${order.id}`} className="hover:text-primary hover:underline transition-colors">
                                                    #{order.id.slice(-6).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{order.user?.name || 'Guest'}</span>
                                                    <span className="text-zinc-500 text-xs">{order.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-white">
                                                {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(
                                                    typeof order.total === 'object' && 'toNumber' in order.total ? order.total.toNumber() : Number(order.total)
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
