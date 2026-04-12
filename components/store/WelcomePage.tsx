"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Branding } from "./Branding";
import { useLanguage } from "@/components/providers/language-provider";
import { useState, useEffect } from "react";
import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

export function WelcomePage() {
    const { setLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const hasChosen = localStorage.getItem("electro-lang");
        if (!hasChosen) {
            setTimeout(() => setIsVisible(true), 10);
        }
    }, []);

    const handleChoice = (lang: "en" | "ar") => {
        setIsExiting(true);
        setTimeout(() => {
            setLanguage(lang);
            setIsVisible(false);
            localStorage.setItem("welcome-seen", "true");
        }, 1000);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="fixed inset-0 z-[1000] bg-[#592C2F] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div 
                            animate={{ 
                                x: [0, 50, 0],
                                y: [0, 30, 0],
                                opacity: [0.03, 0.05, 0.03]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full bg-brand-burgundy blur-[150px]" 
                        />
                        <motion.div 
                            animate={{ 
                                x: [0, -40, 0],
                                y: [0, -50, 0],
                                opacity: [0.03, 0.06, 0.03]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-black blur-[150px]" 
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-8">
                        {/* Logo Section */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 1, ease: [0.19, 1, 0.22, 1] }}
                            className="mb-20 scale-110 lg:scale-125"
                        >
                            <Branding size="lg" variant="luxury" />
                        </motion.div>

                        {/* Title Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center gap-4 mb-12"
                        >
                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="text-[11px] font-black tracking-[0.5em] text-white/30 uppercase">Curate Your Experience</span>
                        </motion.div>

                        {/* Language Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* English Option */}
                            <motion.button
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                onClick={() => handleChoice("en")}
                                className="group relative bg-black/40 text-white p-8 rounded-[32px] border border-white/10 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                            >
                                <div className="relative z-20 flex flex-col items-start gap-6">
                                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white group-hover:text-[#592C2F] transition-colors duration-500">
                                        <Globe className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[22px] font-serif font-light tracking-tight">English</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-bold tracking-[0.2em] opacity-30 uppercase">Global Access</span>
                                            <ArrowRight className="w-3 h-3 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>
                                    </div>
                                </div>
                            </motion.button>

                            {/* Arabic Option */}
                            <motion.button
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                onClick={() => handleChoice("ar")}
                                className="group relative bg-white/10 text-white p-8 rounded-[32px] border border-white/20 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                            >
                                <div className="relative z-20 flex flex-col items-end gap-6 text-right w-full">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-[#592C2F] transition-colors duration-500">
                                        <Globe className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[26px] font-serif font-light tracking-tight" dir="rtl">اللغة العربية</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <ArrowLeft className="w-3 h-3 translate-x-[10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                                            <span className="text-[9px] font-bold tracking-[0.2em] opacity-30 uppercase">التراث و الثقافة</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Bottom Accreditation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="absolute bottom-12 flex items-center gap-4"
                    >
                        <div className="w-8 h-[1px] bg-white/20" />
                        <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">Local Bazar &bull; Excellence Established</span>
                        <div className="w-8 h-[1px] bg-white/20" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
