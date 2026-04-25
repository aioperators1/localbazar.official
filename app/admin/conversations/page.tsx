export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, ArrowRight, Mail, Hash, Package } from "lucide-react";
import Image from "next/image";

export default async function AdminConversationsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    const conversations = await prisma.conversation.findMany({
        include: {
            buyer: true,
            seller: true,
            product: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Marketplace Conversations</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Monitor interactions between buyers and sellers to ensure safety and quality.</p>
                </div>

                <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{conversations.length} Active Chats</span>
                </div>
            </div>

            {/* Content Section */}
            {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-400">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">No activity yet</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto">Communication between users will appear here once someone starts a chat.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {conversations.map((conv) => {
                        const lastMessage = conv.messages[0];
                        const productImg = conv.product.images;
                        let displayImg = "/placeholder.png";
                        try {
                            if (productImg.startsWith('[')) {
                                displayImg = JSON.parse(productImg)[0];
                            } else {
                                displayImg = productImg;
                            }
                        } catch { }

                        return (
                            <div
                                key={conv.id}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-center gap-6"
                            >
                                {/* Participants */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Buyer */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Buyer</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{conv.buyer.name || "User"}</p>
                                        </div>
                                    </div>
                                    {/* Seller */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Seller</p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{conv.seller.name || "User"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Indicator (Hidden on mobile) */}
                                <div className="hidden lg:block text-zinc-300 dark:text-zinc-700">
                                    <ArrowRight className="w-5 h-5" />
                                </div>

                                {/* Product context */}
                                <div className="flex-[1.5] flex items-center gap-4 min-w-0">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                                        <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight truncate mb-0.5">Product: {conv.product.name}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate italic">
                                            &quot;{lastMessage ? lastMessage.content : "Awaiting first message..."}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Meta & Actions */}
                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-medium text-zinc-400 uppercase">Last Activity</p>
                                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/chat/${conv.id}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        View Chat
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
