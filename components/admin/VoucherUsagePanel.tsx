"use client";

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { 
    Users, 
    ShoppingCart, 
    Mail, 
    Clock, 
    ArrowRight,
    Search,
    ChevronRight,
    Receipt
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface VoucherUsagePanelProps {
    voucher: any;
    trigger?: React.ReactNode;
}

export function VoucherUsagePanel({ voucher, trigger }: VoucherUsagePanelProps) {
    const orders = voucher.orders || [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                        <Users className="w-3.5 h-3.5" />
                        Usage Tracking ({orders.length})
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-[#050505]/95 backdrop-blur-2xl border border-white/10 shadow-3xl rounded-[32px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="relative bg-[#111111] p-8 text-white shrink-0 overflow-hidden border-b border-white/5">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Usage Intelligence</DialogTitle>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">Audit Trail for {voucher.code}</p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto p-8 space-y-4 flex-1">
                     {orders.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4 opacity-10">
                            <ShoppingCart className="w-16 h-16 text-white" />
                            <p className="text-white font-black uppercase tracking-widest text-xs">Zero Orders Tracked</p>
                        </div>
                    ) : (
                        orders.map((order: any) => (
                            <div 
                                key={order.id} 
                                className="group bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-white text-[14px] uppercase tracking-tighter italic">Order #{order.id.slice(-8).toUpperCase()}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[11px] font-bold text-white/40 capitalize">{order.status || 'Success'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-medium text-white/20 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {order.user?.name || 'Anonymous'}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-6">
                                    <div className="text-right flex flex-col">
                                        <span className="font-black text-[16px] text-white tracking-tighter italic">{formatCurrency(Number(order.total))}</span>
                                        <span className="text-[9px] font-bold uppercase text-white/20 tracking-[0.2em]">Transaction Total</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                 <div className="p-8 bg-white/5 border-t border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Total Revenue Capture</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black italic tracking-tighter text-white">
                                {formatCurrency(orders.reduce((acc: number, o: any) => acc + Number(o.total), 0))}
                            </span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Terminal Value</span>
                        </div>
                    </div>
                    <button onClick={() => window.open(`/admin/orders/${orders[0]?.id}`)} className="h-12 px-6 bg-white text-black hover:bg-white/80 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-white/5 flex items-center gap-2">
                        Inspect Order Details
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
