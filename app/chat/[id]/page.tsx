import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ChatInterface } from "./ChatInterface";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
            buyer: true,
            seller: true,
            product: true,
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!conversation) notFound();

    // Verify participation
    if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
        redirect("/chats");
    }

    const otherUser = conversation.buyerId === session.user.id ? conversation.seller : conversation.buyer;

    // Serialize data for client component
    const serializedConversation = {
        ...conversation,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        product: {
            ...conversation.product,
            price: Number(conversation.product.price),
            salePrice: conversation.product.salePrice ? Number(conversation.product.salePrice) : null,
            createdAt: conversation.product.createdAt.toISOString(),
            updatedAt: conversation.product.updatedAt.toISOString(),
        },
        messages: conversation.messages.map(m => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
        })),
        buyer: {
            ...conversation.buyer,
            createdAt: conversation.buyer.createdAt.toISOString(),
            updatedAt: conversation.buyer.updatedAt.toISOString(),
        },
        seller: {
            ...conversation.seller,
            createdAt: conversation.seller.createdAt.toISOString(),
            updatedAt: conversation.seller.updatedAt.toISOString(),
        }
    };

    const serializedOtherUser = {
        ...otherUser,
        createdAt: otherUser.createdAt.toISOString(),
        updatedAt: otherUser.updatedAt.toISOString(),
    };

    return (
        <div className="min-h-screen bg-[#030303] pt-32 pb-20 relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-40 left-0 -ml-32 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 max-w-5xl h-[calc(100vh-220px)] relative z-10">
                <ChatInterface
                    conversation={serializedConversation as any}
                    currentUserId={session.user.id}
                    otherUser={serializedOtherUser as any}
                />
            </div>
        </div>
    );
}
