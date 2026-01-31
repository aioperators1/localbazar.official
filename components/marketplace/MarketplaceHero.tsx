"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { ShoppingBag, Users, Zap, PlusCircle, ArrowRight, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";

export function MarketplaceHero() {
    const scrollToDrops = () => {
        document.getElementById('community-drops')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-black">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <FadeIn>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-full text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                            <Users className="w-3 h-3 text-blue-600" />
                            Over 14,000 Verified Participants
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-zinc-900 dark:text-white">
                            Community <br />
                            <span className="text-blue-600">Inventory</span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-bold uppercase tracking-tighter leading-relaxed mt-10">
                            The professional standard for high-performance hardware exchange.
                            Direct verification, zero intermediaries.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                            <Link href="/sell" className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-pro transition-all flex items-center justify-center gap-3">
                                <PlusCircle className="w-4 h-4" />
                                Deploy Inventory
                            </Link>
                            <button onClick={scrollToDrops} className="px-10 py-5 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-blue-500/20 text-zinc-900 dark:text-white font-black uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-3">
                                <Search className="w-4 h-4 text-blue-600" />
                                Browse Assets
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
