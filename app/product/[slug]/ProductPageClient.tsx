"use client";

import { motion, Variants } from "framer-motion";
import { AddToCart } from "@/components/store/AddToCart";
import { ProductGallery } from "@/components/store/ProductGallery";
import { Star, Truck, ShieldCheck, ArrowLeft, Cpu, Zap, Layers, Monitor, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ProductPageClientProps {
    product: any;
    images: string[];
}

export default function ProductPageClient({ product, images }: ProductPageClientProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className="bg-background min-h-screen pb-32 pt-32 relative overflow-hidden text-foreground">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-6 relative z-10"
            >
                {/* Navigation Toolbar */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-20 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <Link href="/shop" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        CATALOGUE
                    </Link>
                    <span className="text-zinc-300 dark:text-zinc-800">/</span>
                    <span className="text-zinc-400 dark:text-zinc-400">{product.category.name}</span>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Image Gallery */}
                    <motion.div variants={itemVariants} className="lg:col-span-6 xl:col-span-7">
                        <ProductGallery images={images} name={product.name} />
                    </motion.div>

                    {/* Product Info */}
                    <div className="lg:col-span-6 xl:col-span-5 space-y-12">
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-8 bg-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                                    {product.category.name}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-blue-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    <span className="ml-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Hardware</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Purchase Section */}
                        <motion.div variants={itemVariants} className="p-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 relative group">
                            <div className="flex flex-col gap-10 relative z-10">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Direct Price</span>
                                    <div className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                        {new Intl.NumberFormat('en-MA', {
                                            style: 'currency',
                                            currency: 'MAD',
                                            minimumFractionDigits: 0
                                        }).format(Number(product.price))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
                                        <span className="text-emerald-600 dark:text-emerald-500">Available in Stock</span>
                                    </div>

                                    <div className="group/btn relative h-16 w-full flex items-center justify-center overflow-hidden rounded-lg bg-blue-600 hover:bg-blue-500 transition-all shadow-pro">
                                        <AddToCart
                                            product={{
                                                id: product.id,
                                                name: product.name,
                                                price: Number(product.price),
                                                image: images[0]
                                            }}
                                        />
                                    </div>

                                    {/* Marketplace Interaction: Message Seller */}
                                    {product.sellerId && (
                                        <form action={async () => {
                                            const { startConversation } = await import("@/lib/actions/marketplace");
                                            try {
                                                await startConversation(product.id);
                                            } catch (e: any) {
                                                alert(e.message);
                                            }
                                        }}>
                                            <button
                                                type="submit"
                                                className="w-full h-16 rounded-lg border border-zinc-300 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-blue-500/30 transition-all flex items-center justify-center gap-3 group/msg"
                                            >
                                                <MessageCircle className="w-4 h-4 transition-transform group-hover/msg:scale-110" />
                                                Inquire Information
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-12">
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed tracking-wide">
                                {product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <SpecItem label="Performance" value="High-Grade" />
                                <SpecItem label="Certification" value="Verified" />
                                <SpecItem label="Warranty" value="Elite Cover" />
                                <SpecItem label="Shipping" value="Priority" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-200 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <Truck className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Global Logistics Available</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Secure Payment Gateway</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SpecItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-lg space-y-2">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em] block">{label}</span>
            <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest block">{value}</span>
        </div>
    );
}
