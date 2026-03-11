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
        size?: string | null;
        color?: string | null;
    };
    fullWidth?: boolean;
    className?: string;
    quantity?: number;
}

export function AddToCart({ product, fullWidth = true, className, quantity = 1 }: AddToCartProps) {
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
            category: "Fashion",
            quantity: quantity,
            size: product.size,
            color: product.color
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
        <button
            onClick={handleAdd}
            disabled={isAdding || isSuccess}
            className={cn(
                "relative font-bold h-12 rounded-[3px] flex items-center justify-center gap-2 transition-colors",
                fullWidth ? "w-full" : "px-8",
                isSuccess
                    ? "bg-brand-green hover:bg-emerald-600 text-brand-charcoal"
                    : "bg-brand-blue hover:bg-brand-charcoal text-white",
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
                        <span>Ajouté.</span>
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
                        <span>{isAdding ? "Ajout..." : "Ajouter au panier"}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
