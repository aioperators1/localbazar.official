"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, ArrowLeft, User, MessageCircle, Activity, Globe, Disc } from "lucide-react";
import { sendMessage, markMessagesAsRead } from "@/lib/actions/marketplace";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ChatInterface({ conversation, currentUserId, otherUser }: any) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        markMessagesAsRead(conversation.id);
    }, [conversation.id]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        const text = input;
        setInput("");

        try {
            await sendMessage(conversation.id, text);
        } catch (err) {
            console.error(err);
            setInput(text);
        } finally {
            setLoading(false);
        }
    };

    const productImg = conversation.product.images;
    let displayImg = "/placeholder.png";
    try {
        if (productImg.startsWith('[')) {
            displayImg = JSON.parse(productImg)[0];
        } else {
            displayImg = productImg;
        }
    } catch { }

    return (
        <div className="flex flex-col h-full bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/5 blur-[80px] pointer-events-none" />

            {/* Nexus Header */}
            <div className="p-6 md:p-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-6">
                    <Link href="/chats" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20" />
                            <div className="relative w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <User className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-emerald-500 border-4 border-black animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black italic text-white uppercase tracking-tight leading-none truncate max-w-[150px] md:max-w-none">{otherUser.name || "External Node"}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Activity className="w-3 h-3 text-indigo-500" />
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Established Direct Link</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    href={`/product/${conversation.product.slug}`}
                    className="flex items-center gap-4 p-3 pr-6 bg-white/[0.03] rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.05] transition-colors" />
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <div className="hidden sm:block relative z-10">
                        <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1 italic">Negotiating:</div>
                        <p className="text-xs font-black text-white uppercase truncate max-w-[120px] tracking-tight">{conversation.product.name}</p>
                    </div>
                </Link>
            </div>

            {/* Transmission Stream */}
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar relative"
            >
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.03),transparent_70%)] pointer-events-none" />

                {conversation.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center opacity-20">
                            <Disc className="w-10 h-10 animate-spin-slow" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Awaiting Payload Entry...</p>
                    </div>
                ) : (
                    conversation.messages.map((msg: any, i: number) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                key={msg.id}
                                className={cn(
                                    "flex",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "relative max-w-[80%] md:max-w-[70%] group",
                                    isMe ? "text-right" : "text-left"
                                )}>
                                    <div className={cn(
                                        "rounded-3xl px-6 py-4 shadow-2xl relative overflow-hidden",
                                        isMe
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-white/[0.03] backdrop-blur-xl border border-white/5 text-zinc-100 rounded-tl-none"
                                    )}>
                                        {/* HUD Corner Detail */}
                                        <div className={cn(
                                            "absolute top-0 w-8 h-[1px] bg-white/20",
                                            isMe ? "right-0" : "left-0"
                                        )} />

                                        <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                    </div>
                                    <p className={cn(
                                        "text-[9px] mt-2 font-mono font-bold uppercase tracking-widest text-zinc-600 opacity-60",
                                        isMe ? "text-right mr-1" : "text-left ml-1"
                                    )}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && <span className="ml-2 text-indigo-500">✓ DELIVERED</span>}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Port */}
            <div className="p-6 md:p-8 bg-black/60 backdrop-blur-3xl border-t border-white/5 z-10 relative">
                <form onSubmit={handleSend} className="relative group">
                    <div className="absolute -inset-1 bg-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Establish transmission..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-5 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all pr-20"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:grayscale shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 group/send"
                    >
                        <Send className="w-5 h-5 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />
                    </button>
                </form>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
