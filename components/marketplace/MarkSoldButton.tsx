"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSold } from "@/lib/actions/marketplace";
import { cn } from "@/lib/utils";

export function MarkSoldButton({ productId, inStock }: { productId: string, inStock: boolean }) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleSold(productId);
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleToggle}
            disabled={loading}
            className={cn(
                "flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 transition-all",
                inStock
                    ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    : "border-indigo-500/50 text-indigo-500 hover:bg-indigo-500 hover:text-white"
            )}
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : inStock ? <CheckCircle2 className="w-3 h-3 mr-2" /> : <XCircle className="w-3 h-3 mr-2" />}
            {inStock ? "Mark as Sold" : "Re-list Item"}
        </Button>
    );
}
