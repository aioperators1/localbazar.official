import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountView from "@/components/account/AccountView";
import { User } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });

    return (
        <div className="bg-transparent min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/20 text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">
                        <User className="w-3 h-3" /> Client Profile
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-[calc(-0.05em)] leading-none">
                        My <span className="text-white/60">Account</span>
                    </h1>
                </div>
                <AccountView user={user as any} orders={orders as any} />
            </div>
        </div>
    );
}
