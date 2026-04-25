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
    Pencil,
    Shield, 
    Mail, 
    Key, 
    LayoutDashboard, 
    ShoppingCart, 
    Tag, 
    Layers, 
    Users, 
    Megaphone, 
    Ticket,
    Gem, 
    ImageIcon, 
    Settings as SettingsIcon, 
    CheckCircle2,
    X,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Truck,
    Store,
    Terminal
} from "lucide-react";
import { updateTeamMember } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PAGES = [
    { id: "all", name: "Full Admin Pass", desc: "Global system access", icon: CheckCircle2 },
    { id: "dashboard", name: "Dashboard", desc: "Analytics and overview", icon: LayoutDashboard },
    { id: "orders", name: "Orders", desc: "Purchase management", icon: ShoppingCart },
    { id: "products", name: "Products", desc: "Inventory assets", icon: Tag },
    { id: "categories", name: "Categories", desc: "Store organization", icon: Layers },
    { id: "customers", name: "Customers", desc: "Guest relationship", icon: Users },
    { id: "drivers", name: "Drivers", desc: "Logistics fleet", icon: Truck },
    { id: "store", name: "Store", desc: "Front-end builder", icon: Store },
    { id: "banners", name: "Banners", desc: "Homepage visuals", icon: Megaphone },
    { id: "notice", name: "Notice Bar", desc: "System announcements", icon: Terminal },
    { id: "vouchers", name: "Vouchers", desc: "Discount strategies", icon: Ticket },
    { id: "brands", name: "Brands", desc: "Vendor directory", icon: Gem },
    { id: "logo", name: "Logo", desc: "Brand identity", icon: ImageIcon },
    { id: "settings", name: "Settings", desc: "General config", icon: SettingsIcon },
    { id: "team", name: "Team", desc: "Staff management", icon: Shield },
];

interface EditMemberModalProps {
    member: any;
}

