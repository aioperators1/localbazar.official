
"use client";

import { useState } from "react";
import { updateDeliveryStatus } from "@/lib/actions/driver";
import { toast } from "sonner";
import { Loader2, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusUpdateButtonProps {
    orderId: string;
    currentStatus: string;
    driverId: string;
}

export function StatusUpdateButton({ orderId, currentStatus, driverId }: StatusUpdateButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await updateDeliveryStatus(orderId, driverId, newStatus);
            if (res.success) {
                toast.success(`Success: Package marked as ${newStatus}`);
            } else {
                toast.error(res.error || "Update protocol failed");
            }
        } catch (error) {
            toast.error("Transmission error");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'processing') {
        return (
            <Button 
                onClick={() => handleUpdate('out_for_delivery')}
                disabled={loading}
                className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 shadow-lg shadow-black/10"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        <Truck className="w-5 h-5" /> Mark Out for Delivery
                    </>
                )}
            </Button>
        );
    }

    if (currentStatus === 'out_for_delivery') {
        return (
            <div className="grid grid-cols-2 gap-3">
                <Button 
                    onClick={() => handleUpdate('delivered')}
                    disabled={loading}
                    className="h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                            <CheckCircle2 className="w-4 h-4" /> Delivered
                        </>
                    )}
                </Button>
                <Button 
                    onClick={() => handleUpdate('failed')}
                    disabled={loading}
                    variant="outline"
                    className="h-14 border-2 border-red-500 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                            <XCircle className="w-4 h-4" /> Failed
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return null;
}
