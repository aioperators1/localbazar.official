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
    Plus, 
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
    UserPlus,
    CheckCircle2,
    X,
    Lock,
    Unlock,
    Eye,
    EyeOff
} from "lucide-react";
import { createTeamMember } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGES = [
    { id: "all", name: "Supreme Authority", desc: "Full System Access Protocol", icon: CheckCircle2 },
    { id: "dashboard", name: "Dashboard", desc: "Command & Operations Analytics", icon: LayoutDashboard },
    { id: "orders", name: "Orders", desc: "Transaction & Fulfillment Matrix", icon: ShoppingCart },
    { id: "products", name: "Products", desc: "Inventory Assets Registry", icon: Tag },
    { id: "categories", name: "Categories", desc: "Structural Taxonomy", icon: Layers },
    { id: "customers", name: "Customers", desc: "Client Relationship Management", icon: Users },
    { id: "banners", name: "Banners", desc: "Visual Interface Marketing", icon: Megaphone },
    { id: "vouchers", name: "Vouchers", desc: "Strategic Discount Vectors", icon: Ticket },
    { id: "brands", name: "Brands", desc: "Vendor Ecosystem Directory", icon: Gem },
    { id: "logo", name: "Logo", desc: "Brand Identity Assets", icon: ImageIcon },
    { id: "settings", name: "Settings", desc: "Core System Configuration", icon: SettingsIcon },
    { id: "team", name: "Team", desc: "Security & Access Hub", icon: Shield },
];

