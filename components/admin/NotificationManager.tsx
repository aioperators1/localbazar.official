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

        // 3. Ultra Pro On-Site Toast
        toast.custom((t) => (
            <div className="w-[400px] glass-card rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-3xl p-6 shadow-4xl flex items-start gap-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-inner group-hover:border-blue-500/20 transition-all duration-700">
                    <ShoppingBag className="w-8 h-8 animate-pulse" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Transaction Alert</span>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Live Flow</span>
                        </div>
                    </div>
                    <h4 className="text-lg font-black text-white tracking-tighter uppercase leading-none">New Incoming Order</h4>
                    <p className="text-[12px] font-bold text-white/60 leading-tight">
                        <span className="text-white">{order.user?.name || "External Entity"}</span> allocated <span className="text-blue-400">QAR {order.total.toLocaleString()}</span> to the nexus.
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                                window.location.href = `/admin/orders/${order.id}`;
                                toast.dismiss(t);
                            }}
                            className="bg-white/5 text-white/40 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                         >
                            Audit Details
                         </Button>
                         <Button 
                             variant="ghost" 
                             size="sm" 
                             onClick={() => toast.dismiss(t)}
                             className="text-[9px] font-black uppercase text-white/20 hover:text-white"
                         >
                             Ignore
                         </Button>
                    </div>
                </div>
                <button onClick={() => toast.dismiss(t)} className="absolute top-4 right-4 text-white/10 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        ), { duration: 10000 });
    };

    useEffect(() => {
        // Initialize Notification Status
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                const timer = setTimeout(() => {
                    setShowPermissionPrompt(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }

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

    return (
        <AnimatePresence>
            {showPermissionPrompt && (
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-10 left-10 z-[100] max-w-sm"
                >
                    <div className="glass-card rounded-3xl border border-white/10 bg-[#050505] p-8 shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-white/20 to-transparent" />
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                <Bell className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">Alert Nexus</h3>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Protocol Level Synchronization</p>
                            </div>
                        </div>
                        <p className="text-[13px] font-bold text-white/60 leading-relaxed mb-8">
                            To ensure <span className="text-white italic">Zero-Latency Operational Awareness</span>, please enable browser notifications to receive incoming order signals in real-time.
                        </p>
                        <div className="flex items-center gap-4">
                            <Button 
                                onClick={requestPermission}
                                className="flex-1 bg-white text-black hover:bg-white/90 rounded-2xl h-12 font-black uppercase text-[11px] tracking-widest transition-all shadow-xl"
                            >
                                Synchronize Notifications
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => setShowPermissionPrompt(false)}
                                className="px-6 rounded-2xl h-12 border border-white/5 text-white/20 hover:text-white uppercase text-[10px] font-black"
                            >
                                Dim
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
