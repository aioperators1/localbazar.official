import { getAdminTeamMembers, deleteTeamMember } from "@/lib/actions/admin";
import { UserCircle, Shield, Mail, Key, Trash2, ShieldCheck, UserCog, Ghost, Activity, Users, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AddMemberModal } from "@/components/admin/AddMemberModal";
import { EditMemberModal } from "@/components/admin/EditMemberModal";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

const ROLE_STYLES: Record<string, { label: string, color: string, icon: any, border: string }> = {
    SUPER_ADMIN: { label: "Supreme Admin", color: "bg-white text-black", border: "border-white/20", icon: ShieldCheck },
    ADMIN: { label: "Administrator", color: "bg-amber-500/10 text-amber-500", border: "border-amber-500/20", icon: Shield },
    MANAGER: { label: "Operational Manager", color: "bg-blue-500/10 text-blue-500", border: "border-blue-500/20", icon: UserCog },
    STAFF: { label: "Field Analyst", color: "bg-white/5 text-white/40", border: "border-white/10", icon: Ghost },
};

export default async function AdminTeamPage() {
    const staff = await getAdminTeamMembers();

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* 🌌 ULTRA PRO HEADER */}
            <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between group">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-[22px] flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-110 transition-all duration-700">
                            <Shield className="w-7 h-7 text-white/40" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Security Matrix</h1>
                            <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.4em] mt-2 ml-1">Universal Personnel Proxy Hub</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-3xl">
                        <Users className="w-5 h-5 text-white/20" />
                        <div className="flex flex-col">
                            <span className="text-[14px] font-black text-white tracking-tighter leading-none">{staff.length} Active</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Personnel</span>
                        </div>
                    </div>
                    <AddMemberModal />
                </div>
            </div>

            {/* 💎 TEAM MATRIX TABLE */}
            <div className="glass-card border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-[40px] overflow-hidden bg-[#0A0A0A]/40 backdrop-blur-3xl">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em] text-white/20">Operational Identity</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em] text-white/20">Access Protocol</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em] text-white/20">Frequency Channel</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.25em] text-white/20">Registry Timestamp</th>
                                <th className="p-8 text-right font-black text-[10px] uppercase tracking-[0.25em] text-white/20">Directive Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-40 text-center">
                                        <div className="flex flex-col items-center gap-8 opacity-10">
                                            <div className="w-24 h-24 rounded-[40px] bg-white/10 flex items-center justify-center animate-pulse">
                                                <Ghost className="w-12 h-12" />
                                            </div>
                                            <p className="text-white font-black uppercase text-xs tracking-[0.5em]">No personnel synchronized</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => {
                                    const style = ROLE_STYLES[member.role] || ROLE_STYLES.STAFF;
                                    const RoleIcon = style.icon;

                                    return (
                                        <tr key={member.id} className="group hover:bg-white/[0.02] transition-all duration-500">
                                            <td className="p-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative w-14 h-14 rounded-[22px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 overflow-hidden shrink-0 group-hover:scale-105 transition-all duration-700 shadow-2xl">
                                                        {member.image ? (
                                                            <Image src={member.image} alt={member.name || 'Member'} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                                                        ) : (
                                                            <UserCircle className="w-8 h-8 opacity-30" />
                                                        )}
                                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-white text-[16px] tracking-tight uppercase italic group-hover:translate-x-1 transition-transform">{member.name || 'Undefined Identity'}</span>
                                                        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit">
                                                            <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">@{member.username || 'staff'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className={cn(
                                                    "inline-flex items-center gap-3 px-5 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest border transition-all duration-500 group-hover:scale-105",
                                                    style.color,
                                                    style.border
                                                )}>
                                                    <RoleIcon className="w-3.5 h-3.5" />
                                                    {style.label}
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col gap-1.5 font-mono">
                                                    <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors duration-500">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        <span className="text-[14px] font-black tracking-tighter">{member.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-white font-black text-[14px] uppercase italic">
                                                        <Clock className="w-3.5 h-3.5 text-white/20" />
                                                        {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <span className="text-white/20 text-[9px] font-black uppercase tracking-widest ml-5">Operational Since</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right">
                                                {member.role !== 'SUPER_ADMIN' ? (
                                                    <div className="flex items-center justify-end gap-3">
                                                        <EditMemberModal member={member} />
                                                        <form action={async () => {
                                                            "use server"
                                                            await deleteTeamMember(member.id);
                                                            revalidatePath('/admin/team');
                                                        }}>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-12 w-12 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </Button>
                                                        </form>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end">
                                                        <div className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white/20 cursor-not-allowed group/key overflow-hidden relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/key:opacity-100 transition-opacity" />
                                                            <Key className="w-5 h-5 relative z-10" />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Insight Component */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">All operational channels secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
