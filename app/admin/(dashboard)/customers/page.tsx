import { getAdminCustomers } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import Image from "next/image";

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
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Customers</h1>
                <p className="text-zinc-400">View and manage registered users.</p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white">All Customers</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 relative overflow-hidden">
                                                        {customer.image ? (
                                                            <Image src={customer.image} alt={customer.name || 'Customer'} fill className="object-cover" />
                                                        ) : (
                                                            <UserCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{customer.name || 'Unnamed User'}</span>
                                                        <span className="text-zinc-500 text-xs">{customer.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                                                    ${customer.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-zinc-800 text-zinc-400 border-zinc-700'}
                                                `}>
                                                    {customer.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-zinc-300">
                                                {customer.orders.length}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
