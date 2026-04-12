"use client";

import { useState } from "react";
import { User, Package, Settings, LayoutDashboard, LogOut, Shield, Mail, Calendar, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/auth/SignOutButton";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";

import { Order, AppUser } from "@/lib/types";

interface AccountViewProps {
    user: AppUser;
    orders: Order[];
}

export default function AccountView({ user, orders }: AccountViewProps) {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Identity", icon: User },
        { id: "orders", label: "Acquisitions", icon: Package },
        { id: "settings", label: "Protocols", icon: Settings },
    ];

    return (
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                activeTab === tab.id
                                    ? "bg-white text-[#592C2F] shadow-lg shadow-white/10"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <tab.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-[#592C2F]" : "text-white/60")} />
                            <span className="font-black uppercase italic tracking-tighter text-sm">{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                                />
                            )}
                        </button>
                    ))}

                    {user.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all mt-4 border border-white/10"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-black uppercase italic tracking-tighter text-sm">Dashboard</span>
                        </Link>
                    )}
                </div>

                <div className="pt-6 border-t border-white/5">
                    <SignOutButton />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-black/20 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl min-h-[600px] flex flex-col"
                    >
                        {/* Tab Content Header */}
                        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-10">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-white/10 rounded-full blur opacity-50" />
                                    <div className="relative w-24 h-24 bg-white/5 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-zinc-700" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-zinc-900 rounded-full" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                                        {user.name || "CLIENT"}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <div className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                            {user.role || "USER"}
                                        </div>
                                        <span className="text-white/60 text-xs font-medium">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status</span>
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                                    <Activity className="w-3 h-3 animate-pulse" /> SYNCED
                                </div>
                            </div>
                        </div>

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <div className="space-y-8 flex-1">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Shield className="w-4 h-4 text-white/50" />
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-wider">Identity Core</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Public Alias</p>
                                                <p className="text-white font-bold">{user.name || "None"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Comm Channel</p>
                                                <p className="text-white font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Calendar className="w-4 h-4 text-white/50" />
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-wider">Activity Log</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Total Acquisitions</p>
                                                <p className="text-white font-bold">{orders.length} Units</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Last Transmission</p>
                                                <p className="text-white font-bold">{orders[0] ? new Date(orders[0].createdAt).toLocaleDateString() : "Never"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === "orders" && (
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Recent Transmissions</h3>
                                    <Link href="/orders" className="text-xs text-white/80 font-bold hover:underline">Full Log &rarr;</Link>
                                </div>
                                {orders.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-3xl">
                                        <Package className="w-12 h-12 text-zinc-800 mb-4" />
                                        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No Acquisition Records Found</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {orders.slice(0, 5).map((order) => (
                                            <Link
                                                key={order.id}
                                                href={`/orders/${order.id}`}
                                                className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">REF_ID</p>
                                                        <p className="text-white font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                    <div className="h-8 w-px bg-white/20" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Status</p>
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-wider",
                                                            order.status === 'DELIVERED' ? 'text-emerald-500' : 'text-amber-500'
                                                        )}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Value</p>
                                                        <p className="text-white font-black italic tracking-tighter">
                                                            {formatPrice(order.total)}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === "settings" && (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4">
                                    <Settings className="w-8 h-8 text-white/50 animate-spin-slow" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">System Protocols Locked</h3>
                                <p className="text-white/60 text-sm font-medium">Identity modification service is currently offline for maintenance.</p>
                            </div>
                        )}

                        <style jsx>{`
                            @keyframes spin-slow {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                            .animate-spin-slow {
                                animation: spin-slow 8s linear infinite;
                            }
                        `}</style>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
