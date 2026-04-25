import { getAdminTeamMembers, deleteTeamMember } from "@/lib/actions/admin";
import { UserCircle, Shield, Mail, Key, Trash2, ShieldCheck, UserCog, Ghost, Activity, Users, Clock, Truck } from "lucide-react";

export const dynamic = 'force-dynamic';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AddMemberModal } from "@/components/admin/AddMemberModal";
import { EditMemberModal } from "@/components/admin/EditMemberModal";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

const ROLE_STYLES: Record<string, { label: string, color: string, icon: any, border: string }> = {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-black text-white", border: "border-black", icon: ShieldCheck },
    ADMIN: { label: "Administrator", color: "bg-gray-100 text-gray-800", border: "border-gray-200", icon: Shield },
    MANAGER: { label: "Manager", color: "bg-blue-50 text-blue-600", border: "border-blue-100", icon: UserCog },
    DRIVER: { label: "Logistics / Driver", color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", icon: Truck },
    STAFF: { label: "Staff", color: "bg-gray-50 text-gray-500", border: "border-gray-200", icon: Ghost },
};

export default async function AdminTeamPage() {
    const staff = await getAdminTeamMembers();

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Team Directory</h1>
                    <p className="text-[13px] text-gray-500">Manage personnel and access privileges across the workspace.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-black leading-none">{staff.length}</span>
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Active Personnel</span>
                        </div>
                    </div>
                    <AddMemberModal />
                </div>
            </div>

            {/* TEAM MATRIX TABLE */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 pl-6 font-semibold text-[11px] uppercase tracking-wider text-gray-500">Personnel Identity</th>
                                <th className="p-4 font-semibold text-[11px] uppercase tracking-wider text-gray-500">Access Level</th>
                                <th className="p-4 font-semibold text-[11px] uppercase tracking-wider text-gray-500">Contact Protocol</th>
                                <th className="p-4 font-semibold text-[11px] uppercase tracking-wider text-gray-500">Registry Date</th>
                                <th className="p-4 pr-6 text-right font-semibold text-[11px] uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                <Ghost className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-black font-semibold text-[14px] tracking-tight">No personnel registered</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => {
                                    const style = ROLE_STYLES[member.role] || ROLE_STYLES.STAFF;
                                    const RoleIcon = style.icon;

                                    return (
                                        <tr key={member.id} className="hover:bg-gray-50 transition-all duration-300">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                        {member.image ? (
                                                            <Image src={member.image} alt={member.name || 'Member'} fill className="object-cover" unoptimized />
                                                        ) : (
                                                            <UserCircle className="w-6 h-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-black text-[14px] line-clamp-1">{member.name || 'Undefined Identity'}</span>
                                                        <span className="text-gray-500 text-[11px] font-medium leading-none mt-1">@{member.username || 'staff'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                                    style.color,
                                                    style.border
                                                )}>
                                                    <RoleIcon className="w-3.5 h-3.5" />
                                                    {style.label}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors duration-300">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="text-[13px] font-medium">{member.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-black font-medium text-[13px]">
                                                        {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                {member.role !== 'SUPER_ADMIN' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <EditMemberModal member={member} />
                                                        <form action={async () => {
                                                            "use server"
                                                            await deleteTeamMember(member.id);
                                                            revalidatePath('/admin/team');
                                                        }}>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </form>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end">
                                                        <div className="h-8 w-8 flex items-center justify-center bg-gray-50 rounded-md text-gray-400 cursor-not-allowed">
                                                            <Key className="w-4 h-4" />
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
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">System operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
