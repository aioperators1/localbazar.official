"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Ticket, Calendar, Users, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createVoucher, deleteVoucher, updateVoucher } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { usePermissions } from "@/hooks/use-permissions";

export default function VouchersClient({ initialVouchers }: { initialVouchers: any[] }) {
    const { canEdit } = usePermissions();
    const [vouchers, setVouchers] = useState<any[]>(initialVouchers);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        type: "FIXED",
        value: 0,
        expiryDate: "",
        usageLimit: 0,
        active: true
    });

    const resetForm = () => {
        setFormData({ code: "", type: "FIXED", value: 0, expiryDate: "", usageLimit: 0, active: true });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleCreate = async () => {
        if (!canEdit('vouchers')) return toast.error("Access Denied: Editor permission required");
        if (!formData.code || formData.value <= 0) return toast.error("Please fill all required fields");
        setLoading(true);
        const res = await createVoucher(formData);
        if (res.success) {
            toast.success("Voucher created successfully");
            window.location.reload();
        } else {
            toast.error("Error creating voucher");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        if (!canEdit('vouchers')) return toast.error("Access Denied: Editor permission required");
        setLoading(true);
        const res = await updateVoucher(id, formData);
        if (res.success) {
            toast.success("Voucher updated successfully");
            window.location.reload();
        } else {
            toast.error("Error updating voucher");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!canEdit('vouchers')) return toast.error("Access Denied: Editor permission required");
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        const res = await deleteVoucher(id);
        if (res.success) {
            toast.success("Deleted successfully");
            setVouchers(vouchers.filter((v: any) => v.id !== id));
        } else {
            toast.error("Error deleting");
        }
        setLoading(false);
    };

    const startEditing = (voucher: any) => {
        if (!canEdit('vouchers')) return toast.error("Access Denied: Editor permission required");
        setFormData({
            code: voucher.code,
            type: voucher.type,
            value: voucher.value,
            expiryDate: voucher.expiryDate ? voucher.expiryDate.split('T')[0] : "",
            usageLimit: voucher.usageLimit,
            active: voucher.active
        });
        setIsEditing(voucher.id);
        setIsCreating(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Promotions & Vouchers</h1>
                    <p className="text-[13px] text-[#616161] font-medium mt-1">Manage discount codes and special offers.</p>
                </div>
                {!isCreating && canEdit('vouchers') && (
                    <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-[#303030] h-11 px-6 rounded-xl font-bold text-[13px] uppercase tracking-widest shadow-lg">
                        <Plus className="w-4 h-4 mr-2" /> Add Voucher
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-8 rounded-2xl border border-[#E3E3E3] shadow-xl space-y-8 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#616161]">Voucher Code</Label>
                            <Input 
                                value={formData.code}
                                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                placeholder="e.g. SUMMER2026"
                                className="h-12 border-[#D2D2D2] font-mono font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#616161]">Discount Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={val => setFormData({...formData, type: val})}
                            >
                                <SelectTrigger className="h-12 border-[#D2D2D2]">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIXED">Fixed Amount (QAR)</SelectItem>
                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#616161]">Value</Label>
                            <Input 
                                type="number"
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                                className="h-12 border-[#D2D2D2]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#616161]">Expiry Date</Label>
                            <Input 
                                type="date"
                                value={formData.expiryDate}
                                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                className="h-12 border-[#D2D2D2]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#616161]">Usage Limit (0 for unlimited)</Label>
                            <Input 
                                type="number"
                                value={formData.usageLimit}
                                onChange={e => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                                className="h-12 border-[#D2D2D2]"
                            />
                        </div>
                        <div className="flex items-center gap-4 pt-10">
                            <input 
                                type="checkbox" 
                                checked={formData.active}
                                onChange={e => setFormData({...formData, active: e.target.checked})}
                                className="w-5 h-5 accent-black"
                                id="active"
                            />
                            <Label htmlFor="active" className="text-[13px] font-bold uppercase tracking-wider cursor-pointer">Voucher Active</Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-[#F1F1F1]">
                        <Button variant="outline" onClick={resetForm} disabled={loading} className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest">Cancel</Button>
                        <Button
                            onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                            disabled={loading}
                            className="h-12 px-10 bg-black hover:bg-[#303030] text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-black/10"
                        >
                            {loading ? "Processing..." : (isEditing ? "Save Changes" : "Activate Voucher")}
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vouchers.map((voucher: any) => (
                    <div key={voucher.id} className="bg-white border border-[#E3E3E3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className={cn(
                            "absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-xl",
                            voucher.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                        )}>
                            {voucher.active ? "Active" : "Disabled"}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#F9F9F9] rounded-xl flex items-center justify-center border border-[#F1F1F1] shrink-0">
                                <Ticket className="w-6 h-6 text-[#111111]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-xl text-[#111111] leading-none tracking-tight">{voucher.code}</h3>
                                <p className="text-[11px] text-[#616161] mt-2 font-bold uppercase tracking-widest">
                                    {voucher.type === 'PERCENTAGE' ? `${voucher.value}% OFF` : `QAR ${voucher.value} OFF`}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-[12px] text-[#616161] font-medium">
                                <Calendar className="w-4 h-4 text-[#D2D2D2]" />
                                <span>Expires: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-[#616161] font-medium">
                                <Users className="w-4 h-4 text-[#D2D2D2]" />
                                <span>Usage: {voucher.usedCount} / {voucher.usageLimit === 0 ? '∞' : voucher.usageLimit}</span>
                            </div>
                        </div>

                        {canEdit('vouchers') && (
                            <div className="flex items-center gap-3 pt-4 border-t border-[#F1F1F1]">
                                <Button variant="outline" size="sm" onClick={() => startEditing(voucher)} className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                    <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(voucher.id)} className="w-10 h-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-[#F1F1F1]">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {vouchers.length === 0 && !isCreating && (
                    <div className="col-span-full py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                        <Ticket className="w-12 h-12 text-zinc-300 mb-4" />
                        <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No vouchers issued yet</h3>
                        <p className="text-zinc-400 text-xs mt-2">Start your first promotional campaign today.</p>
                        <Button onClick={() => setIsCreating(true)} variant="link" className="text-black font-black uppercase tracking-widest text-[10px] mt-4">
                            Issue New Voucher
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
