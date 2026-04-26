"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    TrendingUp, 
    ShoppingBag, 
    Users, 
    Plus, 
    ArrowRight,
    Package,
    Settings,
    LayoutDashboard,
    Zap,
    Shield,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CheckCircle2,
    Eye,
    Radio
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";

// DYNAMICALLY LOAD HEAVY CHART COMPONENT TO REDUCE INITIAL JS BUNDLE AND IMPROVE LCP/TTI
const Overview = dynamic(
  () => import("@/components/admin/Overview").then((mod) => mod.Overview),
  { ssr: false, loading: () => <div className="h-[350px] md:h-[400px] w-full bg-gray-50 animate-pulse rounded-xl" /> }
);

interface DashboardClientProps {
  statsData: {
    revenue: number;
    orders: number;
    users: number;
    products: number;
    views: {
        total: number;
        today: number;
        last7Days: number;
        thisMonth: number;
        active: number;
    };
    recentOrders?: any[];
    trends?: any;
  };
  monthlyRevenue: any;
}

export default function DashboardClient({ statsData, monthlyRevenue }: DashboardClientProps) {
  const [viewsFilter, setViewsFilter] = useState<'today' | '7d' | 'month' | 'total'>('today');

  const getFilteredViews = () => {
      switch(viewsFilter) {
          case 'today': return statsData.views.today;
          case '7d': return statsData.views.last7Days;
          case 'month': return statsData.views.thisMonth;
          case 'total': return statsData.views.total;
          default: return statsData.views.today;
      }
  };

  const stats = [
    {
      title: "Gross Revenue",
      value: `QAR ${statsData.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-black",
      bg: "bg-gray-100",
    },
    {
      title: "Order Flow",
      value: statsData.orders.toString(),
      icon: ShoppingBag,
      color: "text-black",
      bg: "bg-gray-100",
    },
    {
      title: "Catalog",
      value: statsData.products.toString(),
      icon: Package,
      color: "text-black",
      bg: "bg-gray-100",
    },
    {
        title: "Client Base",
        value: statsData.users.toString(),
        icon: Users,
        color: "text-black",
        bg: "bg-gray-100",
      }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard Overview</h1>
        <p className="text-[13px] text-gray-500">Welcome back. Here is what is happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <stat.icon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-black tracking-tighter">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#111] text-white border-none shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <Radio className="w-32 h-32 text-emerald-400" />
             </div>
             <CardContent className="p-6 relative z-10 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between space-y-0 pb-4">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Active Right Now</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-black tracking-tighter">{statsData.views.active}</div>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-white/50">Online Visitors</span>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-sm">
             <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between space-y-0 pb-6">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Store Traffic</span>
                  <div className="flex bg-gray-50 p-1 rounded-md border border-gray-100">
                      {(['today', '7d', 'month', 'total'] as const).map(f => (
                          <button 
                            key={f}
                            onClick={() => setViewsFilter(f)}
                            className={cn(
                                "px-3 py-1.5 text-[10px] font-bold uppercase rounded-sm transition-all duration-200",
                                viewsFilter === f ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                              {f}
                          </button>
                      ))}
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-black text-black tracking-tighter">{getFilteredViews().toLocaleString()}</div>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-gray-400">Total Views</span>
                </div>
             </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <Overview data={monthlyRevenue} />
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[14px] font-bold uppercase tracking-wider">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {statsData.recentOrders?.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                                {order.user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-black truncate">{order.user?.name || "Customer"}</p>
                                <p className="text-[11px] text-gray-400 truncate">{order.user?.email}</p>
                            </div>
                            <div className="text-[13px] font-bold text-black">
                                +{order.total} QAR
                            </div>
                        </div>
                    ))}
                    {(!statsData.recentOrders || statsData.recentOrders.length === 0) && (
                        <p className="text-center py-4 text-xs text-gray-400">No recent transactions</p>
                    )}
                </div>
                <Link href="/admin/orders">
                    <Button variant="outline" className="w-full mt-6 h-10 text-[11px] font-bold uppercase tracking-wider border-gray-200">
                        View All Orders
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
              { label: "Add Product", href: "/admin/products/new", icon: Plus },
              { label: "System Store", href: "/admin/store", icon: ShoppingBag },
              { label: "Configure Site", href: "/admin/settings", icon: Settings },
              { label: "Team Management", href: "/admin/team", icon: Shield }
          ].map((item) => (
              <Link key={item.label} href={item.href}>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-black transition-all flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                          <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[12px] font-bold text-gray-700">{item.label}</span>
                  </div>
              </Link>
          ))}
      </div>
    </div>
  );
}
