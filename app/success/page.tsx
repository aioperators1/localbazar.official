"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

// Simulated type for the order data
interface OrderInfo {
    orderId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: string;
    total: number;
    items: { id: string; name: string; price: number; quantity: number; image?: string; category?: string }[];
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get("orderId");
    const [orderData, setOrderData] = useState<OrderInfo | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = sessionStorage.getItem('localbazar_last_order');
        if (saved) {
            try {
                setOrderData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse order data");
            }
        }
    }, []);

    // If still mounting, show skeleton or blank
    if (!mounted) return <div className="min-h-screen bg-white" />;

    const orderId = orderData?.orderId || orderIdParam || "N/A";
    const subtotal = orderData ? orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
    const shipping = 35;
    const isOnlinePayment = orderData?.paymentMethod === "CARD";

    if (!orderData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
                <div className="relative w-full max-w-md mx-auto text-center">
                    <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-brand-burgundy opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="relative bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl border-2 border-brand-burgundy">
                            <CheckCircle2 className="w-8 h-8 text-brand-burgundy animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-[28px] font-black text-[#111111] mb-3 tracking-tight uppercase">Order Confirmed</h2>
                    <p className="text-[14px] text-zinc-500 font-medium mb-8 leading-relaxed max-w-[320px] mx-auto uppercase tracking-widest">
                        Your order {orderIdParam && <span className="font-bold text-[#111111]">#{orderIdParam.slice(-8).toUpperCase()}</span>} has been received and is being processed.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href="/shop" className="h-[52px] bg-[#111111] text-white rounded-[2px] font-bold uppercase tracking-[0.2em] text-[12px] flex items-center justify-center shadow-lg hover:bg-brand-burgundy transition-all">
                            Continue Shopping
                        </Link>
                        <Link href="/" className="h-[52px] bg-white border border-zinc-200 text-[#111111] rounded-[2px] font-bold uppercase tracking-[0.2em] text-[12px] flex items-center justify-center hover:bg-zinc-50 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Full-width Header */}
            <header className="w-full border-b border-zinc-100 bg-white sticky top-0 z-50 flex items-center justify-center h-[72px]">
                <Link href="/" className="flex items-center">
                    <div className="relative w-[180px] h-[45px]">
                        <Image 
                            src="/logo.svg" 
                            alt="Local Bazar Logo" 
                            fill 
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
            </header>

            {/* Split Layout */}
            <div className="flex flex-col lg:flex-row flex-1">
                {/* LEFT COLUMN: Confirmation Info */}
                <div className="flex-1 bg-white relative z-10 flex justify-end lg:pr-8">
                    <div className="w-full max-w-[650px] px-6 lg:px-12 pt-10 lg:pt-14 pb-16 fade-in">

                        {/* Checkmark & Title */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                            <div className="w-[50px] h-[50px] shrink-0 rounded-full border border-brand-burgundy flex items-center justify-center bg-white shadow-sm">
                                <CheckCircle2 className="w-6 h-6 text-brand-burgundy" strokeWidth={2} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                                    Order # {orderId.slice(-8).toUpperCase()}
                                </span>
                                <h1 className="text-[24px] font-black text-[#111111] leading-tight mt-1 uppercase tracking-tight">
                                    Thank you{orderData?.firstName ? `, ${orderData.firstName}` : ""} !
                                </h1>
                            </div>
                        </div>

                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                            {/* Status Box */}
                            <div className="border border-zinc-100 rounded-[8px] p-6 mb-8 bg-[#FAFAFA] shadow-sm">
                                <h2 className="text-[14px] font-bold text-[#111111] mb-5 uppercase tracking-wide">Your order is confirmed</h2>
                                <div className="space-y-4 text-[13px] text-[#111111] font-medium leading-[1.6]">
                                    <p>Our concierge service will contact you shortly to finalize your delivery details.</p>
                                    <p className="text-zinc-500 italic">"The Excellence of Luxury & Heritage"</p>
                                </div>
                            </div>

                            {/* Order Details Grid Box */}
                            <div className="border border-zinc-100 rounded-[8px] p-6 mb-12 bg-white shadow-sm">
                                <h3 className="text-[14px] font-bold text-[#111111] mb-6 uppercase tracking-widest">Order details</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                                    {/* Contact Information */}
                                    <div>
                                        <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Contact Information</h4>
                                        <p className="text-[13px] text-[#111111] font-medium leading-relaxed">
                                            {orderData?.email} <br />
                                            {orderData?.phone}
                                        </p>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Payment Method</h4>
                                        <p className="text-[13px] text-[#111111] font-medium leading-relaxed">
                                            {isOnlinePayment ? "Credit Card" : "Cash on Delivery (COD)"} — {formatPrice(orderData.total + shipping)}
                                        </p>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Shipping Address</h4>
                                        <p className="text-[13px] text-[#111111] font-medium leading-relaxed">
                                            {orderData?.firstName} {orderData?.lastName} <br />
                                            {orderData?.address} <br />
                                            {orderData?.city}, {orderData?.zip} <br />
                                            Qatar
                                        </p>
                                    </div>

                                    {/* Shipping Method */}
                                    <div>
                                        <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Shipping Method</h4>
                                        <p className="text-[13px] text-[#111111] font-medium leading-relaxed uppercase tracking-tight">Express Shipping — Qatar Wide</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action Area */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 w-full">
                                <Link href="/support" className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest hover:text-brand-burgundy transition-colors">
                                    Need help? Contact concierge
                                </Link>

                                <Button asChild className="h-[48px] px-10 rounded-[2px] bg-[#111111] text-white hover:bg-brand-burgundy shadow-lg transition-all w-full sm:w-auto text-[12px] font-bold uppercase tracking-[0.2em]">
                                    <Link href="/shop">
                                        Continue Shopping
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Summary */}
                <div className="flex-1 bg-[#FAFAFA] border-l border-zinc-100 relative lg:min-h-screen">
                    <div className="w-full max-w-[500px] px-6 lg:px-12 pt-10 lg:pt-14 pb-12 sticky top-[72px]">

                        {orderData ? (
                            <>
                                {/* Product List */}
                                <div className="space-y-4 mb-8">
                                    {orderData.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="relative w-[64px] h-[64px] bg-white border border-zinc-200 rounded-[8px] flex items-center justify-center shrink-0 shadow-sm">
                                                <div className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-[#111111] text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm z-10 leading-none">
                                                    {item.quantity}
                                                </div>
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-zinc-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className="text-[12px] font-bold text-[#111111] leading-tight line-clamp-2 uppercase tracking-tight">{item.name}</p>
                                            </div>
                                            <div className="text-[13px] font-bold text-[#111111] whitespace-nowrap">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-4 pt-6 border-t border-zinc-200">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span>{formatPrice(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 text-[#111111] font-black text-[22px] uppercase">
                                        <span>Total</span>
                                        <span className="flex items-baseline gap-2">
                                            <span className="text-[12px] text-zinc-400 font-medium">QAR</span>
                                            {formatPrice(subtotal + shipping).replace('QAR', '').trim()}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : null}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <SuccessContent />
        </Suspense>
    );
}
