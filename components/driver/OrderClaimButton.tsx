
"use client";

import { useState } from "react";
import { claimOrder } from "@/lib/actions/driver";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderClaimButtonProps {
    orderId: string;
    driverId: string;
}

export function OrderClaimButton({ orderId, driverId }: OrderClaimButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClaim = async () => {
        setLoading(true);
        try {
            const res = await claimOrder(orderId, driverId);
            if (res.success) {
                toast.success("Assignment Confirmed");
            } else {
                toast.error(res.error || "Claim failed");
            }
        } catch (error) {
            toast.error("Network error during assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleClaim}
            disabled={loading}
            className="h-10 bg-black text-white px-5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                    <Zap className="w-3.5 h-3.5 mr-2 fill-emerald-500 text-emerald-500" /> Take Order
                </>
            )}
        </Button>
    );
}
