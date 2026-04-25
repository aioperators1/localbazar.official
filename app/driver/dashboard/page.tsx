
import { getDriverSession, clearDriverSession } from "@/lib/driver-auth";
import { redirect } from "next/navigation";
import { getAvailableOrders, getDriverActiveOrders } from "@/lib/actions/driver";
import { Truck, LogOut, Package, MapPin, Phone, Zap, Clock, Navigation, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { OrderClaimButton } from "@/components/driver/OrderClaimButton";
import { StatusUpdateButton } from "@/components/driver/StatusUpdateButton";
import { motion } from "framer-motion";

export default async function DriverDashboard() {
    const session = await getDriverSession();
    if (!session) redirect("/driver/login");

    const availableOrders = await getAvailableOrders();
    const activeOrders = await getDriverActiveOrders(session.driverId);

    const handleLogout = async () => {
        "use server";
        await clearDriverSession();
        redirect("/driver/login");
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32 font-inter selection:bg-black selection:text-white">
            {/* Ultra-Pro Nav */}
            <div className="bg-black text-white px-8 py-8 sticky top-0 z-50 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl bg-black/95 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center relative group">
                        <Truck className="w-6 h-6 text-black" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black uppercase tracking-tighter leading-none italic">{session.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Operational Status: Live</p>
                        </div>
                    </div>
                </div>
                <form action={handleLogout}>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group">
                        <LogOut className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                </form>
            </div>

            <main className="p-6 max-w-xl mx-auto space-y-12 mt-4">
                {/* Active Task Section */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-black">Active Assignments</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Last Synced: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="px-4 py-2 bg-black rounded-full shadow-lg shadow-black/10">
                            <span className="text-white text-[11px] font-black tracking-tighter">{activeOrders.length} TASKS</span>
                        </div>
                    </div>

                    {activeOrders.length === 0 ? (
                        <div className="p-16 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50/30">
                            <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center mb-6">
                                <Package className="w-8 h-8 text-gray-100" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">Awaiting Deployment</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeOrders.map((order: any, idx: number) => (
                                <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 group animate-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 100}ms` }}>
                                   <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Fast-Track Delivery</span>
                                            </div>
                                            <h3 className="font-black text-2xl text-black uppercase tracking-tight leading-none italic">{order.user?.name || "Customer Pool"}</h3>
                                            <p className="text-[10px] text-gray-400 font-mono">HASH: {order.id.slice(-12).toUpperCase()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <a href={`tel:${order.user?.phone}`} className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all">
                                                <Phone className="w-6 h-6" />
                                            </a>
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 gap-4 mb-10">
                                        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Navigation className="w-5 h-5 text-black" />
                                            </div>
                                            <div className="space-y-1 pt-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</p>
                                                <p className="text-[14px] font-extrabold text-black leading-tight">
                                                    {order.phone || "No specific coordinates provided"}
                                                </p>
                                            </div>
                                        </div>
                                   </div>

                                   <div className="flex items-center justify-between p-6 bg-black rounded-[2rem] mb-10 text-white shadow-2xl shadow-black/10">
                                        <div className="flex gap-2">
                                            {order.items.slice(0, 3).map((item: any, i: number) => (
                                                <div key={i} className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden relative group-hover:scale-105 transition-transform">
                                                    <Image src={JSON.parse(item.product.images)[0]} alt="item" fill className="object-cover" unoptimized />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white tracking-tighter leading-none mb-1">QAR {Number(order.total).toFixed(2)}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{order.items.length} Units Secured</p>
                                        </div>
                                   </div>

                                   <StatusUpdateButton orderId={order.id} currentStatus={order.status} driverId={session.driverId} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Dispatch Feed */}
                <section className="space-y-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.3)]" />
                        <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Confirmed Dispatch Feed</h2>
                    </div>
                    
                    <div className="space-y-6">
                        {availableOrders.length === 0 ? (
                           <p className="text-center py-10 text-[11px] font-bold text-gray-300 uppercase tracking-widest italic">Awaiting new transmissions...</p>
                        ) : (
                            availableOrders.map((order: any, idx: number) => (
                                <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-black/[0.04] hover:border-black transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-right-5" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available Task</span>
                                            </div>
                                            <h3 className="font-black text-xl text-black uppercase tracking-tight italic leading-none">{order.user?.name || "Anonymous"}</h3>
                                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <Package className="w-3 h-3" /> {order.items.length} Items ready
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-black text-black tracking-tighter italic block">QAR {Number(order.total).toFixed(2)}</span>
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1 block">COD SECURED</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 pt-4 border-t border-gray-50">
                                        <div className="flex -space-x-3">
                                            {order.items.slice(0, 4).map((item: any, i: number) => (
                                                 <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-gray-50 shadow-sm overflow-hidden relative">
                                                    <Image src={JSON.parse(item.product.images)[0]} alt="p" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" unoptimized />
                                                </div>
                                            ))}
                                        </div>
                                        <OrderClaimButton orderId={order.id} driverId={session.driverId} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Bottom Accent */}
            <div className="fixed bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10" />
        </div>
    );
}