export function EditMemberModal({ member }: EditMemberModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: member.name || "",
        email: member.email || "",
        password: "",
        role: member.role || "ADMIN",
        permissions: member.permissions ? (typeof member.permissions === 'string' ? JSON.parse(member.permissions) : member.permissions) : []
    });

    const ROLE_OPTIONS = [
        { value: "ADMIN", label: "Administrator" },
        { value: "MANAGER", label: "Manager" },
        { value: "DRIVER", label: "Driver / Logistics" },
        { value: "STAFF", label: "Staff" },
    ];
    
    const togglePermission = (id: string, access: "visitor" | "editor" = "editor") => {
        if (id === "all") {
            const allIds = PAGES.filter(p => p.id !== "all").map(p => ({ id: p.id, access: "editor" as const }));
            const isAllSelected = allIds.every(p => formData.permissions.some((fp: any) => fp.id === p.id && fp.access === "editor"));
            
            setFormData(prev => ({
                ...prev,
                permissions: isAllSelected ? [] : allIds,
                role: isAllSelected ? prev.role : "SUPER_ADMIN"
            }));
            return;
        }

        setFormData(prev => {
            const existing = prev.permissions.find((p: any) => p.id === id);
            let newPermissions;

            if (existing && (existing as any).access === access) {
                newPermissions = prev.permissions.filter((p: any) => p.id !== id);
            } else if (existing) {
                newPermissions = prev.permissions.map((p: any) => p.id === id ? { id, access } : p);
            } else {
                newPermissions = [...prev.permissions, { id, access }];
            }
            
            const allIds = PAGES.filter(p => p.id !== "all").map(p => p.id);
            const isAllSelected = allIds.every(pid => newPermissions.some((p: any) => p.id === pid && p.access === "editor"));

            return {
                ...prev,
                permissions: newPermissions,
                role: isAllSelected ? "SUPER_ADMIN" : prev.role
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateTeamMember(member.id, {
                ...formData,
                permissions: JSON.stringify(formData.permissions)
            } as any);
            
            if (res.success) {
                toast.success("PROFILE UPDATED SUCCESSFULLY");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(res.error || "Update failure");
            }
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-black hover:bg-gray-100 transition-all rounded-md">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white border-gray-100 shadow-2xl rounded-3xl p-0 overflow-hidden flex flex-col outline-none max-h-[92vh]">
                <DialogHeader className="p-6 border-b border-gray-50 flex flex-row items-center justify-between shrink-0">
                    <div>
                        <DialogTitle className="text-xl font-black text-black uppercase tracking-tight">Edit Member Profile</DialogTitle>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Modify access and credentials</p>
                    </div>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400">
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <div className="overflow-y-auto no-scrollbar px-8 py-6 space-y-8 flex-1">
                    <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                                <Input 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-black font-bold text-[13px] px-5 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                                <Input 
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-black font-bold text-[13px] px-5 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password (Empty to keep current)</Label>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-black font-bold text-[13px] px-5 transition-all outline-none pr-12"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 1.5: Role Selector */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Role</Label>
                            <select
                                value={formData.role === "SUPER_ADMIN" ? "ADMIN" : formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black font-bold text-[13px] px-5 transition-all outline-none appearance-none cursor-pointer"
                            >
                                {ROLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section 2: Permissions Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Permissions Matrix</h3>
                                <div className="flex items-center gap-4">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-black/10" />
                                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Viewer</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-black" />
                                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Editor</span>
                                     </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* All Access Option */}
                                {(() => {
                                    const allIds = PAGES.filter(p => p.id !== "all").map(p => p.id);
                                    const isAllSelected = allIds.every(pid => formData.permissions.some((p: any) => p.id === pid && p.access === "editor"));
                                    return (
                                        <div 
                                            onClick={() => togglePermission("all")}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                                isAllSelected 
                                                    ? "bg-black border-black shadow-xl" 
                                                    : "bg-gray-50 border-gray-50 hover:border-gray-100"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                    isAllSelected ? "bg-white/10 text-white" : "bg-white text-gray-400"
                                                )}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("text-[13px] font-black uppercase tracking-tight", isAllSelected ? "text-white" : "text-black")}>Supreme Admin Access</span>
                                                    <span className={cn("text-[9px] font-bold uppercase tracking-widest", isAllSelected ? "text-white/40" : "text-gray-400")}>Full Global Permissions</span>
                                                </div>
                                            </div>
                                            {isAllSelected && <Lock className="w-4 h-4 text-white" />}
                                        </div>
                                    );
                                })()}

                                {/* Individual Permissions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
                                    {PAGES.filter(p => p.id !== "all").map((page) => {
                                        const Icon = page.icon;
                                        const activePermission = formData.permissions.find((p: any) => p.id === page.id);
                                        const access = (activePermission as any)?.access;

                                        return (
                                            <div key={page.id} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center",
                                                        access ? "bg-black text-white" : "bg-gray-50 text-gray-300"
                                                    )}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-black uppercase">{page.name}</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{page.desc}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePermission(page.id, "visitor")}
                                                        className={cn(
                                                            "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                                                            access === "visitor" ? "bg-black/5 border-black/10 text-black" : "bg-transparent border-gray-100 text-gray-300 hover:text-gray-400"
                                                        )}
                                                    >
                                                        Viewer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePermission(page.id, "editor")}
                                                        className={cn(
                                                            "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                                                            access === "editor" ? "bg-black border-black text-white" : "bg-transparent border-gray-100 text-gray-300 hover:text-gray-400"
                                                        )}
                                                    >
                                                        Editor
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-8 border-t border-gray-50 flex gap-4 bg-white shrink-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="flex-1 h-12 rounded-xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:text-black"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-member-form"
                        disabled={loading}
                        className="flex-[2] h-12 rounded-xl bg-black text-white hover:bg-black/90 font-black uppercase text-[11px] tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
