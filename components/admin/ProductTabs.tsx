"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ProductTabsProps {
    activeTab: string;
    q?: string;
}

export function ProductTabs({ activeTab, q }: ProductTabsProps) {
    const tabs = ["All", "Active", "Draft", "Archived"];

    return (
        <div className="flex items-center gap-10">
            {tabs.map((tabName) => (
                <Link 
                    key={tabName} 
                    href={`/admin/products?tab=${tabName}${q ? `&q=${q}` : ''}`}
                    className={`pb-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative group ${activeTab === tabName ? "text-black" : "text-black/20 hover:text-black/60"}`}
                >
                    {tabName}
                    {activeTab === tabName && (
                        <motion.div 
                            layoutId="activeAdminTab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full"
                            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                        />
                    )}
                </Link>
            ))}
        </div>
    );
}
