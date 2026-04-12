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
import { Overview } from "@/components/admin/Overview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      title: "Total Revenue",
      value: `QAR ${statsData.revenue.toLocaleString()}.00`,
      change: statsData.trends?.revenue?.change || "0%",
      trend: statsData.trends?.revenue?.trend || "neutral",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      sparkline: [30, 45, 40, 60, 50, 75, 70]
    },
    {
      title: "Order Volume",
      value: statsData.orders.toString(),
      change: statsData.trends?.orders?.change || "0%",
      trend: statsData.trends?.orders?.trend || "neutral",
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      sparkline: [20, 30, 45, 40, 55, 60, 65]
    },
    {
      title: "Inventory Asset",
      value: statsData.products.toString(),
      change: "Active",
      trend: "neutral",
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      sparkline: [50, 50, 50, 50, 50, 50, 50]
    }
  ];

  const shortcuts = [
    { label: "New Product", icon: Plus, href: "/admin/products/new", color: "from-amber-500/20 to-transparent" },
    { label: "Audit Logs", icon: Activity, href: "/admin/orders", color: "from-blue-500/20 to-transparent" },
    { label: "Staff Matrix", icon: Users, href: "/admin/team", color: "from-emerald-500/20 to-transparent" },
    { label: "Core Params", icon: LayoutDashboard, href: "/admin/settings", color: "from-purple-500/20 to-transparent" }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 🌌 ULTRA PRO DYNAMIC HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="relative h-[480px] md:h-[540px] rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#050505] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group"
      >
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[0%] w-[70%] h-[70%] bg-white/5 blur-[120px] rounded-full opacity-50" />
          <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full opacity-30" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent noisy-bg" />

        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 z-10 pt-16 md:pt-0">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-10 md:translate-y-[-20px]">
            <div className="flex items-center gap-3 bg-white/[0.03] py-2 px-5 rounded-xl border border-white/5 backdrop-blur-3xl shadow-2xl">
              <Shield className="w-3.5 h-3.5 text-emerald-400 opacity-70" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">L3 Protocol Secured</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] py-2 px-5 rounded-xl border border-white/5 backdrop-blur-3xl shadow-2xl">
              <Clock className="w-3.5 h-3.5 text-blue-400 opacity-70" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Synchronization Act</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-[-0.06em] uppercase leading-[0.9] md:leading-[0.85] mb-6 md:mb-8">
              Management <br />
              <span className="text-white/10 italic">Operations</span> Center
            </h1>
          </motion.div>

          <p className="max-w-2xl text-[14px] md:text-[17px] font-bold text-white/80 leading-relaxed mb-8 md:mb-12 tracking-tight">
            Institutional intelligence bridge active. Unified control interface synchronized for <span className="text-white">Local Bazar Infrastructure Assets</span> and real-time matrix monitoring.
          </p>
        </div>

        {/* Floating System Vitality Indicator - Hidden on extra small, repositioned on small */}
        <div className="absolute top-8 md:top-16 right-8 md:right-16 flex flex-col items-end gap-6 z-10 hidden sm:flex">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="glass-pro rounded-[24px] md:rounded-[32px] p-6 md:p-8 border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center gap-3 md:gap-4 group/vitality hover:bg-white/[0.02] backdrop-blur-3xl"
          >
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-[18px] md:rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center relative overflow-hidden transition-all duration-700 group-hover/vitality:border-amber-500/20">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500/20 opacity-0 group-hover/vitality:opacity-100 animate-pulse" />
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-amber-500 group-hover/vitality:scale-110 transition-transform duration-700" />
             </div>
             <div className="text-center">
                <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.6em] mb-1 block">Activity</span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap">Nominal</span>
             </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 🔮 ULTRA PRO RADIANT STATS GRID - Responsive 1 to 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 + 0.6, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
             whileHover={{ y: -12, scale: 1.02 }}
            className="group relative h-full"
          >
            {/* Background Glow Effect */}
            <div className={cn(
              "absolute -inset-1 rounded-[44px] blur-2xl opacity-0 group-hover:opacity-20 transition duration-1000",
              stat.color.replace('text-', 'bg-')
            )} />
            
            <div className="relative glass-card rounded-[42px] p-10 border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-white/[0.03] backdrop-blur-3xl overflow-hidden h-full flex flex-col group-hover:bg-white/[0.05] transition-all duration-700">
              {/* Internal Mesh Aura */}
              <div className={cn(
                "absolute top-[-40%] right-[-20%] w-40 h-40 blur-[80px] opacity-10 rounded-full",
                stat.color.replace('text-', 'bg-')
              )} />
              
              <div className="flex items-start justify-between mb-12 relative z-10">
                <div className="relative">
                  <div className={cn("absolute -inset-3 blur-xl opacity-20 group-hover:opacity-40 transition-opacity", stat.color.replace('text-', 'bg-'))} />
                  <div className={cn("relative w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12", stat.bg)}>
                    <stat.icon className={cn("w-8 h-8", stat.color)} />
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] bg-white/10 border border-white/10 uppercase",
                  stat.trend === 'up' ? "text-emerald-400" : stat.trend === 'down' ? "text-rose-400" : "text-white/50"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </div>
              </div>

              <div className="mb-10 relative z-10">
                <span className="text-[10px] font-black text-white/40 tracking-[0.5em] uppercase mb-5 block leading-none">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-white tracking-[-0.05em] leading-none group-hover:translate-x-1 transition-transform duration-500">
                    {stat.value}
                  </span>
                </div>
              </div>

              {/* Advanced Animated Matrix Sparkline */}
              <div className="mt-auto pt-4 flex items-end gap-2 h-16 relative z-10">
                {stat.sparkline.map((h, j) => (
                  <motion.div 
                    key={j}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.1 + j * 0.08,
                      ease: "circOut"
                    }}
                    className={cn(
                      "flex-1 rounded-full transition-all duration-700 opacity-20 group-hover:opacity-60",
                      stat.color.replace('text-', 'bg-')
                    )} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="lg:col-span-2 glass-card rounded-[48px] p-12 border-white/10 shadow-3xl bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group/overview"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover/overview:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-white text-[#050505] flex items-center justify-center shadow-2xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap italic leading-none mb-1">Revenue Vector</h3>
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Integrated Intelligence Analytics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black text-white tracking-widest uppercase">System Flux</div>
            </div>
          </div>
          <Overview data={monthlyRevenue} />
        </motion.div>

        <div className="space-y-12 h-full">
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="glass-card rounded-[48px] p-12 border-white/10 shadow-3xl flex flex-col relative overflow-hidden h-full bg-white/[0.02] backdrop-blur-3xl group/directives"
          >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/directives:opacity-100 transition-opacity duration-1000" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-center gap-6 mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                      <Zap className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tighter uppercase">Directives</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                  {shortcuts.map((item, i) => (
                      <Link 
                          key={i} 
                          href={item.href}
                          className="group/shortcut flex flex-col items-center justify-center p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-white transition-all duration-700 shadow-xl overflow-hidden relative"
                      >
                          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover/shortcut:opacity-10 transition-opacity", item.color)} />
                          <item.icon className="w-8 h-8 mb-4 group-hover/shortcut:scale-125 transition-transform duration-700 relative z-10 text-white group-hover/shortcut:text-[#050505]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center relative z-10 text-white group-hover/shortcut:text-[#050505]">{item.label}</span>
                      </Link>
                  ))}
              </div>

              <div className="mt-12 p-8 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all duration-700 shadow-inner">
                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                          <span className="text-[11px] font-black text-white uppercase tracking-widest block">Core Integrity</span>
                          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Quantum Seal Active</span>
                      </div>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
              </div>
          </motion.div>
        </div>
      </div>

      {/* 📋 RECENT OPERATIONAL MANIFEST */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.2 }}
        className="glass-card rounded-[32px] md:rounded-[48px] border-white/10 shadow-4xl bg-white/[0.02] overflow-hidden backdrop-blur-3xl relative group/recent"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-transparent pointer-events-none" />
        <div className="p-8 md:p-12 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-inner group-hover/recent:border-white/20 transition-all">
              <Clock className="w-7 h-7 md:w-8 md:h-8 group-hover/recent:scale-110 transition-transform duration-700" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap italic leading-none mb-1">Recent Operations</h3>
              <p className="text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Latest System Transactions</p>
            </div>
          </div>
          <Link href="/admin/orders" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto rounded-xl md:rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:bg-white hover:text-black transition-all duration-700 uppercase text-[9px] md:text-[10px] font-black tracking-widest px-8 md:px-10 h-12 md:h-14 shadow-2xl">
              View All Manifests <ArrowRight className="ml-3 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Responsive Display: Table on MD+, Cards on mobile */}
        <div className="relative z-10">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-10 text-left text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Transaction_ID</th>
                  <th className="px-8 py-10 text-left text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">External_Entity</th>
                  <th className="px-8 py-10 text-left text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Temporal_Stamp</th>
                  <th className="px-8 py-10 text-left text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Fiscal_Value</th>
                  <th className="px-8 py-10 text-left text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Operational_Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {statsData.recentOrders?.map((order, i) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + (i * 0.1) }}
                    className="group hover:bg-white/5 transition-all duration-500"
                  >
                    <td className="px-8 py-12">
                      <span className="text-white font-black uppercase text-[15px] italic transition-all duration-700 tracking-tighter group-hover:text-blue-400 group-hover:ml-2 opacity-80 group-hover:opacity-100 block whitespace-nowrap">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-12">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 group-hover:border-white/30 transition-all font-black text-[11px] uppercase shadow-2xl overflow-hidden relative">
                           <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="relative z-10">{order.user?.name?.charAt(0) || "U"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black uppercase text-[15px] tracking-tight whitespace-nowrap leading-none mb-1.5">{order.user?.name || "Anonymous Entity"}</span>
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{order.user?.email || "NOT_STORED"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-12">
                      <span className="text-white font-black uppercase text-[11px] tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td className="px-8 py-12">
                      <span className="text-white font-black text-[22px] tracking-tighter italic group-hover:scale-110 group-hover:text-amber-400 transition-all inline-block whitespace-nowrap">QAR {order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-12">
                      <div className={cn(
                        "inline-flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase border transition-all duration-700",
                        order.status === 'DELIVERED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-white shadow-[0_0_20px_rgba(16,185,129,0.1)]" :
                        order.status === 'CANCELLED' ? "bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-black group-hover:border-white" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:bg-amber-500 group-hover:text-black group-hover:border-white"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          order.status === 'DELIVERED' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:bg-black" :
                          order.status === 'CANCELLED' ? "bg-rose-500 group-hover:bg-black" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:bg-black"
                        )} />
                        {order.status}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-white/5">
            {statsData.recentOrders?.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-black uppercase text-[14px] italic opacity-80 decoration-white/20 underline underline-offset-4">#{order.id.slice(-8).toUpperCase()}</span>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[8px] font-black tracking-[0.2em] uppercase border",
                    order.status === 'DELIVERED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    order.status === 'CANCELLED' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-black">
                    {order.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black uppercase text-[15px] tracking-tight">{order.user?.name || "Anonymous Entity"}</span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-white font-black text-[24px] tracking-tighter italic">QAR {order.total.toLocaleString()}</span>
                  <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="bg-white/5 text-white/50 border border-white/10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest">Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {(!statsData.recentOrders || statsData.recentOrders.length === 0) && (
            <div className="px-12 py-32 text-center">
              <div className="flex flex-col items-center gap-6 opacity-10">
                <Zap className="w-16 h-16" />
                <span className="text-[11px] font-black text-white uppercase tracking-[1em]">Scanning for System Flux_</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Premium Infrastructure Branding */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-6 border-t border-white/5 group/agency">
          <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em] group-hover/agency:text-white/30 transition-colors">
              Systems Architected by
          </span>
          <div className="flex items-center gap-4 opacity-20 grayscale group-hover/agency:opacity-100 group-hover/agency:grayscale-0 transition-all duration-1000">
              <span className="text-[14px] font-black text-white tracking-[-0.05em] uppercase">
                  AI Operators <span className="text-white/30">Group Elite</span>
              </span>
          </div>
      </div>
    </div>
  );
}
