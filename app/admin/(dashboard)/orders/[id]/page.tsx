import { prisma } from "@/lib/prisma";
import { OrderChat } from "@/components/order/OrderChat";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, Calendar, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Order #{order.id.slice(-6).toUpperCase()}
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </h1>
                    <p className="text-zinc-400">View details and communicate with customer.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Package className="w-4 h-4 text-zinc-500" /> Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-white/5 rounded-lg bg-black/20">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">{item.product.name}</h4>
                                        <p className="text-zinc-500 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-white font-medium">
                                        {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(Number(item.price))}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                                <span className="text-zinc-400">Total</span>
                                <span className="text-2xl font-bold text-white">
                                    {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(Number(order.total))}
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
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-500" /> Customer Profile
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
                                    <h5 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                        <Package className="w-3 h-3" /> Shipping Address
                                    </h5>
                                    <div className="text-sm text-zinc-300 bg-white/5 p-3 rounded leading-relaxed border border-white/5">
                                        {order.user?.addresses && order.user.addresses.length > 0 ? (
                                            <>
                                                <p className="font-bold text-white mb-1">{order.user.name}</p>
                                                <p>{order.user.addresses[0].street}</p>
                                                <p>{order.user.addresses[0].city}, {order.user.addresses[0].zip}</p>
                                                <p className="text-zinc-500 mt-1">{order.user.addresses[0].country}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-bold text-white mb-1">{order.user?.name || "Guest"}</p>
                                                <p className="text-zinc-500 italic">No address provided</p>
                                            </>
                                        )}

                                        <div className="mt-3 flex gap-2">
                                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">Standard Shipping</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-500" /> Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[29px] top-6 bottom-6 w-[1px] bg-indigo-500/20" />

                            <div className="relative flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-indigo-500 border border-black z-10 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Latest Update</p>
                                    <p className="text-white text-xs font-mono">{new Date(order.updatedAt).toLocaleString()}</p>
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
