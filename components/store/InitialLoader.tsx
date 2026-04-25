"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";

export function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useLanguage();
    // Default translations just in case useLanguage takes a moment
    const loadingText = language === 'ar' ? 'تجهيز التجربة' : (language === 'fr' ? 'Préparation de l\'expérience' : 'Preparing Experience');
    const isAr = language === 'ar';

    useEffect(() => {
        // Reduced to minimal aesthetic duration for first entry
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Also update the next.js global loading state visually if someone uses app/loading.tsx
    // But this overlay handles the hard reloads
    
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        clipPath: "inset(0 0 100% 0)", 
                        transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 } 
                    }}
                    className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Atmospheric Background glow */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-brand-burgundy rounded-full blur-[120px] mix-blend-screen" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-12">
                        {/* Premium Brand Mark */}
                        <div className="overflow-hidden">
                            <motion.div 
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                                className="flex items-center gap-6"
                            >
                                <span className="text-[32px] sm:text-[48px] font-serif font-light tracking-widest text-white">LOCAL</span>
                                <motion.div 
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                                    className="w-[1px] h-12 sm:h-16 bg-white/20 rotate-[20deg]" 
                                />
                                <span className="text-[32px] sm:text-[48px] font-serif font-black tracking-tight text-brand-burgundy italic">BAZAR</span>
                            </motion.div>
                        </div>
                        
                        {/* Elegant Progress Line */}
                        <div className="w-[180px] sm:w-[240px] h-[1px] bg-white/10 relative overflow-hidden">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 2.8, ease: "easeInOut" }}
                                className="absolute top-0 left-0 h-full w-full bg-white origin-left"
                            />
                        </div>

                        {/* Status Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                            <p className={cn(
                                "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.5em] text-white/40",
                                isAr && "font-sans tracking-widest"
                            )}>
                                {loadingText}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Simple CN utility just in case it isn't imported
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
