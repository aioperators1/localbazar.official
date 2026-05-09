"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, getDrivers } from "@/lib/actions/admin";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { OrderDriverSelect } from "@/components/admin/OrderDriverSelect";
import Link from "next/link";
import { ShoppingBag, Clock, Truck, CheckCircle2, XCircle, RotateCw, Download, FileSpreadsheet, Calendar } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportRange, setExportRange] = useState("today");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const handleExport = () => {
        let start = "";
        let end = "";
        const now = new Date();

        const getStartOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
        const getEndOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

        if (exportRange === "today") {
            start = getStartOfDay(now);
            end = getEndOfDay(now);
        } else if (exportRange === "last7days") {
            const last7 = new Date(now);
            last7.setDate(now.getDate() - 7);
            start = getStartOfDay(last7);
            end = getEndOfDay(now);
        } else if (exportRange === "thisMonth") {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            start = getStartOfDay(firstDay);
            end = getEndOfDay(now);
        } else if (exportRange === "custom") {
            if (customStartDate) {
                const parts = customStartDate.split('-');
                start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0, 0).toISOString();
            }
            if (customEndDate) {
                const parts = customEndDate.split('-');
                end = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59, 999).toISOString();
            }
        }

        let url = `/api/admin/orders/export?`;
        if (start) url += `startDate=${start}&`;
        if (end) url += `endDate=${end}`;

        window.open(url, "_blank");
        setShowExportModal(false);
    };

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
                    <button 
                        onClick={() => setShowExportModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-[44px] px-5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm active:scale-95"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export
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
                                            <div className="flex flex-col gap-1 items-start">
                                                <Link href={`/admin/orders/${order.id}`} className="font-medium text-black hover:underline uppercase">
                                                    #{order.id.slice(-8)}
                                                </Link>
                                                {order.type === "EXPRESS" && (
                                                    <span className="text-[9px] font-black tracking-widest uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded w-fit">Express</span>
                                                )}
                                            </div>
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

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                Export Orders Analytics
                            </h3>
                            <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">Time Range</label>
                                <select 
                                    value={exportRange} 
                                    onChange={(e) => setExportRange(e.target.value)}
                                    className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                >
                                    <option value="today">Today</option>
                                    <option value="last7days">Last 7 Days</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="all">All Time</option>
                                    <option value="custom">Custom Date Range</option>
                                </select>
                            </div>

                            {exportRange === "custom" && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={customStartDate} 
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                                        <input 
                                            type="date" 
                                            value={customEndDate} 
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex items-center gap-3">
                                <button 
                                    onClick={() => setShowExportModal(false)}
                                    className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleExport}
                                    disabled={exportRange === "custom" && (!customStartDate || !customEndDate)}
                                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Generate Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
