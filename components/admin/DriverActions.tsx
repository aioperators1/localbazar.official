
"use client";

import { UserX, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateDriverStatus, deleteDriver } from "@/lib/actions/admin";
import { toast } from "sonner";

interface DriverActionsProps {
    id: string;
    active: boolean;
}

export function DriverActions({ id, active }: DriverActionsProps) {
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await updateDriverStatus(id, !active);
            if (res.success) {
                toast.success(`Driver ${!active ? 'activated' : 'deactivated'}`);
            } else {
                toast.error(res.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this carrier? This will disconnect all their previous order history links.")) return;
        setIsDeleting(true);
        try {
            const res = await deleteDriver(id);
            if (res.success) {
                toast.success("Driver deleted");
            } else {
                toast.error(res.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="border-t border-gray-100 p-3 bg-gray-50/50 flex gap-2">
            <button 
                onClick={handleToggle}
                disabled={loading}
                className="flex-1 h-9 rounded bg-white border border-gray-200 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center justify-center"
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (active ? 'Deactivate' : 'Activate')}
            </button>
            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-9 h-9 rounded bg-white border border-gray-200 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserX className="w-4 h-4" />}
            </button>
        </div>
    );
}
