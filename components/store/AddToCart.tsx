"use client";

import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddToCartProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    fullWidth?: boolean;
}

export function AddToCart({ product, fullWidth = true }: AddToCartProps) {
    const addItem = useCart((state) => state.addItem);
    const { toast } = useToast();
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
            category: "Electronics", // Default category if not provided
            quantity: 1,
        });

        // Simulate network/store delay for effect
        setTimeout(() => {
            setIsAdding(false);
            setIsSuccess(true);

            toast({
                title: "Added to cart", // Simple title
                description: `${product.name} is now in your cart.`,
                variant: "default",
                className: "bg-background/80 backdrop-blur-xl border-primary/20",
            });

            // Reset success state
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        }, 600);
    };

    return (
        <motion.button
            onClick={handleAdd}
            disabled={isAdding || isSuccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "group relative overflow-hidden font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95",
                fullWidth ? "w-full" : "w-auto px-8",
                isSuccess
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
            )}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-2 relative z-20"
                    >
                        <Check className="w-5 h-5" />
                        <span>Added</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="default"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-2 relative z-20"
                    >
                        {isAdding ? (
                            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
