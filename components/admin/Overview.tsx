"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface OverviewProps {
    data?: { name: string; total: number }[];
}

export function Overview({ data: chartData }: OverviewProps) {
    const data = chartData || [
        { name: "Jan", total: 12400 },
        { name: "Feb", total: 15600 },
        { name: "Mar", total: 13800 },
        { name: "Apr", total: 18200 },
        { name: "May", total: 21000 },
        { name: "Jun", total: 19500 },
        { name: "Jul", total: 23400 },
        { name: "Aug", total: 20400 },
        { name: "Sep", total: 22400 },
        { name: "Oct", total: 25400 },
        { name: "Nov", total: 28400 },
        { name: "Dec", total: 32400 },
    ];

    return (
        <div className="h-[300px] md:h-[420px] w-full mt-8 p-1">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" strokeDasharray="8 8" />
                    <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={15}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: '900' }}
                    />
                    <YAxis 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: '900' }}
                        width={30}
                        hide={typeof window !== 'undefined' && window.innerWidth < 768}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            padding: '12px 16px'
                        }}
                        itemStyle={{ color: '#FFFFFF', fontWeight: '900', fontSize: '13px' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#FFFFFF" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorTotal)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
