import { getDashboardStats, getMonthlyRevenue } from "@/lib/actions/admin";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/admin/Overview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();
    const revenueData = await getMonthlyRevenue();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Overview of your store&apos;s performance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(Number(stats.revenue))}</div>
                        <p className="text-xs text-zinc-500 mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.orders}</div>
                        <p className="text-xs text-zinc-500 mt-1">{stats.orders > 0 ? '+5 new today' : 'No orders today'}</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Products</CardTitle>
                        <Package className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.products}</div>
                        <p className="text-xs text-zinc-500 mt-1">Active inventory</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.users || 0}</div>
                        <p className="text-xs text-zinc-500 mt-1">Total registered users</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-zinc-900/60 border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            Recent Revenue
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded ml-2">Real Time</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={revenueData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-zinc-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Sales</CardTitle>
                        <p className="text-sm text-zinc-500">
                            You made {stats.orders} sales this month.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No recent sales.</p>
                            ) : (
                                stats.recentOrders.map((order: any) => (
                                    <div className="flex items-center" key={order.id}>
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                            <AvatarFallback className="bg-zinc-800 text-xs text-white">
                                                {order.user?.name?.charAt(0) || 'G'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-zinc-200">{order.user?.name || 'Guest User'}</p>
                                            <p className="text-sm text-zinc-500">{order.user?.email || 'guest@electroislam.com'}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-emerald-500">
                                            +{new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(Number(order.total))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
