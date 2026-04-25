"use client";

import { useState } from "react";
import { Plus, X, Loader2, ShieldCheck, User, Smartphone, Mail, Key, Zap, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createDriver } from "@/lib/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

export function CreateDriverDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await createDriver({ name, phone, email, password });
            if (res.success) {
                toast.success("Carrier Protocol Initialized");
                setOpen(false);
            } else {
                toast.error(res.error || "Execution failed");
            }
        } catch (error) {
            toast.error("An unexpected system error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 bg-black text-white hover:bg-[#333] px-10 rounded-xl text-[11px] font-black uppercase tracking-[3px] shadow-2xl shadow-black/20 group overflow-hidden relative">
                    <span className="relative z-10 flex items-center">
                       <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform duration-500" /> 
                       Deploy New Carrier
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
            </DialogTrigger>
            <AnimatePresence>
                {open && (
                    <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl bg-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="bg-black p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16 blur-xl" />
                                <Fingerprint className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                                
                                <DialogHeader className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                                        <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                                    </div>
                                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                                        Carrier Initialization
                                    </DialogTitle>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[4px] mt-3">Assign Secure Logistics Access</p>
                                </DialogHeader>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
                                            <User className="w-3.5 h-3.5 text-gray-200" />
                                        </div>
                                        <Input name="name" required placeholder="Ex: Ahmed El Mansouri" className="h-14 border-gray-100 bg-gray-50/50 rounded-2xl focus:border-black focus:ring-0 placeholder:text-gray-300 font-bold text-[14px] transition-all px-5" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Phone</Label>
                                            <Smartphone className="w-3.5 h-3.5 text-gray-200" />
                                        </div>
                                        <Input name="phone" required placeholder="+212 6..." className="h-14 border-gray-100 bg-gray-50/50 rounded-2xl focus:border-black focus:ring-0 placeholder:text-gray-300 font-bold text-[14px] transition-all px-5" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                                            <Mail className="w-3.5 h-3.5 text-gray-200" />
                                        </div>
                                        <Input name="email" type="email" required placeholder="logistics@localbazar.com" className="h-14 border-gray-200 bg-gray-50/50 rounded-2xl focus:border-black focus:ring-0 placeholder:text-gray-300 font-bold text-[14px] transition-all px-5" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Access Key</Label>
                                            <Key className="w-3.5 h-3.5 text-gray-200" />
                                        </div>
                                        <Input name="password" type="password" required placeholder="8+ characters recommended" className="h-14 border-gray-100 bg-gray-50/50 rounded-2xl focus:border-black focus:ring-0 placeholder:text-gray-300 font-bold text-[14px] transition-all px-5" />
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-16 bg-black text-white hover:bg-[#222] rounded-2xl font-black uppercase tracking-[3px] text-[12px] transition-all shadow-xl shadow-black/10 active:scale-95">
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            Execute Deployment <ShieldCheck className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
}
