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
    Key, 
    X,
    Eye,
    EyeOff,
    ShieldCheck
} from "lucide-react";
import { updateTeamMember } from "@/lib/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChangePasswordModalProps {
    member: any;
}

export function ChangePasswordModal({ member }: ChangePasswordModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("PASSWORDS DO NOT MATCH");
            return;
        }

        if (password.length < 6) {
            toast.error("PASSWORD MUST BE AT LEAST 6 CHARACTERS");
            return;
        }

        setLoading(true);
        try {
            const res = await updateTeamMember(member.id, {
                password: password
            } as any);
            
            if (res.success) {
                toast.success("PASSWORD UPDATED SUCCESSFULLY");
                setOpen(false);
                setPassword("");
                setConfirmPassword("");
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
                <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-md">
                    <Key className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-gray-100 shadow-2xl rounded-3xl p-0 overflow-hidden flex flex-col outline-none">
                <DialogHeader className="p-6 border-b border-gray-50 flex flex-row items-center justify-between shrink-0">
                    <div>
                        <DialogTitle className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            Update Security
                        </DialogTitle>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Change password for {member.name}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400">
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <div className="px-8 py-6 space-y-6">
                    <form id="change-password-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Secure Password</Label>
                            <div className="relative">
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</Label>
                            <Input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-black font-bold text-[13px] px-5 transition-all outline-none"
                            />
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
                        form="change-password-form"
                        disabled={loading}
                        className="flex-[2] h-12 rounded-xl bg-black text-white hover:bg-black/90 font-black uppercase text-[11px] tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
