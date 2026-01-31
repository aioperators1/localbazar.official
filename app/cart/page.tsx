"use client";

import { useCart } from "@/hooks/use-cart";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, ShieldCheck, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, removeItem, addItem, decreaseItem, totalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Initializing Terminal...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent opacity-50" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Your Cart is Empty</h1>
                    <p className="text-zinc-500 mb-10 font-medium">Browse our professional catalogue to find high-performance hardware.</p>
                    <Button asChild size="lg" className="rounded-full px-10 py-7 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-pro transition-all">
                        <Link href="/shop">
                            Explore Catalog <ArrowRight className="w-4 h-4 ml-3" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative">
            <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Direct Inventory</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Shopping Cart</h1>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                            {items.length} professional unit{items.length !== 1 ? 's' : ''} ready for dispatch
                        </p>
                    </div>
                    <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 rotate-180" /> Back to components
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="group bg-zinc-900/40 border border-white/5 hover:border-blue-500/20 transition-all duration-500 rounded-xl overflow-hidden p-6"
                                    >
                                        <div className="flex gap-8 items-center">
                                            {/* Image */}
                                            <div className="relative w-24 h-24 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/5 p-4">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-black text-white text-lg uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">{item.category || "Hardware"}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-xl text-white">
                                                            {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-8">
                                                        <div className="flex items-center gap-4 bg-black border border-white/5 rounded-lg p-1">
                                                            <button
                                                                onClick={() => decreaseItem(item.id)}
                                                                className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span className="font-black text-xs text-white min-w-[20px] text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => addItem(item)}
                                                                className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Remove Unit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="bg-zinc-900 border border-white/5 rounded-xl p-8 shadow-pro">
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    Order Summary
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Subtotal</span>
                                        <span className="text-white">{new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(totalPrice())}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Logistics</span>
                                        <span className="text-blue-500">Free Transfer</span>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Total</span>
                                        <div className="text-right">
                                            <span className="block text-4xl font-black text-white tracking-tighter">
                                                {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(totalPrice())}
                                            </span>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 block">Including VAT</span>
                                        </div>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-lg transition-all shadow-pro group" asChild>
                                    <Link href="/checkout">
                                        Confirm & Proceed <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>

                                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                                        <span>256-Bit Secure Encryption</span>
                                    </div>
                                    <div className="flex gap-4 opacity-40 grayscale">
                                        <CreditCard className="w-4 h-4" />
                                        <Truck className="w-4 h-4" />
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
