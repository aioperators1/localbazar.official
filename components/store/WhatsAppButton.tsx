"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ settings }: { settings?: { whatsappNumber?: string } }) {
    const whatsapp = settings?.whatsappNumber || "97450558884";
    // Remove any non-numeric characters for the link
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    
    return (
        <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 lg:bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 lg:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
        >
            <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 fill-white" />
        </a>
    );
}
