"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Branding } from "@/components/store/Branding";

function ErrorContent() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    const { t, language } = useLanguage();

    const getErrorMessage = (code: string | null) => {
        if (!code) return t('checkout.paymentFailed' as any) || "Your payment could not be processed.";
        if (code === "PaymentCancelled") return "You cancelled the payment process before it finished.";
        if (code.startsWith("PaymentStatus_")) return `Payment declined by the bank (Status: ${code.replace("PaymentStatus_", "")})`;
        return "An unknown error occurred during the transaction. Please try again or use another payment method.";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-transparent" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <header className="absolute top-0 w-full border-b border-white/10 p-6 flex justify-center">
                <Branding size="md" variant="luxury" />
            </header>

            <div className="relative w-full max-w-md mx-auto text-center mt-20">
                <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-pulse"></div>
                    <div className="relative bg-[#1A0306] rounded-full w-16 h-16 flex items-center justify-center shadow-lg border border-red-500/50">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <h2 className="text-[24px] font-black text-white mb-4 tracking-tight uppercase">Payment Failed</h2>
                
                <div className="bg-black/30 border border-white/10 p-6 rounded-[8px] mb-8">
                    <p className="text-[13px] text-white/80 font-medium leading-relaxed">
                        {getErrorMessage(errorParam)}
                    </p>
                    <p className="text-[12px] text-white/50 mt-4">
                        Please don't worry, no charges were made to your account.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/checkout" className="h-[52px] bg-white text-[#592C2F] rounded-[2px] font-bold uppercase tracking-[0.2em] text-[12px] flex items-center justify-center hover:bg-white/90 transition-all shadow-lg">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Try Again
                    </Link>
                    <Link href="/cart" className="h-[52px] bg-transparent border border-white/20 text-white rounded-[2px] font-bold uppercase tracking-[0.2em] text-[12px] flex items-center justify-center hover:bg-white/10 transition-all">
                        Return to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
            <ErrorContent />
        </Suspense>
    );
}
