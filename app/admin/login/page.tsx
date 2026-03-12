"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Lock, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        <div className="flex min-h-screen items-center justify-center bg-[#F1F1F1] p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px] space-y-8"
            >
                <div className="text-center space-y-4">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-[#303030] rounded-[10px] flex items-center justify-center mb-2 shadow-sm">
                            <span className="text-white font-bold text-xl">LB</span>
                        </div>
                        <h1 className="text-[20px] font-bold text-[#303030]">Log in to Local Bazar</h1>
                    </div>
                </div>

                <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm p-6 space-y-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="username" className="text-[13px] font-medium text-[#303030]">
                                        Email or Username
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full rounded-[8px] bg-white border border-[#D2D2D2] px-3 py-2 text-[#303030] text-[13px] placeholder-[#616161] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="Admin email or username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-[13px] font-medium text-[#303030]">
                                        Password
                                    </label>
                                    <button type="button" className="text-[#005BD3] text-[12px] hover:underline">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-[8px] bg-white border border-[#D2D2D2] px-3 py-2 text-[#303030] text-[13px] placeholder-[#616161] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#FDEDE8] border border-[#f8d7da] text-[#E51C00] text-[13px] font-medium animate-in fade-in slide-in-from-top-1">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-black text-white hover:bg-[#303030] font-bold rounded-[8px] transition-all"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </Button>
                    </form>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <div className="flex gap-4 text-[12px] text-[#616161] font-medium">
                        <Link href="/privacy" className="hover:underline">Privacy</Link>
                        <Link href="/terms" className="hover:underline">Terms</Link>
                    </div>
                </div>
            </motion.div>
            
            {/* Shopify-like Footer */}
            <div className="fixed bottom-6 w-full text-center pointer-events-none">
                <p className="text-[12px] text-[#616161] font-medium">
                    Help • Legal • Privacy
                </p>
            </div>
        </div>
    );
}

// Minimal Link component for the demo logic
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}
