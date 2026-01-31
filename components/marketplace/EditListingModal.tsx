"use client";

import { useState } from "react";
import { Edit2, Loader2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateListing } from "@/lib/actions/marketplace";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    id: string;
    name: string;
}

export function EditListingModal({ product, categories }: { product: any, categories: Category[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    let condition = "USED";
    try {
        if (product.specs) {
            condition = JSON.parse(product.specs).condition || "USED";
        }
    } catch { }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await updateListing(product.id, formData);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to update listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="w-11 h-11 rounded-xl border-border hover:border-indigo-500 hover:text-indigo-500 transition-all"
            >
                <Edit2 className="w-5 h-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-card border border-border w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit <span className="text-indigo-500">Listing</span></h2>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Refine your marketplace gear.</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar" dir={isAr ? "rtl" : "ltr"}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product Name</label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={product.name}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price (MAD)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            required
                                            defaultValue={Number(product.price)}
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Condition</label>
                                        <select
                                            name="condition"
                                            defaultValue={condition}
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                        >
                                            <option value="NEW">New / Boxed</option>
                                            <option value="LIKE_NEW">Like New</option>
                                            <option value="GOOD">Good Condition</option>
                                            <option value="USED">Used</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                                    <select
                                        name="categoryId"
                                        defaultValue={product.categoryId}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Image URL</label>
                                    <div className="relative">
                                        <input
                                            name="image"
                                            required
                                            defaultValue={product.images}
                                            className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        />
                                        <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        defaultValue={product.description}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                    />
                                </div>

                                <Button
                                    disabled={loading}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 transition-all"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : null}
                                    {loading ? "Updating..." : "Save Changes"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
