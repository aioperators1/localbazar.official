"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface OverviewProps {
    data: {
        name: string;
        total: number;
    }[];
}

export function Overview({ data }: OverviewProps) {
    return (
        <div className="h-[400px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="4 4"
                        stroke="#27272a"
                        opacity={0.4}
                    />
                    <XAxis
                        dataKey="name"
                        stroke="#71717a"
                        fontSize={10}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        dy={15}
                        className="uppercase tracking-widest"
                    />
                    <YAxis
                        stroke="#71717a"
                        fontSize={10}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
                        dx={-5}
                        className="tracking-tighter"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#09090b",
                            border: "1px solid #ffffff10",
                            borderRadius: "16px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            padding: "16px",
                            backdropFilter: "blur(12px)"
                        }}
                        itemStyle={{ color: "#6366f1", fontWeight: "900", fontSize: "14px" }}
                        labelStyle={{ color: "#a1a1aa", marginBottom: "8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}
                        formatter={(value: any) => [
                            new Intl.NumberFormat('en-MA', {
                                style: 'currency',
                                currency: 'MAD',
                                maximumFractionDigits: 0
                            }).format(Number(value)),
                            "REVENUE"
                        ]}
                        cursor={{ stroke: "#ffffff20", strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#818cf8"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        animationDuration={2500}
                        activeDot={{
                            r: 6,
                            fill: "#6366f1",
                            stroke: "#09090b",
                            strokeWidth: 3,
                            className: "shadow-2xl"
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
