"use client";

import { useState } from "react";
import { ShoppingCart, Mail, Phone, MapPin, Clock, Eye, X, Package, AlertTriangle, CheckCircle2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type AbandonedCheckout = {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    zip: string | null;
    cartItems: string;
    cartTotal: number;
    recovered: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function CheckoutsClient({ initialCheckouts }: { initialCheckouts: AbandonedCheckout[] }) {
    const [checkouts, setCheckouts] = useState<AbandonedCheckout[]>(initialCheckouts);
    const [selectedCheckout, setSelectedCheckout] = useState<AbandonedCheckout | null>(null);
    const [filter, setFilter] = useState<"all" | "abandoned" | "recovered">("all");
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await fetch("/api/admin/checkouts");
            if (res.ok) {
                const data = await res.json();
                setCheckouts(data);
                toast.success("Data refreshed");
            }
        } catch {
            toast.error("Failed to refresh");
        }
        setRefreshing(false);
    };

    const filtered = checkouts.filter(c => {
        if (filter === "abandoned") return !c.recovered;
        if (filter === "recovered") return c.recovered;
        return true;
    });

    const stats = {
        total: checkouts.length,
        abandoned: checkouts.filter(c => !c.recovered).length,
        recovered: checkouts.filter(c => c.recovered).length,
        totalValue: checkouts.filter(c => !c.recovered).reduce((sum, c) => sum + c.cartTotal, 0),
    };

    const handleMarkRecovered = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/checkouts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recovered: true }),
            });
            if (res.ok) {
                setCheckouts(prev => prev.map(c => c.id === id ? { ...c, recovered: true } : c));
                setSelectedCheckout(null);
                toast.success("Marked as recovered");
            }
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this abandoned checkout record?")) return;
        try {
            const res = await fetch(`/api/admin/checkouts/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCheckouts(prev => prev.filter(c => c.id !== id));
                setSelectedCheckout(null);
                toast.success("Deleted");
            }
        } catch {
            toast.error("Failed to delete");
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const parseCartItems = (cartItemsStr: string) => {
        try {
            return JSON.parse(cartItemsStr);
        } catch {
            return [];
        }
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Abandoned Checkouts</h1>
                    <p className="text-[13px] text-gray-500">Track customers who started checkout but didn't complete their order. Use this data for retargeting.</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className="h-10 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider border-gray-200 hover:bg-gray-100 gap-2"
                >
                    <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Checkouts</span>
                    </div>
                    <p className="text-[28px] font-black text-black">{stats.total}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Abandoned</span>
                    </div>
                    <p className="text-[28px] font-black text-amber-600">{stats.abandoned}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recovered</span>
                    </div>
                    <p className="text-[28px] font-black text-emerald-600">{stats.recovered}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <Package className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lost Revenue</span>
                    </div>
                    <p className="text-[28px] font-black text-red-600">QAR {stats.totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { key: "all", label: "All", count: stats.total },
                    { key: "abandoned", label: "Abandoned", count: stats.abandoned },
                    { key: "recovered", label: "Recovered", count: stats.recovered },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                            filter === f.key
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {f.label} ({f.count})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Cart Value</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                                <ShoppingCart className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-[14px] font-bold text-gray-800">No abandoned checkouts yet</p>
                                            <p className="text-[12px] text-gray-500">When customers leave checkout without paying, they'll appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((checkout) => {
                                const items = parseCartItems(checkout.cartItems);
                                const customerName = [checkout.firstName, checkout.lastName].filter(Boolean).join(" ") || "Anonymous";
                                
                                return (
                                    <tr key={checkout.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedCheckout(checkout)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-black text-gray-600 uppercase">
                                                    {customerName.charAt(0)}
                                                </div>
                                                <span className="text-[13px] font-bold text-black">{customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {checkout.email && (
                                                    <div className="flex items-center gap-1.5 text-[12px] text-gray-600">
                                                        <Mail className="w-3 h-3" />{checkout.email}
                                                    </div>
                                                )}
                                                {checkout.phone && (
                                                    <div className="flex items-center gap-1.5 text-[12px] text-gray-600">
                                                        <Phone className="w-3 h-3" />{checkout.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[14px] font-black text-black">QAR {checkout.cartTotal.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-bold text-gray-600">{items.length} items</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                checkout.recovered
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            )}>
                                                {checkout.recovered ? "Recovered" : "Abandoned"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(checkout.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); setSelectedCheckout(checkout); }}
                                                className="h-8 text-[11px] font-bold text-gray-500 hover:text-black"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1" /> View
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedCheckout && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCheckout(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h3 className="text-[16px] font-bold text-black">Checkout Details</h3>
                                <p className="text-[11px] text-gray-500">{new Date(selectedCheckout.createdAt).toLocaleString()}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedCheckout(null)} className="h-8 w-8 p-0">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Customer Information</h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-[13px]">
                                        <span className="font-bold text-black">
                                            {[selectedCheckout.firstName, selectedCheckout.lastName].filter(Boolean).join(" ") || "Anonymous"}
                                        </span>
                                    </div>
                                    {selectedCheckout.email && (
                                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                                            <Mail className="w-3.5 h-3.5" />
                                            <a href={`mailto:${selectedCheckout.email}`} className="hover:underline">{selectedCheckout.email}</a>
                                        </div>
                                    )}
                                    {selectedCheckout.phone && (
                                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                                            <Phone className="w-3.5 h-3.5" />
                                            <a href={`tel:${selectedCheckout.phone}`} className="hover:underline">{selectedCheckout.phone}</a>
                                        </div>
                                    )}
                                    {(selectedCheckout.address || selectedCheckout.city) && (
                                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {[selectedCheckout.address, selectedCheckout.city, selectedCheckout.zip].filter(Boolean).join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Cart Items</h4>
                                <div className="space-y-2">
                                    {parseCartItems(selectedCheckout.cartItems).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                            {item.image && (
                                                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden relative shrink-0">
                                                    <Image src={item.image} alt={item.name || ""} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-bold text-black truncate">{item.name || "Product"}</p>
                                                <p className="text-[11px] text-gray-500">
                                                    Qty: {item.quantity || 1}
                                                    {item.size && ` · Size: ${item.size}`}
                                                    {item.color && ` · Color: ${item.color}`}
                                                </p>
                                            </div>
                                            <span className="text-[12px] font-bold text-black whitespace-nowrap">
                                                QAR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Total</span>
                                    <span className="text-[18px] font-black text-black">QAR {selectedCheckout.cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between rounded-b-2xl">
                            <Button
                                variant="ghost"
                                onClick={() => handleDelete(selectedCheckout.id)}
                                className="h-9 text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                            </Button>
                            <div className="flex gap-2">
                                {selectedCheckout.email && (
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(`mailto:${selectedCheckout.email}?subject=Complete%20Your%20Order&body=Hi%20${selectedCheckout.firstName || ""},%20we%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Complete%20your%20order%20now!`)}
                                        className="h-9 text-[11px] font-bold"
                                    >
                                        <Mail className="w-3.5 h-3.5 mr-1" /> Send Email
                                    </Button>
                                )}
                                {!selectedCheckout.recovered && (
                                    <Button
                                        onClick={() => handleMarkRecovered(selectedCheckout.id)}
                                        className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Recovered
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
