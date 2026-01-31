"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SellForm } from "@/components/marketplace/SellForm";
import { getCategories } from "@/lib/actions/product";

export default async function SellPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/sell");
    }

    const categories = await getCategories();

    return (
        <div className="min-h-screen pt-32 pb-20 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-foreground">
                        Sell Your <span className="text-indigo-500">Gear</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">
                        List your hardware on the Electro Islam Marketplace. All listings are subject to approval.
                    </p>
                </div>

                <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

                    <SellForm categories={categories} />
                </div>

                <div className="mt-8 text-center">
                    <a href="/my-listings" className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                        View My Inventory &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}
