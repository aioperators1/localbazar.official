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
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Ultra Pro Max Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between group">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-700">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Voucher Terminal</h1>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] pl-1.5 relative">
                        Strategic Discount Management
                        <span className="absolute -bottom-3 left-1 w-20 h-1.5 bg-white rounded-full shadow-lg shadow-white/10 transition-all group-hover:w-32" />
                    </p>
                </div>
                <VoucherModal />
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                {vouchers.length === 0 ? (
                    <div className="lg:col-span-2 xl:col-span-3 p-32 text-center rounded-[40px] border-4 border-dashed border-white/5 bg-white/[0.02] group hover:border-white/10 transition-all">
                        <div className="flex flex-col items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Ticket className="w-16 h-16 group-hover:scale-125 transition-transform duration-700 text-white" />
                            <p className="text-white font-black uppercase text-xs tracking-[0.3em]">No Coupons Forge Yet</p>
                        </div>
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
                                    "flex flex-col glass-card rounded-[40px] border-2 p-8 shadow-2xl group transition-all duration-700 relative overflow-hidden",
                                    isLocked ? "border-rose-500/10 grayscale opacity-80" : "border-white/5 hover:border-white/20"
                                )}
                            >
                                {/* Ambient Glow */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />
                                
                                 {/* Identity Block */}
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-black italic tracking-tighter text-white group-hover:scale-110 origin-left transition-transform duration-500 uppercase">{voucher.code}</span>
                                            <button className="p-2 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.2em] mt-1.5",
                                            isLocked ? "text-rose-500" : "text-emerald-500"
                                        )}>
                                            {isLocked ? "Protocol Locked" : "Execution Active"}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "w-16 h-16 rounded-[24px] flex flex-col items-center justify-center text-black shadow-2xl transition-all",
                                        isLocked ? "bg-white/20" : "bg-white group-hover:scale-110 group-hover:rotate-3"
                                    )}>
                                        <span className="text-[18px] font-black leading-none">{voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}</span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-60">Reward</span>
                                    </div>
                                </div>

                                {/* Analytics Strip */}
                                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                    <div className="bg-white/5 p-4 rounded-3xl flex items-center gap-4 border border-white/5">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl shadow-sm flex items-center justify-center text-white/60">
                                            <Receipt className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Status</span>
                                            <span className="font-black text-[11px] text-white uppercase ">{voucher.type === 'PERCENTAGE' ? 'Variable %' : 'Static Val'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl flex items-center gap-4 border border-white/5">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl shadow-sm flex items-center justify-center text-white/60">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col shrink-0">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Terminal</span>
                                            <span className="font-black text-[11px] text-white uppercase truncate max-w-[80px]">
                                                {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : 'INF'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Module */}
                                <div className="space-y-3 mb-10 relative z-10">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">Usage Capture</span>
                                        <span className="text-white/20">{voucher.usedCount} / {voucher.usageLimit === 0 ? 'INF' : voucher.usageLimit}</span>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-full p-1.5 overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg shadow-white/10"
                                            style={{ width: `${voucher.usageLimit === 0 ? 0 : Math.min(usagePercent, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Footer Commands */}
                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                                    <VoucherUsagePanel voucher={voucher} />
                                    
                                    <div className="flex items-center gap-2">
                                        <VoucherModal 
                                            voucher={voucher} 
                                            trigger={
                                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all shadow-sm">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            }
                                        />
                                        <form action={async () => {
                                            "use server"
                                            await deleteVoucher(voucher.id);
                                            revalidatePath('/admin/vouchers');
                                        }}>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-500 hover:text-white text-white/40 transition-all shadow-sm">
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
