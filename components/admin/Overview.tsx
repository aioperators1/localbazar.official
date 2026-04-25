"use client";

import { useEffect, useState, useTransition } from "react";
import { 
    Area, 
    AreaChart, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis, 
    CartesianGrid 
} from "recharts";
import { getRevenueAnalysis } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";
import { Loader2, TrendingUp, Calendar, ArrowUpRight, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OverviewProps {
    data?: { name: string; total: number }[];
}

const ranges = [
    { label: "Today", value: "today" },
    { label: "3D", value: "last_3_days" },
    { label: "7D", value: "last_7_days" },
    { label: "30D", value: "last_30_days" },
    { label: "3M", value: "last_3_months" },
    { label: "Year", value: "year" },
    { label: "Custom", value: "custom" },
];

const AVAILABLE_YEARS = [2024, 2025, 2026];

export function Overview({ data: initialData }: OverviewProps) {
    const [data, setData] = useState(initialData || []);
    const [range, setRange] = useState("year");
    const [selectedYear, setSelectedYear] = useState(2026);
    const [isPending, startTransition] = useTransition();
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (!initialData || range !== "year") {
            handleRangeChange(range, undefined, undefined, selectedYear);
        }
    }, []);

    const handleRangeChange = async (newRange: string, start?: string, end?: string, year?: number) => {
        setRange(newRange);
        startTransition(async () => {
            const result = await getRevenueAnalysis(newRange, start, end, year);
            setData(result);
        });
    };

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header with Title and Range Selectors */}
            <div className="flex flex-col gap-6 border-b border-gray-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black text-black tracking-tighter">QAR {totalRevenue.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            Revenue Analytics
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            {range === 'custom' ? `${dateRange.start} → ${dateRange.end}` : (range === 'year' ? `CALENDAR YEAR ${selectedYear}` : ranges.find(r => r.value === range)?.label)}
                        </p>
                    </div>

                    <div className="flex items-center p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar w-fit">
                        {ranges.map((r) => (
                            <button
                                key={r.value}
                                onClick={() => handleRangeChange(r.value, range === 'custom' ? dateRange.start : undefined, range === 'custom' ? dateRange.end : undefined, selectedYear)}
                                disabled={isPending}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                                    range === r.value 
                                        ? "bg-white text-black shadow-sm" 
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secondary Selectors (Year / Custom) */}
                <AnimatePresence>
                    {(range === 'custom' || range === 'year') && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-wrap items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 w-fit"
                        >
                            {range === 'year' ? (
                                <div className="flex items-center gap-4 px-2">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Select Target Year</span>
                                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100">
                                        {AVAILABLE_YEARS.map(y => (
                                            <button
                                                key={y}
                                                onClick={() => {
                                                    setSelectedYear(y);
                                                    handleRangeChange('year', undefined, undefined, y);
                                                }}
                                                className={cn(
                                                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                                    selectedYear === y ? "bg-black text-white" : "text-gray-400 hover:bg-gray-100"
                                                )}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">From</span>
                                        <input 
                                            type="date" 
                                            value={dateRange.start}
                                            onChange={(e) => {
                                                const newRange = { ...dateRange, start: e.target.value };
                                                setDateRange(newRange);
                                                handleRangeChange('custom', newRange.start, newRange.end);
                                            }}
                                            className="bg-transparent text-[11px] font-bold text-black border-none focus:ring-0 outline-none w-32"
                                        />
                                    </div>
                                    <div className="h-4 w-px bg-gray-200 hidden sm:block" />
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">To</span>
                                        <input 
                                            type="date" 
                                            value={dateRange.end}
                                            onChange={(e) => {
                                                const newRange = { ...dateRange, end: e.target.value };
                                                setDateRange(newRange);
                                                handleRangeChange('custom', newRange.start, newRange.end);
                                            }}
                                            className="bg-transparent text-[11px] font-bold text-black border-none focus:ring-0 outline-none w-32"
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Chart Area */}
            <div className="h-[350px] md:h-[400px] w-full relative group">
                <AnimatePresence>
                    {isPending && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                </div>
                                <span className="text-[10px] font-black text-black uppercase tracking-[0.4em] animate-pulse">Syncing Yield</span>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#F1F1F1" strokeDasharray="4 4" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#E1E1E1" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={15}
                            tick={{ fill: '#A1A1A1', fontWeight: '900' }}
                        />
                        <YAxis 
                            stroke="#E1E1E1" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${value.toLocaleString()}`}
                            tick={{ fill: '#A1A1A1', fontWeight: '900' }}
                        />
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#000000" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#revenueGradient)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            {/* Extended Status Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50 mt-4">
                <MiniMetric label="Max Yield" value={`QAR ${Math.max(...data.map(d => d.total), 0).toLocaleString()}`} />
                <MiniMetric label="Period Intensity" value={`QAR ${Math.round(totalRevenue / (data.length || 1)).toLocaleString()}`} />
                <MiniMetric label="Data Freshness" value="Real-time" isStatus />
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Architecture</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-black">SIMPLE PRO v2</span>
                        <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniMetric({ label, value, isStatus = false }: { label: string; value: string; isStatus?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{label}</span>
            <span className={cn(
                "text-[12px] font-black tracking-tight",
                isStatus ? "text-emerald-500 flex items-center gap-2" : "text-black"
            )}>
                {isStatus && <ActivityIndicator />}
                {value}
            </span>
        </div>
    );
}

function ActivityIndicator() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {label}
                </p>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-black tracking-tighter text-black">QAR {payload[0].value.toLocaleString()}</span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
