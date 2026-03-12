"use client";

import { useCart } from "@/hooks/use-cart";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, ShieldCheck, Truck, CreditCard, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCarousel } from "@/components/store/ProductCarousel";
import { getAllProducts } from "@/lib/actions/product";

export default function CartPage() {
    const { items, removeItem, addItem, decreaseItem, totalPrice } = useCart();
    const [mounted, setMounted] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        getAllProducts('new-arrivals').then(res => setSuggestions(res.slice(0, 6)));
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-[#f3f5f6]">
                <div className="h-10 w-10 border-2 border-zinc-200 border-t-brand-blue rounded-full animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#f3f5f6]">
                <div className="bg-white p-12 text-center rounded-[4px] shadow-sm border border-zinc-100 max-w-md w-full">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 text-sm mb-8">Discover our premium collections to start shopping.</p>
                    <Link href="/shop" className="bg-brand-blue text-white px-8 py-3 rounded-[4px] text-xs font-bold uppercase tracking-wide hover:bg-brand-charcoal transition-colors inline-block">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f5f6] text-zinc-900 pb-24 pt-10">
            <div className="container mx-auto px-4 lg:px-20 max-w-[1400px]">

                <h1 className="text-[28px] font-bold text-[#111111] uppercase tracking-[0.1em] mb-6">My Cart</h1>



                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Cart Table & Guarantees */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* Cart Table Container */}
                        <div className="bg-white border border-zinc-200 rounded-[4px] shadow-sm overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-100 text-[11px] font-bold text-zinc-500 uppercase tracking-widest hidden md:grid">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Total</div>
                            </div>

                            {/* Table Body (Items) */}
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.size || 'nosize'}-${item.color || 'nocolor'}`}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6 p-6 border-b border-zinc-100 last:border-0 items-center relative"
                                    >
                                        {/* Product Info */}
                                        <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                                            <div className="w-20 h-20 relative bg-zinc-50 border border-zinc-100 rounded-[4px] p-2 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-[0.3em]">LOCAL BAZAR</span>
                                                <Link href={`/product/${item.id}`} className="text-[15px] font-medium text-[#111111] hover:text-brand-burgundy transition-colors uppercase tracking-tight">
                                                    {item.name}
                                                </Link>
                                                {(item.size || item.color) && (
                                                    <div className="flex gap-3 mt-2">
                                                        {item.size && <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-50 px-2 py-1 border border-zinc-100">Size: {item.size}</span>}
                                                        {item.color && <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-50 px-2 py-1 border border-zinc-100">Color: {item.color}</span>}
                                                    </div>
                                                )}
                                                <span className="text-[14px] font-bold text-[#111111] mt-3 md:hidden">
                                                    {Number(item.price).toLocaleString()}.00 QAR
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity & Delete */}
                                        <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center gap-2">
                                            <div className="flex items-center border border-zinc-200 rounded-[2px] h-10 w-[110px]">
                                                <button
                                                    onClick={() => decreaseItem(item.id, item.size, item.color)}
                                                    className="w-10 h-full text-zinc-400 hover:text-[#111111] flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="flex-1 text-[13px] font-bold text-[#111111] border-x border-zinc-200 h-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addItem(item)}
                                                    className="w-10 h-full text-zinc-400 hover:text-[#111111] flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.size, item.color)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy hover:underline transition-all mt-2"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="col-span-1 md:col-span-3 text-right hidden md:block">
                                            <span className="text-[14px] font-bold text-zinc-500">
                                                {Number(item.price * item.quantity).toLocaleString()}.00 QAR
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Our Guarantees Box */}
                        <div>
                            <h2 className="text-[18px] font-bold text-brand-blue mb-4">Our Guarantees</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border border-zinc-200 rounded-[4px] shadow-sm">

                                <div className="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-zinc-100">
                                    <div className="mb-3 text-brand-blue">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-brand-blue mb-2">24/7 Support</h4>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Available whenever you need us, via chat, email or phone</p>
                                </div>

                                <div className="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-zinc-100">
                                    <div className="mb-3 text-brand-blue">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.88 6.59l-8.59 4.31a2 2 0 0 1-1.84 0L1.86 6.59"></path><path d="M11.08 2.05l8.59 4.31c.95.48.95 1.86 0 2.34l-8.59 4.31a2 2 0 0 1-1.84 0L.59 8.7C-.36 8.22-.36 6.84.59 6.36l8.59-4.31a2 2 0 0 1 1.9 0z"></path><path d="M21 10.5v5a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 15.5v-5"></path></svg>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-brand-blue mb-2">Customers Love Us</h4>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Over 10,000 followers on our social media pages</p>
                                </div>

                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="mb-3 text-brand-blue">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-brand-blue mb-2">Fast Delivery</h4>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">100% of shipments delivered within 24-48h to your home</p>
                                </div>

                            </div>
                        </div>

                        {suggestions.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-[20px] font-bold text-brand-blue mb-6">Complete Your Look</h2>
                                <div className="bg-white p-6 rounded-[4px] shadow-sm border border-zinc-200">
                                    <ProductCarousel products={suggestions} title="" />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Checkout Sticky Box */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6">
                            <div className="bg-white border border-zinc-200 rounded-[4px] shadow-sm p-6 lg:p-8">

                                <div className="space-y-4 mb-8 pb-8 border-b border-zinc-100">
                                    <div className="flex justify-between text-[14px] font-medium text-zinc-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>{totalPrice().toLocaleString()}.00 QAR</span>
                                    </div>
                                    <div className="flex justify-between text-[18px] font-black text-[#111111] uppercase tracking-tighter">
                                        <span>Total</span>
                                        <span>{totalPrice().toLocaleString()}.00 QAR</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <button className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 py-4 border-b border-zinc-100 text-left hover:text-[#111111] transition-colors">
                                        Order Instructions
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-[11px] text-zinc-400 mb-8 leading-relaxed uppercase tracking-wider">
                                    Tax and shipping calculated at checkout
                                </p>

                                <Link href="/checkout" className="block w-full bg-[#111111] hover:bg-brand-burgundy text-white text-center font-bold text-[12px] py-5 rounded-[2px] transition-all uppercase tracking-[0.3em] shadow-lg">
                                    Checkout
                                </Link>

                                <div className="mt-8 flex justify-center items-center gap-2 text-[11px] font-bold text-zinc-500">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>100% Secure Payments</span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
