"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
    { name: "Lun", sales: 12400 },
    { name: "Mar", sales: 15600 },
    { name: "Mer", sales: 13800 },
    { name: "Jeu", sales: 18200 },
    { name: "Ven", sales: 21000 },
    { name: "Sam", sales: 19500 },
    { name: "Dim", sales: 23400 },
];

export function Overview() {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid vertical={false} stroke="#E3E3E3" strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#616161" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                    />
                    <YAxis 
                        stroke="#616161" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '1px solid #E3E3E3',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#303030', fontWeight: 'bold' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#005BD3" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "#005BD3", strokeWidth: 2, stroke: "#FFF" }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
