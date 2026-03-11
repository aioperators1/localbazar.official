import { prisma } from "@/lib/prisma";
import { OrderChat } from "@/components/order/OrderChat";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, Calendar, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface AdminOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function AdminOrderDetailsPage(props: AdminOrderDetailsPageProps) {
    const params = await props.params;

    const order = await prisma.order.findUnique({
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
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/orders">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif font-black tracking-widest text-white flex items-center gap-6 uppercase italic">
                        Commande <span className="text-[#592C2F]">#{order.id.slice(-6).toUpperCase()}</span>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Protocole de gestion et correspondance prestige.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="bg-[#111111] border-white/5 shadow-2xl">
                        <CardHeader className="border-b border-white/5 bg-white/5 pb-6">
                            <CardTitle className="text-white font-serif font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                                <Package className="w-4 h-4 text-[#592C2F]" /> Détails des Pièces
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-white/5 rounded-lg bg-black/20">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold uppercase text-xs tracking-wider">{item.product.name}</h4>
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Quantité: {item.quantity}</p>
                                    </div>
                                    <div className="text-white font-serif font-black">
                                        {formatPrice(Number(item.price))}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                                <span className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em]">Valeur Totale</span>
                                <span className="text-3xl font-serif font-black text-white italic">
                                    {formatPrice(Number(order.total))}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Section */}
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-500" /> Customer Chat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderChat orderId={order.id} isAdmin={true} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Info */}
                <div className="space-y-6">
                    <Card className="bg-[#111111] border-white/5 shadow-2xl">
                        <CardHeader className="border-b border-white/5 bg-white/5 pb-6">
                            <CardTitle className="text-white font-serif font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                                <User className="w-4 h-4 text-[#592C2F]" /> Information Propriétaire
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden border border-white/10">
                                    {order.user?.image ? (
                                        <img src={order.user.image} alt={order.user.name || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg leading-none">{order.user?.name || "Guest User"}</h4>
                                    <p className="text-zinc-500 text-sm mt-1">{order.user?.email || "No email provided"}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div>
                                    <h5 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" /> Payment Method
                                    </h5>
                                    <div className="flex items-center gap-2 text-white font-mono text-sm bg-white/5 p-2 rounded">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2">
                                        <Package className="w-3 h-3 text-[#592C2F]" /> Adresse d'Expédition Signature
                                    </h5>
                                    <div className="text-[12px] text-zinc-400 bg-white/5 p-4 rounded-[4px] leading-relaxed border border-white/5">
                                        {order.user?.addresses && order.user.addresses.length > 0 ? (
                                            <>
                                                <p className="font-bold text-white mb-2 uppercase tracking-wider">{order.user.name}</p>
                                                <p>{order.user.addresses[0].street}</p>
                                                <p>{order.user.addresses[0].city}, {order.user.addresses[0].zip}</p>
                                                <p className="text-[#E2D8C5] font-black mt-2 uppercase tracking-[0.2em]">{order.user.addresses[0].country}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-bold text-white mb-2 uppercase tracking-wider">{order.user?.name || "Guest"}</p>
                                                <p className="text-zinc-500 italic">No address provided</p>
                                            </>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <span className="text-[9px] bg-[#592C2F]/20 text-[#E2D8C5] px-3 py-1 rounded-[2px] border border-[#592C2F]/50 uppercase font-black tracking-[0.2em]">Envoi Prioritaire Prestige</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="space-y-8 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[29px] top-8 bottom-8 w-[1px] bg-[#592C2F]/30" />

                            <div className="relative flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-[#592C2F] border border-black z-10 shadow-[0_0_15px_rgba(89,44,47,1)]" />
                                <div>
                                    <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-black">Dernière Actualisation</p>
                                    <p className="text-white text-xs font-mono font-bold mt-1 uppercase">{new Date(order.updatedAt).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-zinc-700 border border-black z-10" />
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Order Placed</p>
                                    <p className="text-white text-xs font-mono">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
