"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Tag, 
    Ticket, 
    Percent, 
    CircleDollarSign, 
    Calendar, 
    Users, 
    Zap, 
    ArrowRight,
    Lock,
    Unlock,
    Plus
} from "lucide-react";
import { createVoucher, updateVoucher } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Voucher } from "@/types/admin";

interface VoucherModalProps {
    voucher?: Voucher;
    trigger?: React.ReactNode;
}

export function VoucherModal({ voucher, trigger }: VoucherModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: voucher?.code || "",
        type: voucher?.type || "PERCENTAGE",
        value: voucher?.value || 0,
        usageLimit: voucher?.usageLimit || 0,
        active: voucher?.active ?? true,
        expiryDate: voucher?.expiryDate ? new Date(voucher.expiryDate).toISOString().split('T')[0] : ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { ...formData, value: Number(formData.value), usageLimit: Number(formData.usageLimit) };
            const res = voucher 
                ? await updateVoucher(voucher.id, data)
                : await createVoucher(data);

            if (res.success) {
                toast.success(voucher ? "Voucher Identity Updated" : "New Voucher Initialized");
                setOpen(false);
                router.refresh();
                if (!voucher) setFormData({ code: "", type: "PERCENTAGE", value: 0, usageLimit: 0, active: true, expiryDate: "" });
            } else {
                toast.error(res.error || "Operation failed");
            }
        } catch (error) {
            toast.error("Critical error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="h-11 px-8 bg-white text-black hover:bg-white/80 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3">
                        <Plus className="w-4 h-4" />
                        New Coupon
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-[#050505]/95 backdrop-blur-2xl border border-white/10 shadow-3xl rounded-[32px] p-0 overflow-hidden outline-none">
                {/* Header with Neon Style */}
                <div className="relative bg-[#111111] p-10 text-white shrink-0 overflow-hidden border-b border-white/5">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                                <Ticket className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                                    {voucher ? "Refine Coupon" : "Forge Coupon"}
                                </DialogTitle>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 ml-1">Discount Protocol Initialization</p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    {/* Section 1: Identity & Value */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-white rounded-full" />
                            <h3 className="pro-label text-white/80">Financial Definition</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="pro-label text-white/20 ml-1">Universal Code</Label>
                                <Input 
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. SUMMER99"
                                    className="h-14 bg-white/5 border-white/5 border-[3px] rounded-[18px] focus:ring-white/20 focus:border-white/20 font-black text-[15px] px-6 shadow-sm transition-all text-center uppercase tracking-widest text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="pro-label text-white/20 ml-1">Reward Value</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        required
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                        className="h-14 bg-white/5 border-white/5 border-[3px] rounded-[18px] focus:ring-white/20 focus:border-white/20 font-black text-[18px] px-6 shadow-sm transition-all text-white"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 p-1 bg-white/[0.03] rounded-xl overflow-hidden shrink-0">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: "PERCENTAGE"})}
                                            className={cn("w-10 h-8 flex items-center justify-center rounded-lg transition-all font-black text-[10px]", formData.type === "PERCENTAGE" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white")}
                                        >
                                            <Percent className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: "FIXED"})}
                                            className={cn("w-10 h-8 flex items-center justify-center rounded-lg transition-all font-black text-[10px]", formData.type === "FIXED" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white")}
                                        >
                                            <CircleDollarSign className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Constraints */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-white rounded-full" />
                            <h3 className="pro-label text-white/80">Operational Boundaries</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="pro-label text-white/20 ml-1">Usage Ceiling (0=INF)</Label>
                                <div className="relative group">
                                    <Input 
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                        className="h-14 bg-white/5 border-white/5 border-[3px] rounded-[18px] focus:ring-white/20 focus:border-white/20 font-black text-[15px] px-6 shadow-sm transition-all text-white"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="pro-label text-white/20 ml-1">Terminal Date</Label>
                                <div className="relative">
                                    <Input 
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="h-14 bg-white/5 border-white/5 border-[3px] rounded-[18px] focus:ring-white/20 focus:border-white/20 font-black text-[13px] px-6 shadow-sm transition-all text-white"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, active: !formData.active})}
                            className={cn(
                                "w-full h-16 rounded-[22px] border-[3px] flex items-center justify-between px-8 transition-all duration-500",
                                formData.active 
                                ? "bg-white border-white text-black shadow-xl shadow-white/5" 
                                : "bg-white/5 border-white/5 text-white/40"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", formData.active ? "bg-black/10" : "bg-white/5")}>
                                    {formData.active ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                                    Protocol Status: {formData.active ? "Active" : "Locked"}
                                </span>
                            </div>
                            <div className={cn("w-10 h-5 rounded-full p-1 transition-colors duration-500", formData.active ? "bg-emerald-500" : "bg-white/10")}>
                                <div className={cn("w-3 h-3 bg-white rounded-full transition-transform duration-500", formData.active ? "translate-x-5" : "translate-x-0")} />
                            </div>
                        </button>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="flex-1 h-14 rounded-[20px] font-black text-white/40 uppercase text-[11px] tracking-[0.3em] hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            className="flex-[2] h-14 rounded-[20px] bg-white text-black hover:bg-white/80 font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? "Forging..." : voucher ? "Refine Coupon" : "Instantiate Coupon"}
                            <Zap className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
