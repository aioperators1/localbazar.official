"use client";

import { useEffect, useState } from "react";
import { getAdminOrders } from "@/lib/actions/admin";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Calendar, User, Clock, Truck, CheckCircle2, XCircle, TrendingUp, Boxes } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await getAdminOrders();
            setOrders(data);
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    const stats = {
        pending: orders.filter(o => o.status === "PENDING").length,
        shipped: orders.filter(o => o.status === "SHIPPED").length,
        delivered: orders.filter(o => o.status === "DELIVERED").length,
        cancelled: orders.filter(o => o.status === "CANCELLED").length,
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* 🌌 ULTRA PRO HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 shadow-2xl">
                            <Boxes className="w-6 h-6 text-white/40" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                                Transaction <span className="text-black bg-white px-3 py-1 rounded-xl ml-1 not-italic">Log</span>
                            </h1>
                            <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.4em] mt-3 ml-1">Global Order Fulfillment Interface</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 glass-card p-3 rounded-[24px] border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-white/[0.01]">
                   <div className="flex flex-col px-6 border-r border-white/5">
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Aggregate Thruput</span>
                      <span className="text-[18px] font-black text-white italic tracking-tighter leading-none mt-1">{orders.length}</span>
                   </div>
                   <div className="flex flex-col px-6">
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Operational State</span>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <span className="text-[14px] font-black text-emerald-400 italic tracking-tighter leading-none">LIVE</span>
                      </div>
                   </div>
                </div>
            </div>

            {/* 🚀 ANALYTICS TIERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "amber", desc: "Awaiting fulfillment" },
                    { label: "Shipped Items", value: stats.shipped, icon: Truck, color: "blue", desc: "In transit matrix" },
                    { label: "Delivered Success", value: stats.delivered, icon: CheckCircle2, color: "emerald", desc: "Completion signature" },
                    { label: "Cancelled Void", value: stats.cancelled, icon: XCircle, color: "rose", desc: "Protocol termination" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card relative group overflow-hidden p-8 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 cursor-default"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-150",
                            stat.color === "amber" && "bg-amber-500",
                            stat.color === "blue" && "bg-blue-500",
                            stat.color === "emerald" && "bg-emerald-500",
                            stat.color === "rose" && "bg-rose-500"
                        )} />
                        
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-2xl",
                                stat.color === "amber" && "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-amber-500/10",
                                stat.color === "blue" && "bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-blue-500/10",
                                stat.color === "emerald" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/10",
                                stat.color === "rose" && "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-rose-500/10"
                            )}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">{stat.label}</h3>
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-black text-white italic tracking-tighter leading-none">
                                        {isLoading ? "0" : stat.value}
                                    </span>
                                    <div className="flex flex-col pb-1">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>REALTIME</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.1em] mt-3 italic">{stat.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 📋 TRANSACTION MANIFEST */}
            <div className="overflow-hidden w-full glass-card rounded-[48px] border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-white/[0.01] backdrop-blur-3xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px] border-collapse min-w-[900px]">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="py-8 px-6 pl-10 pro-label uppercase tracking-[0.3em] font-black text-white/50">Manifest ID</th>
                                <th className="py-8 px-6 pro-label uppercase tracking-[0.3em] font-black text-white/50">Customer Entity</th>
                                <th className="py-8 px-6 pro-label uppercase tracking-[0.3em] font-black text-white/50">Fulfillment status</th>
                                <th className="py-8 px-6 pro-label uppercase tracking-[0.3em] font-black text-white/50">Timestamp</th>
                                <th className="py-8 px-6 text-right pr-10 pro-label uppercase tracking-[0.3em] font-black text-white/50">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-40 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-8 shadow-2xl" />
                                            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Synchronizing Data Streams...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-40 text-center">
                                        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-1000">
                                            <ShoppingBag className="w-10 h-10 text-white/10" />
                                        </div>
                                        <p className="text-white font-black uppercase tracking-[0.3em] text-[15px] italic">No Transactions Logged</p>
                                        <p className="text-white/20 text-[11px] mt-3 font-bold uppercase tracking-widest leading-relaxed">Awaiting customer interaction protocols.<br/>Registry currently void of tactical orders.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, idx) => (
                                    <motion.tr 
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-white/[0.03] transition-all duration-500 cursor-default"
                                    >
                                        <td className="py-6 px-6 pl-10">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-6 group/id">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-black text-[11px] uppercase group-hover/id:scale-110 group-hover/id:bg-white group-hover/id:text-black transition-all duration-700 shadow-2xl">
                                                    ID
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[16px] text-white group-hover/id:text-blue-400 tracking-tighter transition-colors">
                                                        #{order.id.slice(-8).toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-0.5">Verified_Transaction</span>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all duration-500">
                                                    <User className="w-5 h-5 text-white/30" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-black text-[15px] italic tracking-tight uppercase leading-none">{order.user?.name || 'Anonymous Entity'}</span>
                                                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1.5">{order.user?.email || "NO_EMAIL_SYNC"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="relative z-10">
                                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-white/30" />
                                                </div>
                                                <span className="text-white font-black tracking-tighter text-[14px]">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 text-right pr-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[20px] font-black text-white tracking-tighter italic leading-none">
                                                    {formatPrice(order.total)}
                                                </span>
                                                <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] mt-2 italic">Processed_Value</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
