"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShieldCheck, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function MarketplaceStats() {
    const { language } = useLanguage();
    const isAr = language === "ar";

    const STATS = [
        {
            label: isAr ? "الأكثر تداولاً" : "Trending Now",
            value: "RTX 40 Series",
            icon: TrendingUp,
            color: "text-[var(--color-brand-charcoal)]",
            bg: "bg-[var(--color-brand-charcoal)]/10"
        },
        {
            label: isAr ? "مستخدم نشط" : "Active Users",
            value: "14,200+",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            label: isAr ? "دعم مباشر" : "Live Support",
            value: "24/7",
            icon: MessageCircle,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            label: isAr ? "صفقات ناجحة" : "Direct Deals",
            value: "100%",
            icon: ShieldCheck,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-zinc-50/50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 hover:border-[var(--color-brand-charcoal)]/20 dark:hover:border-white/10 transition-all duration-300 backdrop-blur-sm shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white italic tracking-tighter">
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subtle Activity Ticker */}
            <div className="mt-12 border-t border-zinc-200 dark:border-white/5 py-3 overflow-hidden flex relative">
                <div className="flex animate-marquee whitespace-nowrap items-center">
                    {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="flex gap-12 items-center px-6">
                            <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                MACBOOK PRO M3 LISTED IN CASABLANCA
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                RTX 4080 SOLD IN MARRAKECH
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                NEW GAMING CHAIR LISTED IN TANGIER
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
