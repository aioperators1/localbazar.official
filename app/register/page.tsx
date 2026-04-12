"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, UserPlus, ShieldCheck, Mail, Lock, UserCircle, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/actions/auth";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen bg-transparent pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden" dir="ltr">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-black/20 border border-white/10 p-10 rounded-[4px] shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-sm">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 text-left">
                        Join the Maison
                    </h1>
                    <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] text-left">
                        Enter the world of heritage & luxury.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1 text-left block">
                            Full Name
                        </label>
                        <div className="relative group">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <Input
                                name="name"
                                placeholder="NAME (OPTIONAL)"
                                className="pl-11 h-12 border-white/20 bg-black/20 text-white placeholder:text-white/20 focus:border-white transition-all rounded-[2px] text-xs font-bold text-left"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1 text-left block">
                            Username
                        </label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <Input
                                name="username"
                                placeholder="USERNAME"
                                required
                                className="pl-11 h-12 border-white/20 bg-black/20 text-white placeholder:text-white/20 focus:border-white transition-all rounded-[2px] font-bold text-xs uppercase text-left"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1 text-left block">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="CONCIERGE@MAISON.COM"
                                required
                                className="pl-11 h-12 border-white/20 bg-black/20 text-white placeholder:text-white/20 focus:border-white transition-all rounded-[2px] text-xs font-bold text-left"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1 text-left block">
                            Signature Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="pl-11 pr-12 h-12 border-white/20 bg-black/20 text-white placeholder:text-white/20 focus:border-white transition-all rounded-[2px] text-left"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-2"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-200 text-[10px] font-bold text-center bg-red-500/20 p-3 rounded-[2px] border border-red-500/30 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 bg-white hover:bg-white/90 text-[#592C2F] font-bold uppercase tracking-[0.3em] rounded-[2px] shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#592C2F]" /> : "Request Access"}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-8">
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                        Existing Member?{" "}
                        <Link href="/login" className="text-white font-black hover:underline ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

