"use client";

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
    CheckCircle2
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
    recentOrders?: any[];
    trends?: any;
  };
  monthlyRevenue: any;
}

export default function DashboardClient({ statsData, monthlyRevenue }: DashboardClientProps) {
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
