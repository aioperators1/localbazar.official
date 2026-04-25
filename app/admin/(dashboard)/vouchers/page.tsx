import { getAdminVouchers, deleteVoucher } from "@/lib/actions/admin";
import { Voucher } from "@/types/admin";
import { 
    Ticket, 
    Settings, 
    Trash2, 
    Zap, 
    Lock, 
    ShieldCheck, 
    Ghost, 
    Copy, 
    Clock, 
    Users, 
    CreditCard, 
    Receipt
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { VoucherModal } from "@/components/admin/VoucherModal";
import { VoucherUsagePanel } from "@/components/admin/VoucherUsagePanel";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function AdminVouchersPage() {
    const vouchers = await getAdminVouchers();

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Vouchers</h1>
                    <p className="text-[13px] text-gray-500">Manage promotional codes and discounts.</p>
                </div>
                <VoucherModal />
            </div>

            {/* Voucher Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                {vouchers.length === 0 ? (
                    <div className="lg:col-span-2 xl:col-span-3 py-20 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center">
                        <Ticket className="w-10 h-10 text-gray-400 mb-4" />
                        <h3 className="text-black font-semibold text-[14px]">No Vouchers Active</h3>
                        <p className="text-gray-500 text-[12px] mt-1">Create a new voucher code to offer discounts.</p>
                    </div>
                ) : (
                    vouchers.map((voucher: Voucher) => {
                        const usagePercent = voucher.usageLimit > 0 ? (voucher.usedCount / voucher.usageLimit) * 100 : 0;
                        const isExpired = voucher.expiryDate && new Date(voucher.expiryDate) < new Date();
                        const isLocked = !voucher.active || (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) || isExpired;

                        return (
                             <div 
                                key={voucher.id} 
                                className={cn(
                                    "flex flex-col bg-white rounded-xl border p-6 shadow-sm relative overflow-hidden",
                                    isLocked ? "border-red-100 grayscale opacity-80" : "border-gray-200"
                                )}
                            >
                                 {/* Identity Block */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-black uppercase">{voucher.code}</span>
                                            <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-semibold uppercase tracking-wider mt-1",
                                            isLocked ? "text-red-500" : "text-emerald-500"
                                        )}>
                                            {isLocked ? "Locked / Expired" : "Active"}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-2 rounded-lg flex flex-col items-center justify-center border",
                                        isLocked ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-black text-white border-black"
                                    )}>
                                        <span className="text-[14px] font-bold">{voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}</span>
                                        <span className="text-[9px] font-medium uppercase tracking-wider mt-0.5 opacity-80">Discount</span>
                                    </div>
                                </div>

                                {/* Analytics Strip */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-3 border border-gray-100">
                                        <Receipt className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Type</span>
                                            <span className="font-bold text-[11px] text-black uppercase">{voucher.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-3 border border-gray-100">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-col shrink-0">
                                            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Expiry</span>
                                            <span className="font-bold text-[11px] text-black uppercase truncate max-w-[80px]">
                                                {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Module */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                                        <span>Usage Limit</span>
                                        <span>{voucher.usedCount} / {voucher.usageLimit === 0 ? 'ထ' : voucher.usageLimit}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-black transition-all duration-500"
                                            style={{ width: `${voucher.usageLimit === 0 ? 0 : Math.min(usagePercent, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Footer Commands */}
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <VoucherUsagePanel voucher={voucher} />
                                    
                                    <div className="flex items-center gap-2">
                                        <VoucherModal 
                                            voucher={voucher} 
                                            trigger={
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 bg-gray-50 border border-gray-200 rounded-md transition-all">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            }
                                        />
                                        <form action={async () => {
                                            "use server"
                                            await deleteVoucher(voucher.id);
                                            revalidatePath('/admin/vouchers');
                                        }}>
                                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
