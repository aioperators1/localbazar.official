"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceModal } from "./InvoiceModal";

interface InvoiceButtonProps {
    order: any;
    settings: any;
}

export function InvoiceButton({ order, settings }: InvoiceButtonProps) {
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <>
            <Button 
                onClick={() => setPreviewOpen(true)}
                variant="outline" 
                className="flex items-center gap-3 bg-black text-white hover:bg-[#1a1a1a] border-none rounded-full h-12 uppercase font-black text-[10px] tracking-[0.2em] px-8 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-500 active:scale-95"
            >
                <FileDown className="w-4 h-4 text-[#E2D8C5]" />
                Generate Invoice PDF
            </Button>

            <InvoiceModal 
                order={order} 
                settings={settings} 
                isOpen={previewOpen} 
                onOpenChange={setPreviewOpen} 
            />
        </>
    );
}
