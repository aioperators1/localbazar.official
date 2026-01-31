"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { useLanguage } from "@/components/providers/language-provider";

export function HomeNewDropsHeader() {
    const { t } = useLanguage();

    return (
        <>
            <FadeIn className="flex items-center justify-between mb-16 border-b border-zinc-200 dark:border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-12 bg-blue-600 rounded-full" />
                    <h2 className="text-5xl md:text-8xl font-black uppercase text-zinc-900 dark:text-white tracking-tighter leading-none">
                        {t("home.newDrops")}
                    </h2>
                </div>
                <Link href="/shop" className="hidden md:flex text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-all items-center gap-4 group">
                    {t("home.viewCatalogue")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
            </FadeIn>
        </>
    );
}
