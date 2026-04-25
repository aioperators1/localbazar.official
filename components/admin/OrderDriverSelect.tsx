"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { assignDriverToOrder } from "@/lib/actions/admin";
import { useState } from "react";
import { Loader2, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";

interface OrderDriverSelectProps {
    orderId: string;
    currentDriverId: string | null;
    drivers: { id: string; name: string; phone: string; active: boolean }[];
}

export function OrderDriverSelect({ orderId, currentDriverId, drivers }: OrderDriverSelectProps) {
    const { canEdit } = usePermissions();
    const [driverId, setDriverId] = useState(currentDriverId || "unassigned");
    const [loading, setLoading] = useState(false);

    const handleDriverChange = async (value: string) => {
        if (!canEdit('orders')) return toast.error("ACCESS DENIED");
        setLoading(true);
        setDriverId(value);
        
        const newValue = value === "unassigned" ? null : value;
        try {
            const res = await assignDriverToOrder(orderId, newValue);
            if (res.success) {
                toast.success("DISPATCH ASSIGNMENT UPDATED");
            } else {
                toast.error("ASSIGNMENT FAILED");
            }
        } catch (error) {
            toast.error("COMMUNICATION ERROR");
        } finally {
            setLoading(false);
        }
    };

    const isAssigned = driverId !== "unassigned";

    return (
        <div className="flex items-center gap-3">
            <Select defaultValue={driverId} onValueChange={handleDriverChange} disabled={loading || !canEdit('orders')}>
                <SelectTrigger className={cn(
                    "h-10 min-w-[170px] text-[10px] font-black uppercase tracking-[0.1em] rounded-2xl border transition-all hover:scale-105 active:scale-95 px-4 outline-none focus:ring-4 focus:ring-white/5 shadow-sm bg-white",
                    isAssigned ? "border-black text-black" : "border-gray-200 text-gray-400"
                )}>
                    <div className="flex items-center gap-3 w-full">
                         {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : (
                             isAssigned ? <Truck className="w-3.5 h-3.5 shrink-0" /> : <User className="w-3.5 h-3.5 shrink-0" />
                         )}
                         <div className="flex-1 text-left truncate">
                             <SelectValue />
                         </div>
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-100 rounded-[16px] p-2 shadow-xl animate-in fade-in overflow-hidden">
                    <SelectItem 
                        value="unassigned"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1 hover:bg-gray-50 text-gray-400"
                    >
                        <div className="flex items-center gap-3">
                            <User className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none">Unassigned</span>
                        </div>
                    </SelectItem>
                    {drivers.filter(d => d.active).map((driver) => (
                        <SelectItem 
                            key={driver.id} 
                            value={driver.id} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1 last:mb-0 hover:bg-gray-100 text-black group"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded bg-black flex items-center justify-center text-[9px] text-white shrink-0 group-hover:scale-110 transition-transform">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{driver.name}</span>
                                        <span className="text-[9px] text-gray-400 font-bold tracking-widest leading-none">{driver.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
