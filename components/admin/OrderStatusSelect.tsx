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
import { cn } from "@/lib/utils";

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

    const statusStyles: Record<string, string> = {
        PENDING: "bg-[#FFE0B2] text-[#6D4C41]",
        SHIPPED: "bg-[#E3F2FD] text-[#0D47A1]",
        DELIVERED: "bg-[#008060]/10 text-[#008060]",
        CANCELLED: "bg-[#F1F1F1] text-[#616161]",
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-3 h-3 animate-spin text-[#616161]" />}
            <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className={cn(
                    "w-[120px] h-7 text-[11px] font-bold rounded-full border-none shadow-none ring-0 focus:ring-0 px-2",
                    statusStyles[currentStatus] || "bg-[#F1F1F1] text-[#616161]"
                )}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E3E3E3]">
                    <SelectItem value="PENDING" className="text-[#6D4C41] text-[12px]">Pending</SelectItem>
                    <SelectItem value="SHIPPED" className="text-[#0D47A1] text-[12px]">Shipped</SelectItem>
                    <SelectItem value="DELIVERED" className="text-[#008060] text-[12px]">Delivered</SelectItem>
                    <SelectItem value="CANCELLED" className="text-[#616161] text-[12px]">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
