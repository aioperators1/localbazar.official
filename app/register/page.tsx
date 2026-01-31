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
        <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-black to-black" />
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group">
                        <UserPlus className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
                        {isAr ? "انشئ هوية" : "Create Identity"}
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        {isAr ? "انضم إلى مجتمع محترفي الألعاب" : "Join the world-class gaming community."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                            {isAr ? "الاسم الكامل" : "Callsign (Full Name)"}
                        </label>
                        <div className="relative group">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                name="name"
                                placeholder={isAr ? "الاسم الكامل (اختياري)" : "FULL NAME (OPTIONAL)"}
                                className="pl-11 h-12 bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700 focus:bg-black/60 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                            {isAr ? "اسم المستخدم" : "Platform ID (Username)"}
                        </label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                name="username"
                                placeholder={isAr ? "اسم المستخدم" : "USERNAME"}
                                required
                                className="pl-11 h-12 bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700 focus:bg-black/60 transition-all rounded-xl uppercase font-bold text-xs tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                            {isAr ? "البريد الإلكتروني" : "Comm Link (Email)"}
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                name="email"
                                type="email"
                                placeholder={isAr ? "البريد الإلكتروني" : "EMAIL@PROTOCOL.COM"}
                                required
                                className="pl-11 h-12 bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700 focus:bg-black/60 transition-all rounded-xl text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                            {isAr ? "كلمة المرور" : "Encryption Port (Password)"}
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="pl-11 h-12 bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700 focus:bg-black/60 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-bold text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20 italic">
                            SIGNAL ERROR: {error}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? "تأكيد التسجيل" : "Authorize Creation")}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-8">
                    <p className="text-sm font-medium text-zinc-500">
                        {isAr ? "هل لديك حساب بالفعل؟" : "Existing Node Located?"}{" "}
                        <Link href="/login" className="text-blue-500 font-black uppercase tracking-wider hover:underline ml-1">
                            {isAr ? "دخول" : "Sign In"}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
