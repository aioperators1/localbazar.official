import { prisma } from "@/lib/prisma";
import { Overview } from "@/components/admin/Overview";
import { 
    ShoppingBag, 
    Users, 
    Package, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    MoreHorizontal,
    ChevronRight,
    CheckCircle2,
    Circle,
    LayoutDashboard,
    Plus,
    Monitor
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { getDashboardStats, getMonthlyRevenue } from "@/lib/actions/admin";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const statsData = await getDashboardStats();
    const monthlyRevenue = await getMonthlyRevenue();

    const stats = [
        {
            title: "Total sales",
            value: `${statsData.revenue.toLocaleString()}.00 QAR`,
            change: statsData.trends?.revenue?.change || "0%",
            trend: statsData.trends?.revenue?.trend || "neutral",
            icon: TrendingUp
        },
        {
            title: "Orders",
            value: statsData.orders.toString(),
            change: statsData.trends?.orders?.change || "0%",
            trend: statsData.trends?.orders?.trend || "neutral",
            icon: ShoppingBag
        },
        {
            title: "Total customers",
            value: statsData.users.toString(),
            change: statsData.trends?.users?.change || "0%",
            trend: statsData.trends?.users?.trend || "neutral",
            icon: Users
        },
        {
            title: "Active products",
            value: statsData.products.toString(),
            change: "Live",
            trend: "neutral",
            icon: Package
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-[#303030] flex items-center gap-2">
                    Home
                </h1>
                <div className="flex items-center gap-2">
                   <div className="text-[12px] text-[#616161] mr-4 hidden md:block">
                     Current Month: <span className="font-bold text-[#303030]">vs Last Month</span>
                   </div>
                   <Link href="/admin/analytics">
                       <Button variant="outline" className="h-8 text-[12px] border-[#D2D2D2] bg-white text-[#303030] font-bold rounded-[8px] px-3 shadow-none">
                           View Analytics
                       </Button>
                   </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-white border-[#E3E3E3] shadow-sm rounded-[12px] transition-all hover:border-[#D2D2D2]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                            <CardTitle className="text-[13px] font-semibold text-[#616161] uppercase tracking-tight">{stat.title}</CardTitle>
                            <stat.icon className="w-4 h-4 text-[#D2D2D2]" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold text-[#303030] tracking-tight">{stat.value}</div>
                            <div className="flex items-center mt-1">
                                <span className={`text-[12px] font-bold flex items-center ${stat.trend === 'up' ? 'text-[#008060]' : stat.trend === 'down' ? 'text-[#D72C0D]' : 'text-[#616161]'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                                    {stat.change}
                                </span>
                                <span className="text-[11px] text-[#616161] ml-1.5 font-medium">vs last period</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph */}
                <Card className="lg:col-span-2 bg-white border-[#E3E3E3] shadow-sm rounded-[12px] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-[#F1F1F1]">
                        <CardTitle className="text-[14px] font-bold text-[#303030]">Sales overview</CardTitle>
                        <div className="flex gap-2">
                             <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#616161]">D</Button>
                             <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#303030] bg-[#F1F1F1]">W</Button>
                             <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#616161]">M</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-2xl font-bold text-[#303030]">QAR {statsData.revenue.toLocaleString()}.00</span>
                            <span className={`text-[13px] font-bold flex items-center mb-1 ${statsData.trends?.revenue?.trend === 'up' ? 'text-[#008060]' : statsData.trends?.revenue?.trend === 'down' ? 'text-[#D72C0D]' : 'text-[#616161]'}`}>
                                {statsData.trends?.revenue?.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : statsData.trends?.revenue?.trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> : null} 
                                {statsData.trends?.revenue?.change || "0%"}
                            </span>
                        </div>
                        <Overview data={monthlyRevenue} />
                    </CardContent>
                </Card>

                {/* Side Content: Quick actions / Tips */}
                <div className="space-y-6">
                    <Card className="bg-white border-[#E3E3E3] shadow-sm rounded-[12px]">
                        <CardHeader className="p-4 border-b border-[#F1F1F1]">
                            <CardTitle className="text-[14px] font-bold text-[#303030]">Quick actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <div className="grid grid-cols-1 gap-1">
                                {[
                                    { label: 'Add product', icon: Plus, href: '/admin/products/new' },
                                    { label: 'View store', icon: Monitor, href: '/' },
                                    { label: 'Edit theme', icon: LayoutDashboard, href: '/admin/banners' },
                                ].map((action) => (
                                    <Link 
                                        key={action.label} 
                                        href={action.href}
                                        className="flex items-center gap-3 p-2.5 rounded-[8px] text-[13px] text-[#303030] font-medium hover:bg-[#F9F9F9] transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-[6px] bg-[#F1F1F1] flex items-center justify-center">
                                            <action.icon className="w-4 h-4 text-[#616161]" />
                                        </div>
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-[#E3E3E3] shadow-sm rounded-[12px]">
                        <CardHeader className="p-4 border-b border-[#F1F1F1] flex flex-row items-center justify-between">
                            <CardTitle className="text-[14px] font-bold text-[#303030]">Recent orders</CardTitle>
                            <Link href="/admin/orders" className="text-[11px] font-bold text-[#616161] hover:text-[#303030]">View all</Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            {statsData.recentOrders && statsData.recentOrders.length > 0 ? (
                                <div className="divide-y divide-[#F1F1F1]">
                                    {statsData.recentOrders.map(order => (
                                        <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition-colors">
                                            <div className="flex flex-col">
                                                <Link href={`/admin/orders/${order.id}`} className="text-[13px] font-bold text-[#303030] hover:underline">
                                                    {(order as any).user?.name || "Guest Customer"}
                                                </Link>
                                                <span className="text-[11px] text-[#616161] mt-0.5">{(order as any).user?.email || "No email"}</span>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-[13px] font-bold text-[#303030]">QAR {Number(order.total).toFixed(2)}</span>
                                                <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider mt-0.5">{order.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-[#616161] text-[12px]">
                                    No recent orders yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
