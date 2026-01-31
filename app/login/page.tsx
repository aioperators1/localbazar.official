"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
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
        <div className="flex min-h-screen items-center justify-center bg-black p-6 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-10 rounded-xl bg-zinc-900/50 p-10 border border-white/5 backdrop-blur-xl shadow-pro relative z-10">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <UserCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                        {isAr ? "تسجيل الدخول" : "Member Login"}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        {isAr ? "أعد الاتصال بحسابك في ElectroIslam" : "Access your professional dashboard"}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {isAr ? "اسم المستخدم" : "Unique Username"}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-lg bg-black border border-white/5 px-4 py-4 text-white placeholder:text-zinc-700 focus:border-blue-600 focus:outline-none transition-all text-xs font-bold"
                                placeholder={isAr ? "أدخل اسم المستخدم" : "operator_id"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {isAr ? "كلمة المرور" : "Security Key"}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg bg-black border border-white/5 px-4 py-4 text-white placeholder:text-zinc-700 focus:border-blue-600 focus:outline-none transition-all text-xs"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-lg shadow-pro transition-all text-[10px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "دخول" : "Confirm & Access")}
                    </Button>
                </form>

                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        {isAr ? "ليس لديك حساب؟" : "New member?"}
                        <Link href="/register" className="text-blue-500 ml-2 hover:underline">
                            {isAr ? "انشئ حساب" : "Register Identity"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
