"use client";

import { submitListing } from "@/lib/actions/marketplace";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Upload, Zap } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

import { toast } from "sonner";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SellForm({ categories }: { categories: Category[] }) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    async function handleAction(formData: FormData) {
        setLoading(true);
        try {
            const res = await submitListing(formData);
            if (res?.success) {
                setSubmitted(true);
                toast.success(isAr ? "تم إرسال طلبك بنجاح!" : "Listing submitted for review!");
            } else {
                toast.error((res as any)?.error || "Failed to submit listing");
                setLoading(false);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                    {isAr ? "تم الإرسال بنجاح" : "System Synchronized"}
                </h3>
                <p className="text-zinc-500 text-sm font-medium max-w-sm mb-8 uppercase tracking-widest leading-loose">
                    {isAr
                        ? "لقد تم إرسال منتجك للمراجعة. سيظهر في المتجر بمجرد الموافقة عليه."
                        : "Your hardware has been uploaded to the verification queue. It will go live once the protocols are approved."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                        href="/my-listings"
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {isAr ? "مخزوني" : "My Inventory"} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="flex-1 h-12 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                    >
                        {isAr ? "إضافة منتج آخر" : "List New Unit"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form action={handleAction} className="space-y-8" dir={isAr ? "rtl" : "ltr"}>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                        {t("sell.productName")}
                    </label>
                    <input
                        name="name"
                        required
                        placeholder={isAr ? "مثال: NVIDIA RTX 4090" : "e.g. NVIDIA RTX 4090 Founder's Edition"}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="price" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                            {t("sell.price")}
                        </label>
                        <div className="relative">
                            <input
                                name="price"
                                type="number"
                                required
                                min="0"
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono font-black text-indigo-400 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">MAD</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="categoryId" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                            {t("sell.category")}
                        </label>
                        <select
                            name="categoryId"
                            required
                            defaultValue=""
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-zinc-950">{t("cat.selectTier")}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id} className="bg-zinc-950 text-white">
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="condition" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                            {isAr ? "الحالة" : "Condition"}
                        </label>
                        <select
                            name="condition"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="NEW" className="bg-zinc-950">{isAr ? "جديد" : "New / Boxed"}</option>
                            <option value="LIKE_NEW" className="bg-zinc-950">{isAr ? "مثل الجديد" : "Like New"}</option>
                            <option value="GOOD" className="bg-zinc-950">{isAr ? "حالة جيدة" : "Good Condition"}</option>
                            <option value="USED" className="bg-zinc-950">{isAr ? "مستعمل" : "Used"}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                            {t("sell.image")}
                        </label>
                        <div className="relative">
                            <input
                                name="image"
                                required
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                            <Upload className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className={cn("text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.3em]", isAr ? "" : "")}>
                        {t("sell.description")}
                    </label>
                    <textarea
                        name="description"
                        required
                        rows={5}
                        placeholder={t("sell.descPlaceholder")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-indigo-500/40 relative overflow-hidden group/submit"
                disabled={loading}
            >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover/submit:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{loading ? t("sell.submitting") : t("sell.submit")}</span>
                </div>
            </Button>
        </form>
    );
}
