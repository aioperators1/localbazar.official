"use client";

import { Hammer, Lock, Clock, Instagram } from "lucide-react";
import Link from "next/link";

export function Maintenance() {
    return (
        <div className="min-h-screen bg-[#592C2F] flex items-center justify-center p-6 font-sans overflow-hidden fixed inset-0 z-[9999]">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03]">
                <span className="text-[25vw] font-serif font-black tracking-tighter text-white whitespace-nowrap">LOCAL BAZAR</span>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 animate-pulse">
                        <Hammer className="w-10 h-10 text-white stroke-[1]" />
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-white font-serif text-[42px] md:text-[64px] leading-tight tracking-tighter uppercase font-black italic">
                            Élégance en <span className="text-white/40">Maintenance</span>
                        </h1>
                        <p className="text-white/50 text-[14px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                            Our atelier is currently being refined for a more exquisite experience.
                        </p>
                    </div>
                </div>

                <div className="h-px w-32 bg-brand-burgundy mx-auto" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="p-8 border border-white/10 bg-black/20 rounded-2xl flex flex-col items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full">
                            <Clock className="w-5 h-5 text-white/50" />
                        </div>
                        <h3 className="text-white font-bold text-[11px] uppercase tracking-widest">Expected Return</h3>
                        <p className="text-white/40 text-[13px] uppercase tracking-tight">Shortly / SPRING 2026</p>
                    </div>
                    <div className="p-8 border border-white/10 bg-black/20 rounded-2xl flex flex-col items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full">
                            <Lock className="w-5 h-5 text-white/50" />
                        </div>
                        <h3 className="text-white font-bold text-[11px] uppercase tracking-widest">Private Access</h3>
                        <Link href="/admin/login" className="text-white hover:text-white/80 transition-colors text-[13px] uppercase font-black underline underline-offset-8 decoration-1">
                            Staff Entry Only
                        </Link>
                    </div>
                </div>

                <div className="pt-12 flex flex-col items-center gap-6">
                    <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-black">Follow the progress</p>
                    <a href="https://instagram.com/localbazar.qtr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group">
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </div>
                        @localbazar.qtr
                    </a>
                </div>

                <div className="pt-24 text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em]">
                    &copy; 2026 LOCAL BAZAR — ARTISANAL E-COMMERCE HUB
                </div>
            </div>
        </div>
    );
}
