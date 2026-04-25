import { getAdminCustomers } from "@/lib/actions/admin";
import { UserCircle, Users } from "lucide-react";

export const dynamic = 'force-dynamic';
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function AdminCustomersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers: any[] = await getAdminCustomers();

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Customers</h1>
                    <p className="text-[13px] text-gray-500">Manage client relationships and purchase history.</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-none">{customers.length}</span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Users</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-[14px] border-collapse bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 pl-6 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">User Identity</th>
                            <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Phone Number</th>
                            <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">Last Activity</th>
                            <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-[11px] text-right">Lifetime Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="p-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-black font-semibold text-[14px]">No customers found</p>
                                </div>
                            </td>
                        </tr>
                        ) : (
                             customers.map((customer: any) => {
                                 const lastOrder = customer.orders?.[0];
                                 const lifeValue = customer.orders?.reduce((acc: number, o: any) => acc + o.total, 0) || 0;
                                 const lastItemName = lastOrder?.items?.[0]?.name || "No items";

                                 return (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-all font-inter">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {customer.image ? (
                                                        <Image src={customer.image} alt={customer.name || 'Member'} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                                    ) : (
                                                        <UserCircle className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-black text-[14px]">{customer.name || 'Anonymous User'}</span>
                                                    <span className="text-gray-500 font-medium text-[11px]">{customer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-black font-semibold text-[13px] tracking-tight">
                                                {customer.phone || <span className="text-gray-300 italic font-normal text-[11px]">No phone</span>}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {lastOrder ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-black font-bold text-[13px] truncate max-w-[180px]">{lastItemName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-emerald-600 font-bold text-[11px]">QAR {lastOrder.total.toFixed(2)}</span>
                                                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                                            • {new Date(lastOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">No transaction logic</span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-black text-black text-[15px] tracking-tighter">QAR {lifeValue.toFixed(2)}</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{customer.orders?.length || 0} Orders</span>
                                            </div>
                                        </td>
                                    </tr>
                                 )
                             })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
