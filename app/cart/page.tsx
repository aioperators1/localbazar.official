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
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { EmptyState } from "@/components/store/EmptyState";
import { cn } from "@/lib/utils";
import PayButton from "@/components/store/payButton";


export default function CartPage() {
    const { items, removeItem, addItem, decreaseItem, totalPrice, voucher, discountAmount } = useCart();
    const { formatPrice: formatCurrency } = useCurrency();
    const { t, language } = useLanguage();

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const [mounted, setMounted] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        getAllProducts('new-arrivals').then(res => setSuggestions(res.slice(0, 6)));
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
                <div className="h-10 w-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-transparent text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <EmptyState
                    title={t('cart.empty')}
                    description={t('shop.empty.desc')}
                    actionLabel={t('cart.continueShopping')}
                    icon="cart"
                />
            </div>
        );
    }

    const isAr = language === 'ar';

    return (
        <div className="min-h-screen bg-transparent text-white pb-12 lg:pb-24 pt-5 lg:pt-10" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 lg:px-20 max-w-[1400px]">

                <h1 className={cn("text-[28px] font-black text-white uppercase tracking-[0.2em] mb-12", isAr ? "text-center lg:text-right" : "text-center lg:text-left")}>
                    {t('nav.cart')}
                </h1>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Cart Table & Guarantees */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* Cart Table Container */}
                        <div className="bg-transparent border border-white/20 rounded-[4px] shadow-sm overflow-hidden text-right">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-[11px] font-bold text-white/50 uppercase tracking-widest hidden md:grid">
                                <div className="col-span-6 text-current">{t('sell.productName')}</div>
                                <div className="col-span-3 text-center">QUANTITY</div>
                                <div className={cn("col-span-3", isAr ? "text-left" : "text-right")}>TOTAL</div>
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
                                            <div className="w-20 h-20 relative bg-black/20 border border-white/10 rounded-[4px] p-2 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                            </div>
                                            <div className={cn("flex flex-col gap-1", isAr ? "text-right" : "text-left")}>
                                                <span className="text-[9px] uppercase font-bold text-white/40 tracking-[0.3em]">LOCAL BAZAR</span>
                                                <Link href={`/product/${item.id}`} className="text-[15px] font-medium text-white hover:text-white/70 transition-colors uppercase tracking-tight">
                                                    {item.name}
                                                </Link>
                                                {(item.size || item.color) && (
                                                    <div className="flex gap-3 mt-2">
                                                        {item.size && <span className="text-[10px] text-white/60 uppercase tracking-widest bg-black/20 px-2 py-1 border border-white/10">{t('product.size')}: {item.size}</span>}
                                                        {item.color && <span className="text-[10px] text-white/60 uppercase tracking-widest bg-black/20 px-2 py-1 border border-white/10">{t('product.color')}: {item.color}</span>}
                                                    </div>
                                                )}
                                                <span className="text-[14px] font-bold text-white mt-3 md:hidden">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity & Delete */}
                                        <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center gap-2">
                                            <div className="flex items-center border border-white/20 rounded-[2px] h-10 w-[110px]">
                                                <button
                                                    onClick={() => decreaseItem(item.id, item.size, item.color)}
                                                    className="w-10 h-full text-white/50 hover:text-white flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="flex-1 text-[13px] font-bold text-white border-x border-white/20 h-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addItem(item)}
                                                    className="w-10 h-full text-white/50 hover:text-white flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.size, item.color)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all mt-2"
                                            >
                                                {t('cart.remove')}
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className={cn("col-span-1 md:col-span-3 hidden md:block", isAr ? "text-left" : "text-right")}>
                                            <span className="text-[14px] font-bold text-white">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Our Guarantees Box */}
                        <div>
                            <h2 className={cn("text-[18px] font-bold text-white mb-4 uppercase tracking-widest", isAr ? "text-right" : "text-left")}>{t('footer.trust.support.title')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-transparent border border-white/20 rounded-[4px] shadow-sm">

                                <div className={cn("flex flex-col items-center text-center p-6 border-b md:border-b-0 border-white/10", isAr ? "md:border-l" : "md:border-r")}>
                                    <div className="mb-3 text-white">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-[13px] font-bold text-white mb-2 uppercase tracking-wide">{t('footer.trust.warranty.title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-tight">{t('footer.trust.warranty.desc')}</p>
                                </div>

                                <div className={cn("flex flex-col items-center text-center p-6 border-b md:border-b-0 border-white/10", isAr ? "md:border-l" : "md:border-r")}>
                                    <div className="mb-3 text-white">
                                        <Truck className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-[13px] font-bold text-white mb-2 uppercase tracking-wide">{t('footer.trust.delivery.title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-tight">{t('footer.trust.delivery.desc')}</p>
                                </div>

                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="mb-3 text-white">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-[13px] font-bold text-white mb-2 uppercase tracking-wide">{t('footer.trust.commerce.title')}</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-tight">{t('footer.trust.commerce.desc')}</p>
                                </div>

                            </div>
                        </div>

                        {suggestions.length > 0 && (
                            <div className="mt-12">
                                <h2 className={cn("text-[20px] font-bold text-[#111111] mb-6 uppercase tracking-widest", isAr ? "text-right" : "text-left")}>{t('product.youMayLike')}</h2>
                                <div className="bg-white p-6 rounded-[4px] shadow-sm border border-zinc-200">
                                    <ProductCarousel products={suggestions} />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Checkout Sticky Box */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6">
                            <div className="bg-transparent border border-white/20 rounded-[4px] shadow-sm p-6 lg:p-8">

                                <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                                    <div className="flex justify-between text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                        <span>{t('cart.subtotal')}</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    {voucher && (
                                        <div className="flex justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                                            <span>
                                                {t('cart.discount')} ({voucher.code}
                                                {voucher.type === 'PERCENTAGE' && ` - ${voucher.value}%`})
                                            </span>
                                            <span>-{formatCurrency(discountAmount())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[20px] font-black text-white uppercase tracking-tighter">
                                        <span>{t('cart.total')}</span>
                                        <span>{formatCurrency(totalPrice())}</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <button className={cn("w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 py-4 border-b border-white/10 hover:text-white transition-colors", isAr ? "text-right" : "text-left")}>
                                        {t('product.description')}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className={cn("text-[11px] text-white/40 mb-8 leading-relaxed uppercase tracking-wider font-bold", isAr ? "text-right" : "text-left")}>
                                    {t('cart.shippingCalculated')}
                                </p>

                                <Link href="/checkout" className="block w-full bg-white hover:bg-white/80 text-[#592C2F] text-center font-bold text-[12px] py-5 rounded-[2px] transition-all uppercase tracking-[0.3em] shadow-lg">
                                    {t('cart.checkout')}
                                </Link>

                                <div className="mt-8 flex justify-center items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>{t('cart.securePayment')}</span>
                                </div>

                            </div>
                        </div>
                        <PayButton />
                    </div>

                </div>
            </div>
        </div>
    );
}
