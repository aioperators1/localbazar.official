"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-brand-burgundy" /></div>}>
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
    const { isAr } = useLanguage();

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
        <div className="flex min-h-screen items-center justify-center bg-white p-6 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-burgundy/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-10 rounded-[4px] bg-white p-10 border border-zinc-100 shadow-2xl relative z-10">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-100 shadow-sm">
                        <UserCircle className="w-8 h-8 text-[#111111]" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-[#111111]">
                        {isAr ? "تسجيل الدخول" : "Member Login"}
                    </h2>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">
                        {isAr ? "الولوج إلى حسابك الشخصي في لوكال بازار" : "Access your secure signature dashboard"}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                {isAr ? "اسم المستخدم" : "Username"}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full border border-zinc-100 bg-[#FAFAFA] px-4 py-4 text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] focus:ring-0 focus:outline-none transition-all text-xs font-bold rounded-[2px]"
                                placeholder={isAr ? "اسم المستخدم" : "signature_id"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                {isAr ? "كلمة المرور" : "Password"}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border border-zinc-100 bg-[#FAFAFA] px-4 py-4 text-[#111111] placeholder:text-zinc-300 focus:border-[#111111] focus:ring-0 focus:outline-none transition-all text-xs rounded-[2px]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-[2px] bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#111111] hover:bg-brand-burgundy text-white font-bold uppercase tracking-[0.3em] rounded-[2px] shadow-lg transition-all text-[11px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "دخول" : "Confirm & Access")}
                    </Button>
                </form>

                <div className="text-center pt-8 border-t border-zinc-50">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {isAr ? "ليس لديك حساب؟" : "New member?"}
                        <Link href="/register" className="text-brand-burgundy ml-2 hover:underline">
                            {isAr ? "انشئ حساب" : "Register Signature"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
