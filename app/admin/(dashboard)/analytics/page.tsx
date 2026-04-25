import { CreditCard, DollarSign, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDashboardStats, getMonthlyRevenue } from "@/lib/actions/admin";
import { Overview } from "@/components/admin/Overview";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const [
        statsData,
        monthlyRevenue,
        recentOrders
    ] = await Promise.all([
        getDashboardStats(),
        getMonthlyRevenue(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        })
    ]);

    const revenue = statsData.revenue;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Analytics Overview</h1>
                    <p className="text-[13px] text-[#616161] font-medium mt-1">Track your boutique&apos;s performance and sales.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#F9F9F9] border-b border-[#F1F1F1]">
                        <CardTitle className="text-[12px] font-black uppercase tracking-tight">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-[#616161]" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-2xl font-black text-[#111111]">QAR {revenue.toFixed(2)}</div>
                        <p className="text-[10px] text-[#8A8A8A] font-bold uppercase mt-1 tracking-widest">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#F9F9F9] border-b border-[#F1F1F1]">
                        <CardTitle className="text-[12px] font-black uppercase tracking-tight">Orders</CardTitle>
                        <CreditCard className="h-4 w-4 text-[#616161]" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-2xl font-black text-[#111111]">+{statsData.orders}</div>
                        <p className={`text-[10px] font-bold uppercase mt-1 tracking-widest ${statsData.trends.orders.trend === 'up' ? 'text-[#008060]' : 'text-[#D72C0D]'}`}>
                            {statsData.trends.orders.change} from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#F9F9F9] border-b border-[#F1F1F1]">
                        <CardTitle className="text-[12px] font-black uppercase tracking-tight">Products</CardTitle>
                        <Package className="h-4 w-4 text-[#616161]" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-2xl font-black text-[#111111]">+{statsData.products}</div>
                        <p className="text-[10px] text-[#8A8A8A] font-bold uppercase mt-1 tracking-widest">Active inventory</p>
                    </CardContent>
                </Card>
                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#F9F9F9] border-b border-[#F1F1F1]">
                        <CardTitle className="text-[12px] font-black uppercase tracking-tight">Customers</CardTitle>
                        <Users className="h-4 w-4 text-[#616161]" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-2xl font-black text-[#111111]">+{statsData.users}</div>
                        <p className={`text-[10px] font-bold uppercase mt-1 tracking-widest ${statsData.trends.users.trend === 'up' ? 'text-[#008060]' : 'text-[#D72C0D]'}`}>
                            {statsData.trends.users.change} new this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                        <CardTitle className="text-[16px] font-black uppercase tracking-tight">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentOrders.length === 0 ? (
                            <div className="p-6 text-center text-[13px] text-[#616161] font-medium">No recent orders found.</div>
                        ) : (
                            <div className="divide-y divide-[#F1F1F1]">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-4 px-6 hover:bg-[#F9F9F9] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-[#111] text-white flex items-center justify-center font-bold text-[12px]">
                                                {order.user?.name?.charAt(0) || "G"}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-[#111]">{order.user?.name || "Guest User"}</p>
                                                <p className="text-[11px] text-[#616161] font-medium">{order.user?.email || "No email"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[13px] font-black text-[#111]">QAR {Number(order.total).toFixed(2)}</p>
                                            <p className="text-[10px] text-[#8A8A8A] font-bold uppercase tracking-widest">{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                        <CardTitle className="text-[16px] font-black uppercase tracking-tight">Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Overview data={monthlyRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
