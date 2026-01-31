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
import { Loader2 } from "lucide-react";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (value: string) => {
        setLoading(true);
        await updateOrderStatus(orderId, value);
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />}
            <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className={`w-[130px] h-8 text-xs font-bold uppercase tracking-wider border-0 ring-1 ring-white/10
            ${currentStatus === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' :
                        currentStatus === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' :
                            currentStatus === 'CANCELLED' ? 'bg-red-500/10 text-red-500 ring-red-500/20' :
                                'bg-orange-500/10 text-orange-500 ring-orange-500/20'
                    }
        `}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="PENDING" className="text-orange-500">Pending</SelectItem>
                    <SelectItem value="SHIPPED" className="text-blue-500">Shipped</SelectItem>
                    <SelectItem value="DELIVERED" className="text-emerald-500">Delivered</SelectItem>
                    <SelectItem value="CANCELLED" className="text-red-500">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
