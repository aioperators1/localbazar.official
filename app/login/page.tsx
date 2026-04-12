"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/shop";
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
                setError("Authentication failed. Please verify credentials.");
                setLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("A system error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-transparent p-6 relative overflow-hidden" dir="ltr">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-10 rounded-[4px] bg-black/20 p-10 border border-white/10 shadow-2xl relative z-10 text-white">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-sm">
                        <UserCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white text-left italic">
                        Member Login
                    </h2>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] text-left">
                        Access your secure signature dashboard
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-[10px] font-bold uppercase tracking-widest text-white/60 text-left">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full border border-white/20 bg-black/20 px-4 py-4 text-white placeholder:text-white/20 focus:border-white focus:ring-0 focus:outline-none transition-all text-xs font-bold rounded-[2px] text-left"
                                placeholder="signature_id"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-white/60 text-left">
                                Password
                            </label>
                             <div className="relative">
                                 <input
                                     id="password"
                                     name="password"
                                     type={showPassword ? "text" : "password"}
                                     autoComplete="current-password"
                                     required
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     className="block w-full border border-white/20 bg-black/20 px-4 py-4 pr-12 text-white placeholder:text-white/20 focus:border-white focus:ring-0 focus:outline-none transition-all text-xs rounded-[2px] text-left"
                                     placeholder="••••••••"
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
                    </div>

                    {error && (
                        <div className="p-4 rounded-[2px] bg-red-500/20 border border-red-500/30 text-red-200 text-[10px] font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-white hover:bg-white/80 text-[#592C2F] font-bold uppercase tracking-[0.3em] rounded-[2px] shadow-lg transition-all text-[11px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#592C2F]" /> : "Confirm & Access"}
                    </Button>
                </form>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                        New member?
                        <Link href="/register" className="text-white ml-2 hover:underline">
                            Register Signature
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

