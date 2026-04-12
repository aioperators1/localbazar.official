"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Loader2, ChevronRight, Package, Calendar, Tag, ArrowRight, PackageX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";

interface OrdersClientHubProps {
    initialOrders: any[];
    isGuest: boolean;
}

export default function OrdersClientHub({ initialOrders, isGuest }: OrdersClientHubProps) {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setLoading(true);
        // Remove # if present to ensure proper routing
        const cleanId = orderId.replace('#', '').trim();
        router.push(`/orders/${cleanId}`);
    };

    return (
        <div className="container mx-auto px-6 max-w-5xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                    Orders <span className="text-white/50">History</span>
                </h1>
                <p className="text-white/60 max-w-lg">
                    {isGuest
                        ? "Enter your tracking ID below to monitor your order shipment in real-time."
                        : "Manage your purchase history and track active order shipments."}
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Search / Guest Sidebar */}
                <div className={cn(
                    "space-y-8",
                    isGuest ? "lg:col-span-12 max-w-2xl" : "lg:col-span-4"
                )}>
                    <div className="bg-black/20 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/20">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">Track Record</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative group">
                                <Input
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="ENTER ORDER ID"
                                    className="relative h-14 bg-black/20 border-white/20 text-white placeholder:text-white/20 rounded-xl font-mono uppercase tracking-widest focus:border-white transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-white text-[#592C2F] hover:bg-white/90 font-black uppercase tracking-widest rounded-[2px] transition-all group"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Locate Order
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {!isGuest && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4">
                            <div className="p-2 bg-white/10 rounded-lg h-fit">
                                <Tag className="w-4 h-4 text-white/50" />
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed font-medium">
                                Account synchronization active. All orders placed while logged in are listed in your dashboard.
                            </p>
                        </div>
                    )}
                </div>

                {/* Member Orders List */}
                {!isGuest && (
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            {initialOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/20 rounded-[2rem] bg-black/10">
                                    <PackageX className="w-12 h-12 text-white/20 mb-4" />
                                    <h3 className="text-xl font-bold text-white/40 uppercase italic">No Orders Found</h3>
                                    <p className="text-white/30 text-sm mt-1">Start your luxury collection in the store.</p>
                                    <Button variant="link" onClick={() => router.push('/shop')} className="mt-4 text-white uppercase tracking-widest font-black text-xs hover:text-white/80">
                                        Open Store &rarr;
                                    </Button>
                                </div>
                            ) : (
                                initialOrders.map((order: any, idx) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => router.push(`/orders/${order.id}`)}
                                        className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-black/20 border border-white/10 rounded-3xl hover:bg-black/30 transition-all cursor-pointer shadow-sm"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative shadow-inner overflow-hidden">
                                                {order.items[0]?.product?.images ? (
                                                    <Image
                                                        src={order.items[0].product.images.startsWith('[') ? JSON.parse(order.items[0].product.images)[0] : order.items[0].product.images}
                                                        alt="Product Image"
                                                        fill
                                                        sizes="56px"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : <Package className="w-6 h-6 text-white/30" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase pr-2">
                                                        Order #{order.id.slice(-6).toUpperCase()}
                                                    </h3>
                                                    <span className={cn(
                                                        "text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-[0.1em] border",
                                                        order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                                                    <div className="flex items-center gap-1.5"><Package className="w-3 h-3" /> {order.items.length} items</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Total Value</p>
                                                <p className="text-xl font-black text-white italic tracking-tighter">
                                                    {formatPrice(order.total)}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white transition-all">
                                                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#592C2F] transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
