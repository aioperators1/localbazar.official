"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/admin";
import { useState } from "react";
import { Loader2, ShieldCheck, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const { canEdit } = usePermissions();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (value: string) => {
        if (!canEdit('orders')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        setLoading(true);
        setStatus(value);
        try {
            const res = await updateOrderStatus(orderId, value);
            if (res.success) {
                toast.success("STATUS TRANSFORMATION COMPLETE");
            } else {
                toast.error("TRANSFORMATION FAILED");
            }
        } catch (error) {
            toast.error("COMMUNICATION ERROR");
        } finally {
            setLoading(false);
        }
    };

    const statusConfig: Record<string, { label: string, color: string, bg: string, icon: any, border: string }> = {
        PENDING: { 
            label: "Pending Order", 
            color: "text-amber-400", 
            bg: "bg-amber-500/10", 
            icon: Clock,
            border: "border-amber-500/20"
        },
        SHIPPED: { 
            label: "Shipped Item", 
            color: "text-blue-400", 
            bg: "bg-blue-500/10", 
            icon: Truck,
            border: "border-blue-500/20"
        },
        DELIVERED: { 
            label: "Delivered Success", 
            color: "text-emerald-400", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2,
            border: "border-emerald-500/20"
        },
        CANCELLED: { 
            label: "Cancelled Void", 
            color: "text-rose-400", 
            bg: "bg-rose-500/10", 
            icon: XCircle,
            border: "border-rose-500/20"
        },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <div className="flex items-center gap-3">
            <Select defaultValue={status} onValueChange={handleStatusChange} disabled={loading || !canEdit('orders')}>
                <SelectTrigger className={cn(
                    "h-10 min-w-[160px] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border transition-all hover:scale-105 active:scale-95 px-5 outline-none focus:ring-4 focus:ring-white/5 shadow-2xl backdrop-blur-3xl",
                    config.bg,
                    config.color,
                    config.border
                )}>
                    <div className="flex items-center gap-3 w-full">
                         {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : (
                             <config.icon className="w-3.5 h-3.5 shrink-0" />
                         )}
                         <div className="flex-1 text-left truncate">
                             <SelectValue />
                         </div>
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 overflow-hidden">
                    {Object.entries(statusConfig).map(([key, item]) => (
                        <SelectItem 
                            key={key} 
                            value={key} 
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all mb-1 last:mb-0 focus:bg-white focus:text-black",
                                item.color
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
