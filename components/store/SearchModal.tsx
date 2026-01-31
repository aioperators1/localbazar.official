"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight, Activity, Terminal, Target, Wifi } from "lucide-react";
import { searchProducts } from "@/lib/actions/search";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 1) {
                startTransition(async () => {
                    const data = await searchProducts(query);
                    setResults(data);
                });
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && query.trim()) {
            onClose();
            router.push(`/shop?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background border-zinc-200 dark:border-white/5 backdrop-blur-2xl rounded-none sm:rounded-xl flex flex-col gap-0 h-[85vh] sm:h-[80vh] shadow-pro" dir={isAr ? 'rtl' : 'ltr'}>
                <VisuallyHidden>
                    <DialogTitle>{t("nav.search")}</DialogTitle>
                </VisuallyHidden>

                {/* --- HEADER / INPUT --- */}
                <div className="relative z-20 flex flex-col pt-12 px-8 sm:px-12 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20">
                            <Search className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                            {t("nav.searchHeader") || "CATALOG DATABASE"}
                        </span>
                        <div className={cn("flex items-center gap-6", isAr ? "mr-auto" : "ml-auto")}>
                            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative group mb-10">
                        <Search className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-8 h-8 text-blue-500/30 group-focus-within:text-blue-600 transition-colors",
                            isAr ? "right-0" : "left-0"
                        )} />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("nav.searchPlaceholder") || "SEARCH PRODUCTS..."}
                            className={cn(
                                "w-full h-20 bg-transparent border-0 text-3xl sm:text-5xl font-black italic tracking-tighter text-foreground placeholder:text-zinc-300 dark:placeholder:text-zinc-800 focus-visible:ring-0 uppercase transition-all",
                                isAr ? "pr-14" : "pl-14"
                            )}
                            autoFocus
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-center duration-500" />
                    </div>
                </div>

                {/* --- RESULTS AREA --- */}
                <div className="relative flex-1 overflow-y-auto px-8 sm:px-12 py-10 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {!query ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center py-20"
                            >
                                <div className="space-y-4">
                                    <Target className="w-12 h-12 text-zinc-200 dark:text-zinc-900 mx-auto" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-700">Awaiting Search Input</p>
                                        <h3 className="text-xl font-bold text-zinc-500 dark:text-zinc-800 uppercase italic">Enter product name or category</h3>
                                    </div>
                                </div>
                            </motion.div>
                        ) : isPending ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center py-20"
                            >
                                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                <p className="mt-8 text-[11px] font-black text-blue-600/50 uppercase tracking-[0.5em]">Searching Catalog...</p>
                            </motion.div>
                        ) : results.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="group relative flex items-center gap-6 p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:bg-white/10 dark:hover:bg-white/[0.05] hover:border-blue-600/30 transition-all duration-500"
                                    >
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-black shrink-0 border border-zinc-200 dark:border-white/5 group-hover:border-blue-600/20 transition-colors">
                                            <Image
                                                src={product.image || "https://placehold.co/600x400/101010/FFFFFF/png?text=Pro+Gear"}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{product.id.slice(-6).toUpperCase()}</span>
                                            <h4 className="text-lg font-black text-foreground hover:text-blue-600 transition-colors uppercase leading-[0.9] truncate tracking-tight">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm font-bold text-blue-600 font-sans tracking-tighter">
                                                {new Intl.NumberFormat(isAr ? 'ar-MA' : 'en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(product.price)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center justify-center p-3 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                                            <ArrowRight className={cn("w-4 h-4 transition-transform", isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="space-y-4">
                                    <X className="w-12 h-12 text-zinc-200 dark:text-zinc-900 mx-auto" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-700">No products found</p>
                                        <h3 className="text-xl font-bold text-zinc-500 dark:text-zinc-800 uppercase italic">Try a different keyword</h3>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- FOOTER --- */}
                {results.length > 0 && (
                    <div className="p-8 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40">
                        <Link
                            href={`/shop?search=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className="group flex items-center justify-center gap-4 w-full py-4 text-[10px] font-black text-white uppercase tracking-[0.4em] transition-all bg-blue-600 hover:bg-blue-500 rounded-full border border-blue-500 shadow-pro"
                        >
                            {t("nav.viewAllResults") || "VIEW ALL RESULTS"}
                            <ArrowRight className={cn("w-4 h-4 transition-transform", isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                        </Link>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
