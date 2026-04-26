"use client";

import { useEffect, useState, useRef } from 'react';
import { getLatestOrder } from '@/lib/actions/notifications';
import { toast } from 'sonner';
import { ShoppingBag, Bell, Shield, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/lib/types';

export function NotificationManager() {
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    const triggerNotification = (order: Order) => {
        // 1. Audio Pulse
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio activation failed:", e));
        }

        // 2. Browser Notification (Background)
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('NEW_ORDER_MANIFEST', {
                body: `Protocol: ${order.firstName} ${order.lastName}\nValue: QAR ${order.total.toLocaleString()}\nStatus: PENDING`,
                icon: '/logo.png', // Fallback to your site logo
            });
        }

        // 3. Ultra Pro Luxury On-Site Toast
        toast.custom((t) => (
            <div className="w-[450px] relative group animate-in slide-in-from-right duration-500">
                {/* Glowing Outer Frame */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 rounded-3xl blur-[2px] opacity-30 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
                
                <div className="relative glass-card rounded-2xl border border-white/10 bg-[#050505]/95 backdrop-blur-2xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 overflow-hidden">
                    {/* Interior Design Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group/icon">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700" />
                                <ShoppingBag className="w-9 h-9 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">Live Transmission</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                </div>
                                <h4 className="text-[22px] font-black text-white tracking-tighter uppercase leading-none italic">New Acquisition</h4>
                            </div>
                        </div>
                        <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Client Name</span>
                                    <span className="text-lg font-bold text-white tracking-tight">{order.user?.name || "Premium Client"}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Transaction Value</span>
                                    <span className="text-2xl font-black text-emerald-400 font-serif italic tracking-tighter leading-none">
                                        QAR {order.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                             <Button 
                                onClick={() => {
                                    window.location.href = `/admin/orders/${order.id}`;
                                    toast.dismiss(t);
                                }}
                                className="flex-1 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-500 border-none shadow-xl"
                             >
                                Inspect Portfolio
                             </Button>
                             <Button 
                                 variant="ghost" 
                                 onClick={() => toast.dismiss(t)}
                                 className="px-6 rounded-xl h-12 border border-white/5 text-white/30 hover:text-white uppercase text-[10px] font-black tracking-widest"
                             >
                                 Settle
                             </Button>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        />
                    </div>
                </div>
            </div>
        ), { duration: 10000 });
    };

    useEffect(() => {
        // Initialize Audio Context
        audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a16824.mp3');
        audioRef.current.volume = 0.5;

        // Fetch initial order to prevent notification on first load
        const init = async () => {
            const order = await getLatestOrder();
            if (order) {
                setLastOrderId(order.id);
                localStorage.setItem('last_processed_order_id', order.id);
            }
        };
        init();

        // Start Polling Mechanism
        const interval = setInterval(async () => {
            const latest = await getLatestOrder();
            if (!latest) return;

            const storedId = localStorage.getItem('last_processed_order_id');
            
            if (latest.id !== storedId && latest.id !== lastOrderId) {
                triggerNotification(latest);
                setLastOrderId(latest.id);
                localStorage.setItem('last_processed_order_id', latest.id);
            }
        }, 15000); // 15s Polling for optimal performance balance

        return () => clearInterval(interval);
    }, [lastOrderId]);

    const requestPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setShowPermissionPrompt(false);
            
            if (permission === 'granted') {
                toast.success('QUANTUM_NOTIFY_ACTIVE', {
                    description: 'System-level notifications synchronized successfully.',
                });
            }
        }
    };

    return null;
}
