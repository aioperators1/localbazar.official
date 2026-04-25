import { prisma } from "@/lib/prisma";
import { OrderChat } from "@/components/order/OrderChat";

export const dynamic = 'force-dynamic';
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
    const o = order as any;
    const serializedOrder = {
        ...o,
        total: Number(o.total),
        phone: o.phone || null,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        user: o.user ? {
            ...o.user,
            phone: o.user.phone || null,
            createdAt: o.user.createdAt.toISOString(),
            updatedAt: o.user.updatedAt.toISOString(),
            emailVerified: o.user.emailVerified?.toISOString() || null,
            addresses: (o.user.addresses || []).map((addr: any) => ({
                ...addr,
                createdAt: addr.createdAt.toISOString()
            }))
        } : null,
        items: o.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
                ...item.product,
                price: Number(item.product.price),
                salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                images: item.product.images,
                createdAt: item.product.createdAt.toISOString(),
                updatedAt: item.product.updatedAt.toISOString(),
            }
        }))
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto overflow-hidden">
            {/* CLEAN HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-6">
                    <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-xl bg-white shadow-sm hover:bg-slate-50 border-slate-200 transition-all">
                        <Link href="/admin/orders">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span>Order</span>
                            <span className="text-slate-400 font-medium">#{serializedOrder.id.slice(-6).toUpperCase()}</span>
                        </h1>
                        <div className="flex items-center gap-4 text-[13px] font-medium text-slate-500">
                             <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(serializedOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                             </div>
                             <span className="w-1 h-1 rounded-full bg-slate-300" />
                             <OrderStatusSelect orderId={serializedOrder.id} currentStatus={serializedOrder.status} />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <InvoiceButton order={serializedOrder} settings={settings} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Items & Chat */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Items Section */}
                    <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden border-0 ring-1 ring-slate-200">
                        <CardHeader className="bg-slate-50/50 py-5 px-8 border-b border-slate-200">
                            <CardTitle className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-3">
                                <Package className="w-4 h-4 text-slate-400" /> Order Items ({serializedOrder.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
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
                                        <div key={item.id} className="flex items-center gap-6 p-8 hover:bg-slate-50/30 transition-all">
                                            <div className="relative w-20 h-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                                {productImage ? (
                                                    <Image 
                                                        src={productImage} 
                                                        alt={item.product.name} 
                                                        fill 
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-300">
                                                        <Package className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-slate-900 font-bold text-lg leading-tight truncate mb-2">{item.product.name}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                                                    {item.size && <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg">Size: {item.size}</span>}
                                                    {item.product.sku && <span className="text-slate-400 text-[11px] font-medium tracking-tight mt-1 ml-1">SKU: {item.product.sku}</span>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-slate-900 font-black text-xl tracking-tight">
                                                    {formatPrice(item.price)}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">Price</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Summary Footer */}
                            <div className="bg-slate-50/30 p-10 border-t border-slate-200">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <span className="text-slate-400 uppercase text-[11px] font-black tracking-widest block">Total Amount</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <p className="text-[12px] text-slate-600 font-bold uppercase tracking-tight">Included all taxes and fees</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                            {formatPrice(serializedOrder.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Manifest - Focused Black & White Design */}
                    <Card className="bg-black text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white/5 py-6 px-10 border-b border-white/10">
                            <CardTitle className="text-white font-black text-xs uppercase tracking-[4px] flex items-center gap-4">
                                <User className="w-4 h-4 text-white" /> Client Manifest
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {/* Personnel Section */}
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Full Name</p>
                                        <p className="text-white text-lg font-black tracking-tight">{serializedOrder.user?.name || "GUEST ACCOUNT"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Digital Contact</p>
                                        <p className="text-white text-[13px] font-bold">{serializedOrder.user?.email || "NOT_AVAILABLE"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Secure Line</p>
                                        <p className="text-emerald-400 text-[15px] font-black tracking-widest">{serializedOrder.phone || serializedOrder.user?.phone || "NO_PHONE"}</p>
                                    </div>
                                </div>

                                {/* Logistics Section */}
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Street Address</p>
                                        <p className="text-white text-[13px] font-bold leading-relaxed">{serializedOrder.user?.addresses?.[0]?.street || "ADDRESS_PENDING"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">City / Region</p>
                                            <p className="text-white text-[13px] font-bold uppercase">{serializedOrder.user?.addresses?.[0]?.city || "QATAR"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Postal Code</p>
                                            <p className="text-white text-[13px] font-bold">{serializedOrder.user?.addresses?.[0]?.zip || "00000"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Shipping Protocol</p>
                                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                                                <Package className="w-3 h-3 text-white" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{serializedOrder.shippingMethod || "STANDARD"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Financial Settlement</p>
                                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                                                <CreditCard className="w-3 h-3 text-white" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{serializedOrder.paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : serializedOrder.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Timeline Only */}
                <div className="space-y-8">
                    <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden border-0 ring-1 ring-slate-200">
                        <CardHeader className="bg-slate-50/50 py-5 px-8 border-b border-slate-200">
                            <CardTitle className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-slate-400" /> Order Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[47px] top-10 bottom-10 w-[2px] bg-slate-100" />

                            <div className="relative flex items-center gap-6 group">
                                <div className="w-8 h-8 rounded-full bg-slate-900 border-[4px] border-white z-10 shadow-lg flex items-center justify-center">
                                     <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Latest Activity</p>
                                    <p className="text-slate-900 text-[14px] font-bold tracking-tight">{new Date(serializedOrder.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-6 group opacity-50">
                                <div className="w-8 h-8 rounded-full bg-slate-200 border-[4px] border-white z-10 shadow-sm transition-all" />
                                <div className="space-y-0.5">
                                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Created</p>
                                    <p className="text-slate-600 text-[13px] font-bold tracking-tight">{new Date(serializedOrder.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
