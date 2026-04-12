"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminLoading() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 15);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#0F1113] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#1a1a1a,transparent)]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center space-y-12">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="relative"
                >
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(255,255,255,0.1)] border border-white/10 group overflow-hidden">
                        <span className="text-3xl font-black text-black">LB</span>
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Scanning Pulse */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.1, 0], scale: 2 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-x-[-40px] inset-y-[-40px] border border-white/20 rounded-full"
                    />
                </motion.div>

                {/* Text Elements */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="space-y-1"
                    >
                        <h1 className="text-white text-[12px] font-black uppercase tracking-[0.6em] mb-1">Local Bazar</h1>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Command Center v2.0</p>
                    </motion.div>

                    {/* Progress Loader - Ultra Pro */}
                    <div className="w-56 h-[2px] bg-white/5 relative overflow-hidden rounded-full mx-auto mt-12">
                        <motion.div 
                            className="absolute h-full bg-white shadow-[0_0_15px_white]"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-2 mt-6"
                    >
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                           <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                           System Initialization: {progress}%
                        </span>
                        
                        {/* Dynamic Status Text */}
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={Math.floor(progress / 25)}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]"
                            >
                                {progress < 25 && "Encrypting Session..."}
                                {progress >= 25 && progress < 50 && "Syncing Databases..."}
                                {progress >= 50 && progress < 75 && "Connecting Core API..."}
                                {progress >= 75 && progress < 95 && "Finalizing Interface..."}
                                {progress >= 95 && "Welcome, Admin User."}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Footer Attribution */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em]">Crafted by</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-white/10 rounded-sm flex items-center justify-center p-0.5">
                           <Image 
                               src="https://res.cloudinary.com/dietm7v96/image/upload/v1741743128/f7r0s9ov4gq3sttbt3y6.png"
                               alt="AI Operators"
                               width={16}
                               height={16}
                               className="object-contain"
                           />
                        </div>
                        <span className="text-[8px] font-black text-white uppercase tracking-wider">AI Operators Group</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
