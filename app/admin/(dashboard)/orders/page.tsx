"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, getDrivers } from "@/lib/actions/admin";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { OrderDriverSelect } from "@/components/admin/OrderDriverSelect";
import Link from "next/link";
import { ShoppingBag, Clock, Truck, CheckCircle2, XCircle, RotateCw } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const fetchOrders = async (pageNum: number = 1) => {
        setIsLoading(true);
        try {
            const [ordersData, driversData] = await Promise.all([
                getAdminOrders(pageNum, pageSize),
                getDrivers()
            ]);
            setOrders(ordersData || []);
            setDrivers(driversData || []);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const stats = {
        pending: orders.filter(o => o.status === "PENDING").length,
        shipped: orders.filter(o => o.status === "SHIPPED").length,
        delivered: orders.filter(o => o.status === "DELIVERED").length,
        cancelled: orders.filter(o => o.status === "CANCELLED").length,
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Orders</h1>
                    <p className="text-[13px] text-gray-500">Manage and track global fulfillment</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => fetchOrders(page)}
                        disabled={isLoading}
                        className="bg-white border border-gray-200 text-black hover:bg-gray-50 h-[44px] px-4 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                        title="Sync Orders"
                    >
                        <RotateCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </button>
                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                       <div className="flex flex-col px-4 border-r border-gray-200">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total (Batch)</span>
                          <span className="text-[16px] font-bold text-black">{orders.length}</span>
                       </div>
                       <div className="flex flex-col px-4">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Status</span>
                          <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-[14px] font-bold text-emerald-600">LIVE</span>
                          </div>
                       </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
                    { label: "Shipped Items", value: stats.shipped, icon: Truck, color: "text-blue-600 bg-blue-50" },
                    { label: "Delivered Success", value: stats.delivered, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
                    { label: "Cancelled Void", value: stats.cancelled, icon: XCircle, color: "text-red-600 bg-red-50" },
                ].map((stat: any, idx: number) => (
                    <div
                        key={stat.label}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-[12px] font-semibold text-gray-500">{stat.label}</h3>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-black">
                                {isLoading ? "0" : stat.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">ID</th>
                                <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Customer</th>
                                <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Status</th>
                                <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Driver</th>
                                <th className="py-4 px-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Date</th>
                                <th className="py-4 px-6 text-right font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4" />
                                            <p className="text-[12px] font-medium text-gray-500">Loading orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-900 font-medium">No orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr 
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <Link href={`/admin/orders/${order.id}`} className="font-medium text-black hover:underline uppercase">
                                                #{order.id.slice(-8)}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-black font-medium">{order.user?.name || 'Guest'}</span>
                                                <span className="text-gray-500 text-[11px]">{order.user?.email || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="py-4 px-6">
                                            <OrderDriverSelect 
                                                orderId={order.id} 
                                                currentDriverId={order.assignedDriverId} 
                                                drivers={drivers} 
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-medium text-black">
                                                {formatPrice(order.total)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI for Orders (Client-side control) */}
                {!isLoading && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Page {page}</p>
                        <div className="flex items-center gap-2">
                           <button 
                             disabled={page <= 1}
                             onClick={() => setPage(page - 1)}
                             className="h-8 px-4 border border-gray-200 rounded text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-30"
                           >
                              Previous
                           </button>
                           <button 
                             disabled={orders.length < pageSize}
                             onClick={() => setPage(page + 1)}
                             className="h-8 px-4 border border-gray-200 rounded text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-30"
                           >
                              Next
                           </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
