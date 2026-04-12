import { prisma } from "@/lib/prisma";
import { OrderChat } from "@/components/order/OrderChat";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, Calendar, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getAdminSettings } from "@/lib/actions/admin";
import { InvoiceButton } from "@/components/admin/InvoiceButton";
import Image from "next/image";

interface AdminOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function AdminOrderDetailsPage(props: AdminOrderDetailsPageProps) {
    const params = await props.params;

    const [order, settings] = await Promise.all([
        prisma.order.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    include: {
                        addresses: {
                            take: 1,
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                },
                items: {
                    include: { product: true }
                }
            }
        }),
        getAdminSettings()
    ]);

    if (!order) {
        notFound();
    }

    // Serialize order for Client Components (Fixes Decimal/Date hydration error)
    const serializedOrder = {
        ...order,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        user: order.user ? {
            ...order.user,
            createdAt: order.user.createdAt.toISOString(),
            updatedAt: order.user.updatedAt.toISOString(),
            emailVerified: order.user.emailVerified?.toISOString() || null,
            addresses: order.user.addresses.map((addr: any) => ({
                ...addr,
                createdAt: addr.createdAt.toISOString()
            }))
        } : null,
        items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
                ...item.product,
                price: Number(item.product.price),
                salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                createdAt: item.product.createdAt.toISOString(),
                updatedAt: item.product.updatedAt.toISOString(),
            }
        }))
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
            {/* LUXURY HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 shadow-2xl hover:bg-white hover:text-black transition-all duration-500 group">
                        <Link href="/admin/orders">
                            <ChevronLeft className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                        </Link>
                    </Button>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <h1 className="text-5xl font-black text-white leading-none tracking-tighter uppercase italic">
                                Order <span className="text-black bg-white px-3 py-1 rounded-xl ml-2 not-italic text-4xl leading-none">#{serializedOrder.id.slice(-6).toUpperCase()}</span>
                            </h1>
                            <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mt-4 ml-1">
                                Management Protocol • ID: {serializedOrder.id.toUpperCase()}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <OrderStatusSelect orderId={serializedOrder.id} currentStatus={serializedOrder.status} />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 glass-card p-2 rounded-2xl border-white/5 bg-white/[0.02]">
                    <InvoiceButton order={serializedOrder} settings={settings} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Items Section */}
                    <Card className="bg-white/[0.01] border-white/5 shadow-3xl rounded-[40px] overflow-hidden backdrop-blur-3xl">
                        <CardHeader className="border-b border-white/5 bg-white/[0.02] py-8 px-10">
                            <CardTitle className="text-white font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-4 opacity-50">
                                <Package className="w-5 h-5 text-white" /> Composition Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {serializedOrder.items.map((item: any) => {
                                    const productImage = (() => {
                                        try {
                                            const images = JSON.parse(item.product.images);
                                            return Array.isArray(images) ? images[0] : images;
                                        } catch {
                                            return item.product.images;
                                        }
                                    })();

                                    return (
                                        <div key={item.id} className="flex items-center gap-8 p-10 hover:bg-white/[0.02] transition-all duration-500 group">
                                            <div className="relative w-24 h-28 bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
                                                {productImage ? (
                                                    <Image 
                                                        src={productImage} 
                                                        alt={item.product.name} 
                                                        fill 
                                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-white/10">
                                                        <Package className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <h4 className="text-white font-black uppercase text-[16px] tracking-tight group-hover:text-blue-400 transition-colors italic leading-none">{item.product.name}</h4>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">QNT: {item.quantity}</span>
                                                    {item.size && <span className="text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">SZ: {item.size}</span>}
                                                </div>
                                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">SKU_SERIAL: {item.product.sku || 'UNREGISTERED'}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-black text-2xl italic tracking-tighter">
                                                    {formatPrice(item.price)}
                                                </div>
                                                <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1 block">Unit_Price</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Summary Footer */}
                            <div className="bg-white/[0.02] p-12 border-t border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="space-y-3">
                                        <span className="text-white/30 uppercase text-[10px] font-black tracking-[0.5em] block">Aggregate Value Matrix</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <p className="text-[12px] text-emerald-400 font-black uppercase tracking-widest italic">VAT Integrated / Global Logistical Protocol</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-6xl font-black text-white italic tracking-tighter leading-none">
                                            {formatPrice(serializedOrder.total)}
                                        </span>
                                        <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] block mt-4">Verified_Fulfillment_Total</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Section */}
                    <Card className="bg-white/[0.01] border-white/5 shadow-3xl rounded-[40px] overflow-hidden backdrop-blur-3xl">
                        <CardHeader className="border-b border-white/5 bg-white/[0.02] py-8 px-10">
                            <CardTitle className="text-white font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-4 opacity-50">
                                <User className="w-5 h-5 text-white" /> VIP Correspondence Console
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <OrderChat orderId={serializedOrder.id} isAdmin={true} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Info */}
                <div className="space-y-10">
                    {/* Customer Info */}
                    <Card className="bg-white/[0.01] border-white/5 shadow-3xl rounded-[40px] overflow-hidden backdrop-blur-3xl">
                        <CardHeader className="border-b border-white/5 bg-white/[0.02] py-8 px-10">
                            <CardTitle className="text-white font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-4 opacity-50">
                                <User className="w-5 h-5 text-white" /> Owner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-12">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center text-white/20 overflow-hidden border border-white/10 shadow-inner group">
                                    {serializedOrder.user?.image ? (
                                        <img src={serializedOrder.user.image} alt={serializedOrder.user.name || "User"} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <User className="w-10 h-10" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-black tracking-tighter text-2xl leading-none italic uppercase">{serializedOrder.user?.name || "Anonymous Entity"}</h4>
                                    <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.1em]">{serializedOrder.user?.email || "NOT_REGISTERED"}</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h5 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2">
                                        <CreditCard className="w-3 h-3 text-white" /> Signature Payment Method
                                    </h5>
                                    <div className="flex items-center gap-4 text-white font-black text-[13px] bg-white/[0.03] p-6 rounded-[24px] border border-white/5 uppercase tracking-widest italic shadow-inner">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        {serializedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : serializedOrder.paymentMethod}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2">
                                        <Package className="w-3 h-3 text-white" /> Shipping & Logistics
                                    </h5>
                                    <div className="text-[14px] text-white bg-white/[0.03] p-10 rounded-[32px] leading-relaxed border border-white/5 relative overflow-hidden shadow-inner">
                                        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.02] translate-x-12 -translate-y-12">
                                            <Package className="w-full h-full" />
                                        </div>
                                        {serializedOrder.user?.addresses && serializedOrder.user.addresses.length > 0 ? (
                                            <div className="space-y-2 relative z-10">
                                                <p className="font-black text-[18px] mb-6 uppercase tracking-wider italic text-white flex items-center gap-3">
                                                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                                    {serializedOrder.user.name}
                                                </p>
                                                <p className="font-bold text-white opacity-60 tracking-tight uppercase italic">{serializedOrder.user.addresses[0].street}</p>
                                                <p className="font-bold text-white opacity-60 tracking-tight uppercase italic">{serializedOrder.user.addresses[0].city}, {serializedOrder.user.addresses[0].zip}</p>
                                                <div className="pt-6">
                                                    <span className="text-white font-black uppercase tracking-[0.4em] text-[12px] bg-white/10 px-6 py-2 rounded-xl border border-white/10 block text-center italic">
                                                        {serializedOrder.user.addresses[0].country}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative z-10 py-10 text-center opacity-30">
                                                <Package className="w-12 h-12 mx-auto mb-4" />
                                                <p className="text-[11px] font-black uppercase tracking-widest">No address found</p>
                                            </div>
                                        )}

                                        <div className="mt-10 flex flex-col gap-3 relative z-10">
                                            <div className="flex items-center gap-3 text-[10px] bg-white text-black px-6 py-3 rounded-xl uppercase font-black tracking-[0.3em] shadow-2xl justify-center italic">
                                                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                                Exceptional Courier
                                            </div>
                                            <span className="text-[9px] text-white/20 uppercase font-black tracking-[0.2em] text-center">Delegation Doha City Central</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="bg-white/[0.01] border-white/5 shadow-3xl rounded-[40px] overflow-hidden backdrop-blur-3xl">
                        <CardContent className="p-12 space-y-10 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[59px] top-16 bottom-16 w-[1px] bg-white/5" />

                            <div className="relative flex items-center gap-8 group">
                                <div className="w-8 h-8 rounded-full bg-white border-[6px] border-[#0a0a0a] z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all group-hover:scale-125 group-hover:rotate-[360deg] duration-1000 flex items-center justify-center">
                                     <div className="w-1 h-1 rounded-full bg-black" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Final Update Registry</p>
                                    <p className="text-white text-[14px] font-black uppercase italic tracking-tighter leading-none">{new Date(serializedOrder.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-8 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 border-[6px] border-[#0a0a0a] z-10 shadow-sm transition-all group-hover:scale-125 duration-1000" />
                                <div className="space-y-1">
                                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Order Initialization Protocol</p>
                                    <p className="text-white/40 text-[13px] font-black uppercase tracking-widest leading-none italic">{new Date(serializedOrder.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
