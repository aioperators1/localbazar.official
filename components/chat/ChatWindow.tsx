"use client";
import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/actions/chat";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatWindow({ conversationId, initialMessages, currentUserId }: any) {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!input.trim()) return;
        const msg = input;
        setInput("");

        // Optimistic update
        const tempMsg = {
            id: "temp-" + Date.now(),
            content: msg,
            senderId: currentUserId,
            createdAt: new Date(),
            read: false
        };
        setMessages((prev: any) => [...prev, tempMsg]);

        try {
            await sendMessage(conversationId, msg);
        } catch (e) {
            console.error("Failed to send", e);
            // Could revert logic here
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-card border rounded-b-xl shadow-lg border-t-0 overflow-hidden h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m: any) => (
                    <div key={m.id} className={cn("flex", m.senderId === currentUserId ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[80%] px-4 py-2 rounded-2xl text-sm break-words",
                            m.senderId === currentUserId
                                ? "bg-indigo-500 text-white rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                        )}>
                            {m.content}
                            <div className={cn("text-[8px] mt-1 text-right opacity-50", m.senderId === currentUserId ? "text-indigo-100" : "text-muted-foreground")}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t bg-muted/20 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-background border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={handleSend} size="icon" className="rounded-full bg-indigo-500 hover:bg-indigo-600 h-10 w-10 shrink-0">
                    <Send className="w-4 h-4 text-white" />
                </Button>
            </div>
        </div>
    )
}
