"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Globe, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Branding } from "@/components/store/Branding";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Please try again.");
                setLoading(false);
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("A critical error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F1113] p-6 font-sans relative overflow-hidden" dir="ltr">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-[450px] space-y-10 relative z-10"
            >
                <div className="text-center space-y-8">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <Branding size="lg" light variant="luxury" />
                        <div className="mt-6 flex items-center gap-3">
                             <div className="h-px w-8 bg-white/10" />
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Command Secure</span>
                             <div className="h-px w-8 bg-white/10" />
                        </div>
                    </motion.div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl p-10 space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase text-left">Elite Access</h2>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest text-left">Provide authorization to enter the boutique core.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 text-left block">
                                    Identity Profile
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3.5 text-white text-[14px] font-medium placeholder-white/20 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-left"
                                    placeholder="Username or Email"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest text-left">
                                        Access Key
                                    </label>
                                    <button type="button" className="text-white/30 text-[10px] font-bold hover:text-white uppercase tracking-tighter transition-colors">Recover</button>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3.5 pr-14 text-white text-[14px] font-medium placeholder-white/20 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-left"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[12px] font-bold animate-in fade-in slide-in-from-top-1 text-left">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-white text-[#0F1113] hover:bg-white/90 font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? "Authenticating..." : "Establish Link"}
                        </Button>
                    </form>
                </div>

                <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5">
                    <div className="flex gap-8 text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">
                        <Link href="/" className="hover:text-white transition-colors">Main Interface</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-6 group/agency cursor-pointer">
                        <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em] group-hover/agency:text-white/30 transition-colors">
                            Built by
                        </span>
                        <div className="flex items-center gap-3 grayscale group-hover/agency:grayscale-0 opacity-20 group-hover/agency:opacity-100 transition-all duration-1000">
                            <Image 
                                src="/assets/agency/logo.png"
                                alt="AI Operators"
                                width={24}
                                height={24}
                                className="rounded-full"
                            />
                            <span className="text-[11px] font-black text-white tracking-tighter uppercase">
                                AI Operators <span className="text-white/40">Group</span>
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="fixed bottom-6 w-full text-center pointer-events-none opacity-20">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                    Enterprise Infrastructure • Local Bazar v2.4
                </p>
            </div>
        </div>
    );
}
