"use client";

import React, { useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, FileText, CheckCircle2, Package, User, CreditCard, MapPin } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface OrderItem {
    id: string;
    price: number;
    quantity: number;
    size?: string | null;
    product: {
        name: string;
    };
}

interface Address {
    street: string;
    city: string;
    zip: string;
    country: string;
    buildingNo?: string | null;
    zoneNo?: string | null;
}

interface Order {
    id: string;
    createdAt: string | Date;
    total: number;
    paymentMethod: string;
    user?: {
        name?: string | null;
        email?: string | null;
        addresses?: Address[];
    };
    shippingAddress?: Address;
    items: OrderItem[];
}

interface Settings {
    storeAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
}

interface InvoiceModalProps {
    order: Order;
    settings: Settings;
    trigger?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function InvoiceModal({ order, settings, trigger, isOpen, onOpenChange }: InvoiceModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const shippingAddr = order.user?.addresses?.[0] || order.shippingAddress;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[950px] w-[95vw] h-[90vh] overflow-y-auto p-0 bg-[#F8F8F8] border-none shadow-2xl gap-0">
                {/* MODAL HEADER / ACTIONS */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 p-4 flex items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#E2D8C5]" />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Official Invoice Console</h3>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">LB-INV-{order.id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={handlePrint}
                            className="bg-black text-white hover:bg-zinc-800 rounded-full h-9 px-6 text-[10px] font-black uppercase tracking-widest gap-2 transition-all shadow-lg hover:shadow-black/20"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print Official Document
                        </Button>
                    </div>
                </div>

                {/* INVOICE CONTENT (THE PRINTABLE AREA) */}
                <div className="p-12 flex justify-center bg-[#F1F1F1] min-h-full print:p-0 print:bg-white">
                    <div 
                        ref={printRef}
                        className="bg-white w-full max-w-[800px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden print:shadow-none print:max-w-none print:rounded-none"
                        id="invoice-printable"
                    >
                        {/* INVOICE TOP BANNER */}
                        <div className="bg-[#181818] p-12 text-white flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-serif italic font-black tracking-tighter mb-2">LOCAL BAZAR</h1>
                                <p className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase">Legacy & Excellence Portal</p>
                                <div className="mt-8 space-y-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    <p>{settings?.storeAddress || "Luxury District, Doha, Qatar"}</p>
                                    <p>{settings?.contactPhone || "+974 5055 8884"}</p>
                                    <p>{settings?.contactEmail || "concierge@localbazar.qa"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-5xl font-serif italic text-white/10 select-none">INVOICE</h2>
                                <div className="mt-4 space-y-1">
                                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Date of Issue</p>
                                    <p className="text-sm font-bold font-serif italic">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 space-y-12">
                            {/* INVOICE INFO GRID */}
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">Prestige Client</h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-serif italic font-black text-black">{order.user?.name || "Distinguished Guest"}</p>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{order.user?.email || ""}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">Reference Protocol</h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-mono font-black text-black uppercase">{order.id.slice(-12)}</p>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">LB-PROTO-{order.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LOGISTICS & PAYMENT */}
                            <div className="grid grid-cols-2 gap-12 bg-zinc-50/50 p-8 rounded-xl border border-zinc-100/50">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#592C2F]">
                                        <MapPin className="w-3 h-3" /> Delivery Destination
                                    </div>
                                    {shippingAddr ? (
                                        <div className="text-[12px] font-bold text-black uppercase leading-relaxed tracking-wider">
                                            {shippingAddr.buildingNo && <p>Building {shippingAddr.buildingNo}</p>}
                                            <p>Street {shippingAddr.street}</p>
                                            {shippingAddr.zoneNo && <p>Zone {shippingAddr.zoneNo}</p>}
                                            <p>{shippingAddr.city}, {shippingAddr.zip || "00000"}</p>
                                            <p className="mt-2 text-[10px] bg-black text-white inline-block px-2 py-0.5 rounded-sm">{shippingAddr.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-zinc-400">No address context provided</p>
                                    )}
                                </div>
                                <div className="space-y-4 text-right flex flex-col items-end">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#592C2F]">
                                        <CreditCard className="w-3 h-3" /> Settlement Method
                                    </div>
                                    <p className="text-[13px] font-black text-black uppercase italic tracking-[0.1em] bg-white px-4 py-2 rounded-lg border border-zinc-100 shadow-sm">
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery (Standard)' : order.paymentMethod}
                                    </p>
                                </div>
                            </div>

                            {/* ITEM TABLE */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Composition Details</h4>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-black">
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-black">Description</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-black">SKU</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-black text-center">Qty</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-black text-right">Price</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-black text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="group">
                                                <td className="py-6">
                                                    <p className="text-sm font-serif italic font-black text-black uppercase group-hover:text-[#592C2F] transition-colors">{item.product.name}</p>
                                                    {item.size && <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Dimension: {item.size}</span>}
                                                </td>
                                                <td className="py-6 text-[11px] font-mono text-zinc-400">{(order.id.slice(0, 4) + item.id.slice(-4)).toUpperCase()}</td>
                                                <td className="py-6 text-[12px] font-black text-black text-center">{item.quantity}</td>
                                                <td className="py-6 text-[12px] font-bold text-zinc-500 text-right">{formatPrice(item.price)}</td>
                                                <td className="py-6 text-[14px] font-serif italic font-black text-black text-right">{formatPrice(item.quantity * item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TOTALS */}
                            <div className="flex justify-end pt-8">
                                <div className="w-full max-w-[300px] space-y-3 bg-[#181818] p-8 text-white rounded-xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -rotate-45 translate-x-12 -translate-y-12" />
                                    
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(order.total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>Logistics</span>
                                        <span className="text-emerald-500">Complimentary</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Final Total</span>
                                        <span className="text-3xl font-serif italic font-black tracking-tighter">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="pt-20 text-center space-y-6 border-t border-zinc-100">
                                <div className="flex justify-center items-center gap-2 text-black/20">
                                    <div className="h-[1px] w-12 bg-current" />
                                    <CheckCircle2 className="w-4 h-4" />
                                    <div className="h-[1px] w-12 bg-current" />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[500px] mx-auto">
                                    Authenticity Guaranteed by Local Bazar Heritage Portal. This document serves as official transfer of acquisition.
                                </p>
                                <div className="text-[11px] font-serif italic text-black font-black">
                                    Verify Authenticity: LB-SEC-{order.id.slice(-8).toUpperCase()}-2026
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRINT STYLES */}
                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #invoice-printable, #invoice-printable * {
                            visibility: visible;
                        }
                        #invoice-printable {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        @page {
                            margin: 0;
                        }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}

