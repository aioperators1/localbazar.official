"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChatPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
        include: {
            messages: { orderBy: { createdAt: 'asc' } },
            product: true,
            buyer: true,
            seller: true
        }
    });

    if (!conversation) return <div className="pt-32 p-8 text-center text-red-500">Conversation not found</div>;

    // Authorization check
    if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
        return <div className="pt-32 p-8 text-center text-red-500">Unauthorized</div>;
    }

    const otherUser = conversation.buyerId === session.user.id ? conversation.seller : conversation.buyer;

    return (
        <div className="pt-24 container mx-auto px-4 min-h-screen pb-4 flex flex-col max-w-2xl">
            <div className="mb-4">
                <Link href="/shop" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>

            {/* Header with Product Info */}
            <div className="bg-card border p-4 rounded-t-xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 font-bold">
                        {otherUser.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <div className="font-bold">{otherUser.name || "User"}</div>
                        <div className="text-xs text-muted-foreground">RE: {conversation.product.name}</div>
                    </div>
                </div>
                <div className="font-mono font-bold text-emerald-500">{Number(conversation.product.price)} MAD</div>
            </div>

            {/* Chat Window */}
            <ChatWindow
                conversationId={conversation.id}
                initialMessages={conversation.messages}
                currentUserId={session.user.id}
            />
        </div>
    )
}
