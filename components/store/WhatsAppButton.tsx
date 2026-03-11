"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/97450558884"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
        >
            <MessageCircle className="w-8 h-8 fill-white" />
        </a>
    );
}
