"use client";

import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { toast } from "sonner";

interface AddToCartProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        size?: string | null;
        color?: string | null;
    };
    fullWidth?: boolean;
    className?: string;
    quantity?: number;
    disabled?: boolean;
}

export function AddToCart({ product, fullWidth = true, className, quantity = 1, disabled }: AddToCartProps) {
    const router = useRouter();
    const addItem = useCart((state) => state.addItem);
    const { t, language } = useLanguage();
    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: "Fashion",
            quantity: quantity,
            size: product.size,
            color: product.color
        });

        // Simulate network/store delay for effect
        setTimeout(() => {
            setIsAdding(false);
            setIsSuccess(true);

            toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart', {
                description: product.name,
                action: {
                    label: "CHECKOUT",
                    onClick: () => router.push("/checkout")
                },
                style: {
                    background: 'rgba(32, 8, 11, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            });

            // Reset success state
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        }, 600);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdding || isSuccess || disabled}
            className={cn(
                "relative font-bold h-12 rounded-[3px] flex items-center justify-center gap-2 transition-colors",
                fullWidth ? "w-full" : "px-8",
                isSuccess
                    ? "bg-[#111111] text-white" 
                    : isAdding || isSuccess || disabled
                        ? "bg-black/20 text-white/40 cursor-not-allowed border border-white/5"
                        : "bg-[#111111] text-white hover:bg-[#333]",
                className
            )}
        >
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        <span>{t('product.addedShort')}</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        {isAdding ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                        <span>{isAdding ? t('product.adding') : t('cart.add')}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
