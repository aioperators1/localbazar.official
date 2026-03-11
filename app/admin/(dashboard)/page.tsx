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

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    // Quick Metrics
    const productsCount = await prisma.product.count();
    const customersCount = await prisma.user.count({ where: { role: 'USER' } });
    const ordersCount = await prisma.order.count();

    const stats = [
        {
            title: "Total sales",
            value: "124,500.00 QAR",
            change: "+12.5%",
            trend: "up",
            icon: TrendingUp
        },
        {
            title: "Orders",
            value: ordersCount.toString(),
            change: "+5.2%",
            trend: "up",
            icon: ShoppingBag
        },
        {
            title: "Total customers",
            value: customersCount.toString(),
            change: "-2.1%",
            trend: "down",
            icon: Users
        },
        {
            title: "Active products",
            value: productsCount.toString(),
            change: "0%",
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
                     Last 7 days: <span className="font-bold text-[#303030]">Mar 4 - Mar 11</span>
                   </div>
                   <Button variant="outline" className="h-8 text-[12px] border-[#D2D2D2] bg-white text-[#303030] font-bold rounded-[8px] px-3 shadow-none">
                       Customize
                   </Button>
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
                            <span className="text-2xl font-bold text-[#303030]">QAR 124,500.00</span>
                            <span className="text-[13px] text-[#008060] font-bold flex items-center mb-1">
                                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 12.5%
                            </span>
                        </div>
                        <Overview />
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

                    <Card className="bg-[#482E2E] text-white border-none shadow-sm rounded-[12px] p-6 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase font-bold tracking-widest">
                                Tip of the day
                            </div>
                            <h3 className="text-[16px] font-serif font-black italic">"Quality is not an act, it is a habit." - Aristotle</h3>
                            <p className="text-[13px] text-white/70 leading-relaxed">
                                Keep your inventory refined and exclusive to maintain your brand's prestige.
                            </p>
                            <Button variant="outline" className="h-9 bg-transparent border-white/20 hover:bg-white/10 text-white rounded-[8px] text-[12px] font-bold w-full">
                                Learn more
                            </Button>
                        </div>
                        {/* Abstract Background Decoration */}
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        <div className="absolute -left-8 -top-8 w-24 h-24 bg-[#592C2F]/20 rounded-full blur-2xl" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
