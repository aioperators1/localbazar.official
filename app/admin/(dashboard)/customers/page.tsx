import { getAdminCustomers } from "@/lib/actions/admin";
import { UserCircle, Users, Mail, Calendar, Hash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Customer {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
    orders: unknown[];
}

export default async function AdminCustomersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers: any[] = await getAdminCustomers();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">Customers</h1>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm overflow-hidden">
                <table className="w-full text-left text-[13px] border-collapse">
                    <thead className="bg-[#f6f6f6] border-b border-[#E3E3E3]">
                        <tr>
                            <th className="p-3 pl-4 font-semibold text-[#303030]">Customer name</th>
                            <th className="p-3 font-semibold text-[#303030]">Email subscription</th>
                            <th className="p-3 font-semibold text-[#303030]">Location</th>
                            <th className="p-3 font-semibold text-[#303030]">Orders</th>
                            <th className="p-3 text-right pr-4 font-semibold text-[#303030]">Amount spent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E3E3]">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-[#616161] font-medium">
                                    No customers found.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-[#F9F9F9] transition-colors">
                                    <td className="p-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#F1F1F1] border border-[#E3E3E3] flex items-center justify-center text-[#616161] overflow-hidden shrink-0">
                                                {customer.image ? (
                                                    <Image src={customer.image} alt={customer.name || 'Member'} fill className="object-cover" unoptimized />
                                                ) : (
                                                    <UserCircle className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#303030]">{customer.name || 'No name'}</span>
                                                <span className="text-[#616161] text-[11px]">{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium",
                                            customer.role === 'ADMIN' ? "bg-[#E3F2FD] text-[#0D47A1]" : "bg-[#F1F1F1] text-[#616161]"
                                        )}>
                                            {customer.role === 'ADMIN' ? "Administrator" : "Subscribed"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-[#616161]">
                                        Qatar
                                    </td>
                                    <td className="p-3 text-[#616161]">
                                        {customer.orders.length || 0} orders
                                    </td>
                                    <td className="p-3 text-right pr-4 font-bold text-[#303030]">
                                        QAR 0.00
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