export function AddMemberModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        permissions: [] as { id: string, access: "visitor" | "editor" }[]
    });
    
    const togglePermission = (id: string, access: "visitor" | "editor" = "editor") => {
        if (id === "all") {
            const allIds = PAGES.filter(p => p.id !== "all").map(p => ({ id: p.id, access: "editor" as const }));
            const isAllSelected = allIds.every(p => formData.permissions.some(fp => (fp as any).id === p.id && (fp as any).access === "editor"));
            
            setFormData(prev => ({
                ...prev,
                permissions: isAllSelected ? [] : allIds,
                role: isAllSelected ? "ADMIN" : "SUPER_ADMIN"
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
                role: isAllSelected ? "SUPER_ADMIN" : "ADMIN"
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.permissions.length === 0) {
            toast.error("Initialize at least one frequency protocol");
            return;
        }
        setLoading(true);
        try {
            const res = await createTeamMember({
                ...formData,
                permissions: JSON.stringify(formData.permissions)
            } as any);
            
            if (res.success) {
                toast.success("MEMBER ENTITY INITIALIZED");
                setOpen(false);
                setFormData({ name: "", email: "", password: "", role: "ADMIN", permissions: [] });
                window.location.reload();
            } else {
                toast.error(res.error || "Initialization failed");
            }
        } catch (error) {
            toast.error("Critical operational failure");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-14 px-10 bg-white text-black hover:bg-white/90 rounded-[22px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-4">
                    <UserPlus className="w-5 h-5" />
                    Initialize Personnel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] bg-[#0A0A0A] border-white/5 shadow-[0_40px_150px_rgba(0,0,0,1)] rounded-[48px] p-0 overflow-hidden max-h-[92vh] flex flex-col outline-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative p-12 pb-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-3xl shadow-2xl transition-transform hover:scale-110 duration-700">
                            <Shield className="w-8 h-8 text-white/40" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Initialize Protocol</DialogTitle>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Identity Synthesis & Access Matrix Allocation</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="h-14 w-14 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all">
                        <X className="w-7 h-7" />
                    </Button>
                </div>

                <div className="overflow-y-auto no-scrollbar px-12 py-10 space-y-12 flex-1 relative z-10">
                    <form id="member-form" onSubmit={handleSubmit} className="space-y-16">
                        {/* Section 1: Profile Matrix */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/10">01</span>
                                <div className="h-px flex-1 bg-white/5" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Profile Genesis</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Legal Identity Designation</Label>
                                    <Input 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="EXECUTIVE_ID_NAME"
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-[22px] focus:bg-white/[0.05] focus:border-white/20 focus:ring-4 focus:ring-white/5 font-black text-[15px] px-8 text-white placeholder-white/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Communication Terminal</Label>
                                    <Input 
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="frequency@localbazar.com"
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-[22px] focus:bg-white/[0.05] focus:border-white/20 focus:ring-4 focus:ring-white/5 font-black text-[15px] px-8 text-white placeholder-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Secured Logical Passphrase</Label>
                                <div className="relative group/key">
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min. 12 Symbols Required"
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-[22px] focus:bg-white/[0.05] focus:border-white/20 focus:ring-4 focus:ring-white/5 font-black text-[15px] px-8 text-white placeholder-white/10 transition-all pr-16"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Access Protocols Matrix */}
                        <div className="space-y-8 pb-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/10">02</span>
                                    <div className="h-px w-20 bg-white/5" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Operational Matrix</h3>
                                </div>
                                <div className="flex items-center gap-8">
                                     <div className="flex items-center gap-3">
                                         <div className="w-2.5 h-2.5 rounded-full border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                         <span className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase italic">Quantum Visitor</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                         <span className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase italic">System Editor</span>
                                     </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {PAGES.map((page) => {
                                    const Icon = page.icon;
                                    const isActive = formData.permissions.find((p: any) => p.id === page.id);
                                    const access = (isActive as any)?.access;
                                    const isSuper = page.id === "all";
                                    
                                    if (isSuper) {
                                        const allIds = PAGES.filter(p => p.id !== "all").map(p => p.id);
                                        const isAllSelected = allIds.every(pid => formData.permissions.some((p: any) => p.id === pid && p.access === "editor"));

                                        return (
                                            <div key={page.id} className="lg:col-span-2 group/super">
                                                <div 
                                                    onClick={() => togglePermission("all")}
                                                    className={cn(
                                                        "flex items-center gap-8 p-10 rounded-[36px] border-[2px] transition-all duration-700 cursor-pointer overflow-hidden relative",
                                                        isAllSelected 
                                                            ? "bg-white border-white shadow-[0_40px_80px_-20px_rgba(255,255,255,0.2)]" 
                                                            : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                                                    )}
                                                >
                                                    {isAllSelected && (
                                                         <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 animate-pulse" />
                                                    )}
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700",
                                                        isAllSelected ? "bg-black text-white scale-110" : "bg-white/5 text-white/20"
                                                    )}>
                                                        <Icon className="w-8 h-8" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col">
                                                        <span className={cn("text-xl font-black uppercase tracking-tighter italic", isAllSelected ? "text-black" : "text-white")}>Supreme Executioner Protocol</span>
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mt-1", isAllSelected ? "text-black/40" : "text-white/20")}>Universal Administrative Overlook</span>
                                                    </div>
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-700",
                                                        isAllSelected ? "border-black/5 bg-black" : "border-white/5"
                                                    )}>
                                                        {isAllSelected && <Lock className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={page.id} className={cn(
                                            "flex items-center gap-4 group/entry transition-opacity",
                                            isActive ? "opacity-100" : "opacity-30 hover:opacity-100"
                                        )}>
                                            <div className="flex-1 flex items-center gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-[28px] transition-all group-hover/entry:bg-white/[0.04] group-hover/entry:border-white/10 group-hover/entry:shadow-2xl">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                    access === "editor" ? "bg-white text-black" : access === "visitor" ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/20"
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[13px] uppercase tracking-widest text-white leading-none mb-1.5 italic">{page.name}</span>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">{page.desc}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePermission(page.id, "visitor")}
                                                    className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border",
                                                        access === "visitor" ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "bg-white/5 border-white/5 text-white/10 hover:text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    <Unlock className="w-5 h-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => togglePermission(page.id, "editor")}
                                                    className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border",
                                                        access === "editor" ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/5 border-white/5 text-white/10 hover:text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    <Lock className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-12 border-t border-white/5 flex gap-6 bg-[#050505]/80 backdrop-blur-3xl shrink-0 z-20">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="flex-1 h-16 rounded-[24px] font-black text-white/20 uppercase text-[12px] tracking-[0.4em] hover:text-white hover:bg-white/5 transition-all"
                    >
                        Abort Protocol
                    </Button>
                    <Button
                        type="submit"
                        form="member-form"
                        disabled={loading}
                        className="flex-[2] h-16 rounded-[24px] bg-white text-black hover:bg-white/90 font-black uppercase text-[12px] tracking-[0.4em] shadow-2xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Synthesizing..." : "Synchronize Personnel"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
