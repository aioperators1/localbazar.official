import { getAdminCustomers } from "@/lib/actions/admin";
import { UserCircle, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function AdminCustomersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers: any[] = await getAdminCustomers();

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Customer Intelligence</h1>
                        <p className="text-[13px] text-white/40 font-medium mt-1">Manage institutional client relationships and behavioral metrics.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-3xl">
                        <Users className="w-5 h-5 text-white/40" />
                        <div className="flex flex-col">
                            <span className="text-[14px] font-black text-white tracking-tighter">{customers.length}</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Total Directory</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card border border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
                <table className="w-full text-left text-[14px] border-collapse bg-[#0A0A0A]/40 backdrop-blur-2xl">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="p-6 font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Registry Identity</th>
                            <th className="p-6 font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Tier Classification</th>
                            <th className="p-6 font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Geographic Node</th>
                            <th className="p-6 font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Activity Volume</th>
                            <th className="p-6 text-right font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Lifetime Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {customers.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="p-24 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-10">
                                    <Users className="w-16 h-16 text-white" />
                                    <p className="text-white font-black uppercase tracking-[0.3em] text-[11px]">Directory Empty</p>
                                </div>
                            </td>
                        </tr>
                        ) : (
                             customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-white/[0.02] transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                {customer.image ? (
                                                    <Image src={customer.image} alt={customer.name || 'Member'} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                                                ) : (
                                                    <UserCircle className="w-7 h-7 text-white/20 group-hover:text-white transition-colors" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-white text-[15px] uppercase tracking-tighter italic">{customer.name || 'Anonymous User'}</span>
                                                <span className="text-white/40 font-bold text-[11px] uppercase tracking-widest">{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex">
                                            <span className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                customer.role === 'ADMIN' 
                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                                                    : "bg-white/5 text-white/40 border-white/10 group-hover:bg-white group-hover:text-black group-hover:border-transparent"
                                            )}>
                                                {customer.role === 'ADMIN' ? "Intelligence Administrator" : "Verified Client"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-white/40 font-bold uppercase tracking-widest text-[11px]">QATAR REGION</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-[14px] uppercase tracking-tighter italic">{customer.orders.length || 0} Transactions</span>
                                            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Active State</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-black text-white text-[16px] uppercase tracking-tighter italic">QAR 0.00</span>
                                            <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">Cumulative Revenue</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
