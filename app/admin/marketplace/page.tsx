"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ListingReviewCard } from "@/components/admin/ListingReviewCard";
import { Store, PackageSearch, Clock } from "lucide-react";

export default async function AdminMarketplacePage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const pendingProducts = await prisma.product.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            seller: true,
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const serializedProducts = pendingProducts.map(product => ({
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }));

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Marketplace Requests</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Review and manage pending product listings from the community.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{serializedProducts.length} Pending Items</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {serializedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-400 transition-colors">
                        <PackageSearch className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white capitalize">All caught up!</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto">There are currently no product listings waiting for your review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {serializedProducts.map((product) => (
                        <ListingReviewCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
