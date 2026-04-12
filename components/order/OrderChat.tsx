"use client";

import { useState, useEffect, useRef } from "react";
import { getOrderMessages, sendMessage } from "@/lib/actions/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, User, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    content: string;
    isAdmin: boolean;
    createdAt: Date;
}

interface OrderChatProps {
    orderId: string;
    isAdmin?: boolean;
}

export function OrderChat({ orderId, isAdmin = false }: OrderChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Optimized polling
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const res = await getOrderMessages(orderId);
                if (isMounted) {
                    setMessages(res.messages);
                    setInitialLoad(false);
                }
            } catch (err) {
                console.error("Failed to load messages", err);
            }
        };

        load();
        const interval = setInterval(load, 5000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [orderId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const messageContent = input.trim();
        setInput(""); // Clear immediately for better UX
        setLoading(true);

        // Optimistic update
        const tempId = Math.random().toString();
        const newMessage = {
            id: tempId,
            content: messageContent,
            isAdmin,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            await sendMessage(orderId, messageContent, isAdmin);
            // Re-fetch to ensure sync and real ID
            const res = await getOrderMessages(orderId);
            setMessages(res.messages);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white/[0.01] backdrop-blur-3xl border-t border-white/5">
            {/* Header - Luxury Minimalist */}
            <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-2.5 h-2.5 rounded-full animate-pulse",
                        isAdmin ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    )} />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic opacity-50">
                        {isAdmin ? "Direct Liaison Console" : "Prestige Support"}
                    </span>
                </div>
                {isAdmin && <span className="text-[9px] text-white/20 font-black tracking-widest uppercase bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 shadow-sm italic">Secure Line Encrypted</span>}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-transparent">
                <AnimatePresence>
                {initialLoad ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/10 space-y-6">
                        <Sparkles className="w-12 h-12 opacity-20" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">Initializing Dialogue_</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.isAdmin === isAdmin;
                        const showAvatar = i === 0 || messages[i - 1].isAdmin !== msg.isAdmin;

                        return (
                            <motion.div
                                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id}
                                className={cn(
                                    "flex gap-5 max-w-[85%]",
                                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 border transition-all duration-500 hover:scale-110",
                                    isMe ? "bg-white text-black border-white shadow-2xl" : "bg-white/5 text-white border-white/10 shadow-xl",
                                    !showAvatar && "opacity-0 invisible h-0"
                                )}>
                                    {msg.isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={cn("space-y-3", isMe ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "px-6 py-4 rounded-[24px] text-[14px] leading-relaxed shadow-2xl border transition-all duration-500",
                                        isMe
                                            ? "bg-white text-black font-black italic border-white rounded-tr-none"
                                            : "bg-white/[0.03] text-white/90 border-white/5 font-medium rounded-tl-none hover:bg-white/[0.05]"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <div className={cn(
                                        "text-[9px] font-black uppercase tracking-widest opacity-30 px-2",
                                        isMe ? "text-right" : "text-left"
                                    )}>
                                        {mounted && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isMe ? 'OPERATOR_SELF' : (msg.isAdmin ? 'SYSTEM_COMMAND' : 'EXTERNAL_ENTITY')}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-[28px] pl-8 pr-2 focus-within:border-white/20 focus-within:bg-white/[0.07] transition-all duration-500 shadow-2xl group">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isAdmin ? "TRANSMIT COMMAND_RESPONSE..." : "INITIALIZE INQUIRY..."}
                        className="flex-1 bg-transparent border-0 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:ring-0 h-12 min-w-0 font-black uppercase italic tracking-tight"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-[20px] transition-all duration-700",
                            input.trim()
                                ? "bg-white text-black hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                : "bg-white/5 text-white/10"
                        )}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>
                <p className="text-center text-[9px] text-white/10 font-black uppercase tracking-[0.4em] mt-5 italic">Official Tactical Communication Protocol v9.9.9</p>
            </div>
        </div>
    );
}
