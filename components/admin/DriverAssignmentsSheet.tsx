"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Clock, Phone, User, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface DriverOrder {
    id: string;
    total: any;
    status: string;
    phone: string | null;
    createdAt: Date;
    user: { name: string | null } | null;
}

export function DriverAssignmentsSheet({ driverName, orders = [] }: { driverName: string, orders: DriverOrder[] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full h-12 bg-white border-t border-gray-100 flex items-center justify-between px-6 hover:bg-gray-50 transition-colors group">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">Manifest Logs</span>
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white p-0 overflow-y-auto no-scrollbar max-h-[85vh] rounded-2xl border-gray-100">
                <DialogHeader className="p-8 bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">{driverName}</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Active Logistics Manifest
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {orders.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-gray-200">
                                <Clock className="w-6 h-6 text-gray-300" />
                            </div>
                            <span className="text-[11px] font-black tracking-widest uppercase text-gray-400">No active dispatch orders</span>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white text-left border border-gray-100 hover:border-black rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Link href={`/admin/orders/${order.id}`} className="text-[14px] font-black text-black tracking-tighter uppercase leading-none hover:underline flex items-center gap-2">
                                            #{order.id.slice(-8)}
                                            <ExternalLink className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-black text-black">{formatPrice(Number(order.total || 0))}</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.status}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-[12px] font-semibold text-gray-600 truncate">{order.user?.name || "GUEST"}</span>
                                    </div>
                                    {order.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="text-[11px] font-bold tracking-widest text-gray-600">{order.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-[10px] font-medium tracking-wide text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
