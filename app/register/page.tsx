"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, UserPlus, ShieldCheck, Mail, Lock, UserCircle } from "lucide-react";
import { registerUser } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { isAr } = useLanguage();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/login?registered=true");
        }
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-burgundy/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-zinc-100 p-10 rounded-[4px] shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100 shadow-sm">
                        <UserPlus className="w-8 h-8 text-[#111111]" />
                    </div>
                    <h1 className="text-3xl font-black text-[#111111] uppercase italic tracking-tighter mb-2">
                        {isAr ? "انشئ حساب" : "Join the Maison"}
                    </h1>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                        {isAr ? "انضم إلى عالم الفخامة والأناقة" : "Enter the world of heritage & luxury."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                            {isAr ? "الاسم الكامل" : "Full Name"}
                        </label>
                        <div className="relative group">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-[#111111] transition-colors" />
                            <Input
                                name="name"
                                placeholder={isAr ? "الاسم (اختياري)" : "NAME (OPTIONAL)"}
                                className="pl-11 h-12 border-zinc-100 bg-[#FAFAFA] text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] transition-all rounded-[2px] text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                            {isAr ? "اسم المستخدم" : "Username"}
                        </label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-[#111111] transition-colors" />
                            <Input
                                name="username"
                                placeholder={isAr ? "اسم المستخدم" : "USERNAME"}
                                required
                                className="pl-11 h-12 border-zinc-100 bg-[#FAFAFA] text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] transition-all rounded-[2px] font-bold text-xs uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                            {isAr ? "البريد الإلكتروني" : "Email Address"}
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-[#111111] transition-colors" />
                            <Input
                                name="email"
                                type="email"
                                placeholder={isAr ? "البريد الإلكتروني" : "CONCIERGE@MAISON.COM"}
                                required
                                className="pl-11 h-12 border-zinc-100 bg-[#FAFAFA] text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] transition-all rounded-[2px] text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                            {isAr ? "كلمة المرور" : "Signature Password"}
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-[#111111] transition-colors" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="pl-11 h-12 border-zinc-100 bg-[#FAFAFA] text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] transition-all rounded-[2px]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-3 rounded-[2px] border border-red-100 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 bg-[#111111] hover:bg-brand-burgundy text-white font-bold uppercase tracking-[0.3em] rounded-[2px] shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? "تأكيد التسجيل" : "Request Access")}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-50 pt-8">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                        {isAr ? "هل لديك حساب بالفعل؟" : "Existing Member?"}{" "}
                        <Link href="/login" className="text-brand-burgundy font-black hover:underline ml-1">
                            {isAr ? "دخول" : "Sign In"}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
