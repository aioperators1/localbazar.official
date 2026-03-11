import { getAdminOrders } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders: any[] = await getAdminOrders();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">Orders</h1>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm overflow-hidden">
                <table className="w-full text-left text-[13px] border-collapse">
                    <thead className="bg-[#f6f6f6] border-b border-[#E3E3E3]">
                        <tr>
                            <th className="p-3 pl-4 font-semibold text-[#303030]">Order</th>
                            <th className="p-3 font-semibold text-[#303030]">Customer</th>
                            <th className="p-3 font-semibold text-[#303030]">Status</th>
                            <th className="p-3 font-semibold text-[#303030]">Date</th>
                            <th className="p-3 text-right pr-4 font-semibold text-[#303030]">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E3E3]">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-[#616161] font-medium">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-[#F9F9F9] transition-colors">
                                    <td className="p-3 pl-4">
                                        <Link href={`/admin/orders/${order.id}`} className="font-bold text-[#005BD3] hover:underline">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="text-[#303030] font-bold">{order.user?.name || 'Guest Customer'}</span>
                                            <span className="text-[#616161] text-[11px]">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                    </td>
                                    <td className="p-3 text-[#616161]">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-3 text-right pr-4 font-bold text-[#303030]">
                                        {formatPrice(order.total)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
