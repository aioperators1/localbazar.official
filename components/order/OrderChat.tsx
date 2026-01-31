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
    const scrollRef = useRef<HTMLDivElement>(null);

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
            // Revert on failure (optional, but good practice)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[400px] bg-background/50 backdrop-blur-sm">
            {/* Header - Minimalist */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        isAdmin ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    )} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {isAdmin ? "Admin Console" : "Live Support"}
                    </span>
                </div>
                {isAdmin && <span className="text-[10px] text-zinc-600 font-mono">SECURE CONNECTION</span>}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {initialLoad ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-5 h-5 text-zinc-700 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-700 space-y-2">
                        <Sparkles className="w-8 h-8 opacity-20" />
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.isAdmin === isAdmin;
                        const showAvatar = i === 0 || messages[i - 1].isAdmin !== msg.isAdmin;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/5 mt-1",
                                    isMe ? "bg-white/5 text-white" : (msg.isAdmin ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"),
                                    !showAvatar && "opacity-0 invisible"
                                )}>
                                    {msg.isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                </div>
                                <div className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm",
                                    isMe
                                        ? "bg-white text-black font-medium"
                                        : "bg-zinc-800/80 text-zinc-200 border border-white/5"
                                )}>
                                    {msg.content}
                                    <div className={cn(
                                        "text-[9px] font-mono mt-1 opacity-50",
                                        isMe ? "text-zinc-500" : "text-zinc-500"
                                    )}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center gap-2 p-1 bg-zinc-900/50 border border-white/5 rounded-full pl-4 pr-1 focus-within:border-white/20 focus-within:bg-zinc-900 transition-all duration-300">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isAdmin ? "Type reply..." : "Ask us anything..."}
                        className="flex-1 bg-transparent border-0 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 h-9 min-w-0"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full transition-all duration-300",
                            input.trim()
                                ? "bg-white text-black hover:bg-zinc-200 hover:scale-105"
                                : "bg-zinc-800 text-zinc-600 hover:bg-zinc-800"
                        )}
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
