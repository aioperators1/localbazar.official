
import { getDrivers } from "@/lib/actions/admin";
import { Truck, Plus, Shield, ShieldOff, UserX, Activity, Compass, Target } from "lucide-react";
import { CreateDriverDialog } from "@/components/admin/CreateDriverDialog";
import { DriverActions } from "@/components/admin/DriverActions";
import { DriverAssignmentsSheet } from "@/components/admin/DriverAssignmentsSheet";

export const dynamic = 'force-dynamic';

export default async function AdminDriversPage() {
    const drivers = await getDrivers();

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-black rounded-full" />
                        <h1 className="text-4xl font-black text-black tracking-[ -0.05em] uppercase italic leading-none">Global Logistics</h1>
                    </div>
                    <p className="text-[12px] text-gray-400 font-bold uppercase tracking-[0.3em] pl-5">Carrier Fleet Management & Deployment</p>
                </div>
                <CreateDriverDialog />
            </div>

            {/* Metrics HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Carriers", value: drivers.filter((d: any) => d.active).length, icon: Activity, color: "text-emerald-500" },
                    { label: "Total Assignments", value: drivers.reduce((acc: number, d: any) => acc + d._count.orders, 0), icon: Target, color: "text-blue-500" },
                    { label: "Fleet Capacity", value: drivers.length, icon: Compass, color: "text-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border-2 border-gray-50 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-black tracking-tighter">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Drivers Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {drivers.length === 0 ? (
                    <div className="col-span-full py-32 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50/30">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
                            <Truck className="w-10 h-10 text-gray-100" />
                        </div>
                        <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[11px]">No active units detected</p>
                    </div>
                ) : (
                    drivers.map((driver: any) => (
                        <div key={driver.id} className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:border-black transition-all duration-500 relative">
                            {driver.active && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                                        <Truck className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-black uppercase tracking-tight leading-none mb-2">{driver.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-200" />
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Carrier Protocol v1.0</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Secure Phone</span>
                                            <span className="text-black font-bold text-[13px] tracking-tight">{driver.phone}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Units</span>
                                            <span className="text-black font-extrabold text-[13px] tracking-tight bg-white px-2 rounded border border-gray-100">{driver._count.orders} Units</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <p className="text-[10px] text-gray-400 font-medium truncate lowercase">{driver.email || 'no-email@localbazar.com'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <DriverAssignmentsSheet driverName={driver.name} orders={driver.orders} />
                            <DriverActions id={driver.id} active={driver.active} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
