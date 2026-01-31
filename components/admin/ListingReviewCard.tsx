"use client";

import { approveListing, rejectListing } from "@/lib/actions/marketplace";
import { Check, X, Tag, User, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function ListingReviewCard({ product }: { product: any }) {
    const [loading, setLoading] = useState<string | null>(null);
    const specs = product.specs ? JSON.parse(product.specs) : {};

    const handleApprove = async () => {
        setLoading('approve');
        try {
            const res = await approveListing(product.id);
            if (res?.success) toast.success("Product approved and listed");
            else toast.error("Failed to approve product");
        } catch (error) { toast.error("An error occurred"); }
        finally { setLoading(null); }
    };

    const handleReject = async () => {
        setLoading('reject');
        try {
            const res = await rejectListing(product.id);
            if (res?.success) toast.success("Product rejected and removed");
            else toast.error("Failed to reject product");
        } catch (error) { toast.error("An error occurred"); }
        finally { setLoading(null); }
    };

    const productImg = product.images;
    let displayImg = "/placeholder-product.png";
    try {
        if (productImg && productImg.startsWith('[')) {
            displayImg = JSON.parse(productImg)[0];
        } else if (productImg) {
            displayImg = productImg;
        }
    } catch { }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden shadow-pro hover:border-blue-500/30 transition-all flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <Image
                    src={displayImg}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                />

                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded bg-white/95 dark:bg-black/95 border border-zinc-200 dark:border-white/10 text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Tag className="w-2.5 h-2.5" />
                        {product.category?.name || "Standard Product"}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-5">
                    <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white truncate tracking-tight uppercase">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[9px] uppercase font-bold tracking-widest">{specs.location || "CASABLANCA, MA"}</span>
                        </div>
                    </div>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed line-clamp-2 mb-6 font-medium">
                    {product.description}
                </p>

                {/* Specs Information */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="px-3 py-2 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-100 dark:border-white/5 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="px-3 py-2 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-100 dark:border-white/5 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">{specs.condition || "Grade A"}</span>
                    </div>
                </div>

                {/* Seller & Action Footer */}
                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 truncate uppercase leading-none mb-1">{product.seller?.name || "Verified Member"}</p>
                            <p className="text-[10px] font-bold text-zinc-500 truncate tracking-tight">
                                {product.price.toLocaleString()} MAD
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleReject}
                            disabled={loading !== null}
                            className="w-9 h-9 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            {loading === 'reject' ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={loading !== null}
                            className="h-9 px-4 rounded-lg bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading === 'approve' ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
