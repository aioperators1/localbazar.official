"use client";


import Image from "next/image";
import { CheckCircle2, Truck, Clock, Copy, PackageCheck, MessageSquare, MapPin, AlertCircle, FileText, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderChat } from "@/components/order/OrderChat";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface OrderTrackingClientProps {
    order: any;
}

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case 'SHIPPED': return <Truck className="w-4 h-4 text-blue-500" />;
        default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
};

export default function OrderTrackingClient({ order }: OrderTrackingClientProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(order.id);
        toast.success("Order ID copied to clipboard");
    };



    return (
        <div className="container mx-auto px-6 max-w-4xl relative z-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl"
            >
                {/* Header Bar */}
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full"
                                onClick={copyToClipboard}
                                title="Copy Full ID"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <p className="text-zinc-500 text-xs font-mono uppercase flex items-center gap-2">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                        order.status === 'DELIVERED' ? 'bg-emerald-500 text-black border-emerald-400' :
                            order.status === 'SHIPPED' ? 'bg-blue-600 text-white border-blue-500' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    )}>
                        <StatusIcon status={order.status} />
                        {order.status}
                    </div>
                </div>

                <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] space-y-8">
                    {/* Visual Timeline */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2" />
                        <div className="relative flex justify-between">
                            {[
                                { label: 'Placed', status: 'PENDING', icon: FileText },
                                { label: 'Processing', status: 'PROCESSING', icon: Package },
                                { label: 'Shipped', status: 'SHIPPED', icon: Truck },
                                { label: 'Delivered', status: 'DELIVERED', icon: CheckCircle2 }
                            ].map((step, idx) => {
                                const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                                const stepIndex = statuses.indexOf(step.status);
                                const currentIndex = statuses.indexOf(order.status) || 0;
                                const isCompleted = currentIndex >= stepIndex;
                                const isCurrent = currentIndex === stepIndex;

                                return (
                                    <div key={step.status} className="flex flex-col items-center gap-3 relative z-10 group">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                                            isCompleted ? "bg-emerald-500 border-emerald-900 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                                                isCurrent ? "bg-blue-600 border-blue-900 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-pulse" :
                                                    "bg-zinc-900 border-zinc-800 text-zinc-600"
                                        )}>
                                            <step.icon className="w-4 h-4" />
                                        </div>
                                        <span className={cn(
                                            "absolute top-14 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-colors",
                                            isCompleted ? "text-emerald-500" : isCurrent ? "text-blue-500" : "text-zinc-600"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    {/* Order Details */}
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
                        {/* Items */}
                        <div>
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <PackageCheck className="w-3 h-3" /> Shipment Contents
                            </h3>
                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors">
                                        <div className="h-16 w-16 bg-black rounded-xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
                                            {item.product.images ? (
                                                <Image
                                                    src={item.product.images.startsWith('[') ? JSON.parse(item.product.images)[0] : item.product.images}
                                                    alt={item.product.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover w-full h-full opacity-80"
                                                />
                                            ) : (
                                                <PackageCheck className="w-6 h-6 text-zinc-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-bold truncate pr-4 text-sm md:text-base">{item.product.name}</h4>
                                            <p className="text-zinc-500 text-[10px] mt-1 font-mono uppercase">
                                                Unit: {formatPrice(Number(item.price))}
                                            </p>
                                        </div>
                                        <div className="text-right pl-4 border-l border-white/5">
                                            <div className="text-zinc-600 text-[10px] font-bold uppercase mb-0.5">Qty</div>
                                            <div className="text-white font-mono text-xl leading-none">{item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Chat Section */}
                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" /> Live Support
                            </h3>
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20 shadow-inner">
                                <OrderChat orderId={order.id} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="p-6 md:p-8 bg-zinc-900/20 flex flex-col h-full">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Order Summary</h3>

                        <div className="space-y-6 flex-1 text-sm">
                            {/* Shipping Address */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase font-bold mb-2">
                                    <MapPin className="w-3 h-3" /> Shipping Address
                                </div>
                                {order.user?.addresses && order.user.addresses.length > 0 ? (
                                    <>
                                        <p className="text-white font-bold">{order.user.name}</p>
                                        <p className="text-zinc-400">{order.user.addresses[0].street}</p>
                                        <p className="text-zinc-400">{order.user.addresses[0].city}, {order.user.addresses[0].country}</p>
                                    </>
                                ) : (
                                    <p className="text-zinc-500 italic">No address provided</p>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-mono">{formatPrice(order.total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold text-[10px] uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>Payment</span>
                                    <span className="text-zinc-300 font-medium uppercase text-[10px] border border-white/10 px-2 py-0.5 rounded bg-white/5">{order.paymentMethod || 'COD'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
                                <span className="text-3xl lg:text-4xl font-black text-white tracking-tighter break-all text-right leading-none">
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-300/60 leading-relaxed font-medium">
                                Status updates are sent to your email. Contact support for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
