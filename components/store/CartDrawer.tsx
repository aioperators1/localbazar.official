"use client";

import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import { validateVoucher } from "@/lib/actions/voucher";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, addItem, decreaseItem, totalPrice, totalItems, voucher, setVoucher, discountAmount } = useCart();
    const { formatPrice: formatCurrency } = useCurrency();
    const { t, language } = useLanguage();
    const [voucherCode, setVoucherCode] = useState("");
    const [isApplying, setIsApplying] = useState(false);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const itemCount = totalItems();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    <motion.div
                        initial={{ x: language === 'ar' ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: language === 'ar' ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 35, stiffness: 300, mass: 0.8 }}
                        className={cn(
                            "fixed top-0 h-[100dvh] w-full sm:w-[480px] bg-[#1A0306] z-[201] shadow-2xl flex flex-col text-white border-white/5",
                            language === 'ar' ? "left-0 border-r" : "right-0 border-l"
                        )}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#1A0306] shrink-0">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[18px] lg:text-[20px] font-black uppercase tracking-[0.2em] text-white">
                                    {t('cart.title')}
                                </h2>
                                <div className="w-5 h-5 bg-white text-[#1A0306] text-[10px] font-black rounded-full flex items-center justify-center">
                                    {itemCount}
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 hover:rotate-90 group"
                            >
                                <X className="w-4 h-4 stroke-[2] text-white/70 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative min-h-0">
                            {items.length > 0 ? (
                                <div className="space-y-6">
                                    {items.map((item, idx) => (
                                        <div key={`${item.id}-${idx}`} className="flex gap-4 group">
                                            <div className="w-20 h-28 relative bg-black/40 overflow-hidden shrink-0 border border-white/5 rounded-sm">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-[14px] lg:text-[15px] font-bold text-white uppercase tracking-wider line-clamp-2 leading-tight flex-1 pr-4">
                                                            {item.name}
                                                        </h3>
                                                        <button 
                                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                                            className="text-white/30 hover:text-rose-500 transition-colors p-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {(item.size || item.color) && (
                                                        <div className="flex gap-2 mt-1">
                                                            {item.size && (
                                                                <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-sm">
                                                                    {t("product.size")}: {item.size}
                                                                </span>
                                                            )}
                                                            {item.color && (
                                                                <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-sm">
                                                                    {t("product.color")}: {item.color}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between mt-3">
                                                    <div className="flex items-center border border-white/20 rounded-[2px] h-8 w-[90px] bg-black/20">
                                                        <button 
                                                            onClick={() => decreaseItem(item.id, item.size, item.color)}
                                                            className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3 text-white/70" />
                                                        </button>
                                                        <span className="flex-1 text-[12px] font-black text-white text-center">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => addItem(item)}
                                                            className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3 text-white/70" />
                                                        </button>
                                                    </div>
                                                    <span className="text-[14px] lg:text-[16px] font-black text-white">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <ShoppingBag className="w-12 h-12 stroke-[1] mb-5 text-white/50" />
                                    <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4">{t('cart.empty')}</p>
                                    <button 
                                        onClick={onClose}
                                        className="h-10 px-8 bg-white/10 hover:bg-white hover:text-[#1A0306] text-white text-[11px] font-black uppercase tracking-widest transition-all rounded-[2px]"
                                    >
                                        {t('cart.continueShopping')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-[#170205] border-t border-white/10 shrink-0 space-y-5">
                                {/* Voucher Input */}
                                <div className="flex gap-2 h-10">
                                    <div className="relative flex-1">
                                        <Ticket className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40", language === 'ar' ? "right-3" : "left-3")} />
                                        <input 
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                            disabled={!!voucher}
                                            placeholder={voucher ? voucher.code : t('cart.voucher')}
                                            className={cn(
                                                "w-full h-full bg-black/30 border border-white/10 text-white text-[11px] font-bold tracking-widest uppercase focus:outline-none focus:border-white/50 disabled:bg-white/5 disabled:opacity-50 transition-colors rounded-[2px]",
                                                language === 'ar' ? "pr-9 pl-3" : "pl-9 pr-3"
                                            )}
                                        />
                                    </div>
                                    {voucher ? (
                                        <button 
                                            onClick={() => setVoucher(null)}
                                            className="px-4 h-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all rounded-[2px]"
                                        >
                                            {t('cart.remove')}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={async () => {
                                                if (!voucherCode) return;
                                                setIsApplying(true);
                                                const res = await validateVoucher(voucherCode);
                                                if (res.success && res.voucher) {
                                                    setVoucher({
                                                        id: res.voucher.id,
                                                        code: res.voucher.code,
                                                        type: res.voucher.type,
                                                        value: res.voucher.value
                                                    });
                                                    toast.success("Voucher applied!");
                                                    setVoucherCode("");
                                                } else {
                                                    toast.error(res.error || "Invalid voucher");
                                                }
                                                setIsApplying(false);
                                            }}
                                            disabled={isApplying}
                                            className="px-5 h-full bg-white text-[#1A0306] text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50 rounded-[2px]"
                                        >
                                            {isApplying ? '. .' : t('cart.apply')}
                                        </button>
                                    )}
                                </div>

                                {/* Totals line items */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[12px] font-bold text-white/50 uppercase tracking-[0.1em]">
                                        <span>{t('cart.subtotal')}</span>
                                        <span className="text-white/80">{formatCurrency(items.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
                                    </div>
                                    {voucher && (
                                        <div className="flex justify-between items-center text-[12px] font-bold text-emerald-400/80 uppercase tracking-[0.1em]">
                                            <span>
                                                {t('cart.discount')} ({voucher.code})
                                            </span>
                                            <span>-{formatCurrency(discountAmount())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[12px] font-bold text-white/50 uppercase tracking-[0.1em]">
                                        <span>{t('cart.shipping')}</span>
                                        <span className="text-white/80">{t('cart.shippingCalculated')}</span>
                                    </div>
                                    
                                    <div className="pt-3 pb-1 flex justify-between items-end border-t border-white/10 mt-3">
                                        <span className="text-[14px] font-black uppercase tracking-[0.15em] text-white">{t('cart.estimatedTotal')}</span>
                                        <span className="text-[20px] font-black text-white leading-none">{formatCurrency(totalPrice())}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <Link 
                                        href="/checkout" 
                                        onClick={onClose}
                                        className="h-[50px] w-full bg-white text-[#1A0306] flex items-center justify-center font-black text-[13px] uppercase tracking-[0.2em] shadow-lg hover:bg-white/90 transition-all gap-2 rounded-[2px] group"
                                    >
                                        {t('cart.checkout')}
                                        <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", language === 'ar' && "rotate-180 group-hover:-translate-x-1")} />
                                    </Link>
                                    <Link 
                                        href="/cart" 
                                        onClick={onClose}
                                        className="h-[46px] w-full bg-transparent border border-white/20 text-white flex items-center justify-center font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all rounded-[2px]"
                                    >
                                        {t('cart.viewCart')}
                                    </Link>
                                </div>

                                <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest pt-1 opacity-80">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {t('cart.securePayment')}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
