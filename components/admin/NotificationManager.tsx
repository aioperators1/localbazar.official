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

        // 3. Clean White Order Toast
        toast.custom((t) => (
            <div className="w-[380px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-right duration-300">
                <div className="h-1 w-full bg-emerald-500" />
                <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">New Order</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{order.user?.name || "Guest Customer"}</p>
                            </div>
                        </div>
                        <button onClick={() => toast.dismiss(t)} className="text-gray-300 hover:text-gray-600 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
                        <span className="text-xs text-gray-500 font-medium">Order Total</span>
                        <span className="text-lg font-black text-gray-900">QAR {order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => { window.location.href = `/admin/orders/${order.id}`; toast.dismiss(t); }}
                            className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl h-9 text-xs font-bold"
                        >
                            View Order
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toast.dismiss(t)}
                            className="px-4 rounded-xl h-9 text-xs font-bold border-gray-200"
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            </div>
        ), { duration: 10000 });
    };

    useEffect(() => {
        // Show permission prompt if not yet decided
        if ('Notification' in window && Notification.permission === 'default') {
            const timer = setTimeout(() => setShowPermissionPrompt(true), 1500);
            return () => clearTimeout(timer);
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
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    className="fixed bottom-8 left-8 z-[100] w-80"
                >
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-1 w-full bg-black" />
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Notifications</h3>
                                    <p className="text-[10px] text-gray-400 font-medium">Enable order alerts</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-5">
                                Enable browser notifications to receive real-time order alerts.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={requestPermission}
                                    className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl h-9 text-xs font-bold"
                                >
                                    Enable
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPermissionPrompt(false)}
                                    className="px-4 rounded-xl h-9 text-xs font-bold border-gray-200 text-gray-500"
                                >
                                    Later
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
