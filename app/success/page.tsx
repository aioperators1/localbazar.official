"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
        >
            <div className="w-24 h-24 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-110" />
                <CheckCircle2 className="w-12 h-12 relative z-10" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-white leading-none">
                Order <br /> Confirmed
            </h1>

            {orderId && (
                <div className="mb-10 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-mono text-white select-all">#{orderId.slice(-8).toUpperCase()}</span>
                </div>
            )}

            <p className="text-lg text-zinc-400 font-light max-w-md mb-12 tracking-wide leading-relaxed">
                Your order has been received and is now being processed. We'll notify you once your items have been deployed.
            </p>

            <div className="flex gap-6">
                <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-xl" asChild>
                    <Link href="/shop">
                        Continue Shopping <ArrowRight className="w-4 h-4 ml-3" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center w-full px-6 text-center relative overflow-hidden">
            {/* 🌌 VOLUMETRIC BACKLIGHT */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[150px] rounded-full"
                />
            </div>

            <Suspense fallback={<div className="text-white font-black animate-pulse">SYNCHRONIZING...</div>}>
                <SuccessContent />
            </Suspense>

            {/* Corner Tech Decor */}
            <div className="absolute bottom-12 right-12 opacity-20 select-none hidden md:block">
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Auth_Sync: 100%_SECURE</span>
                    <div className="w-32 h-px bg-white/20" />
                </div>
            </div>
        </div>
    );
}

