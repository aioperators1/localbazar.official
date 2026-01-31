"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Direct Message System (Marketplace)
 */
export async function sendDirectMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    });

    if (!conversation) throw new Error("Conversation not found");
    if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    const receiverId = conversation.buyerId === session.user.id ? conversation.sellerId : conversation.buyerId;

    await prisma.directMessage.create({
        data: {
            conversationId,
            senderId: session.user.id,
            receiverId,
            content,
            read: false
        }
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });

    revalidatePath(`/chat/${conversationId}`);
    revalidatePath("/chats");
}

/**
 * Order Support Chat System (Admin/Customer)
 */
export async function getOrderMessages(orderId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: { orderId },
            orderBy: { createdAt: 'asc' }
        });
        return { messages: JSON.parse(JSON.stringify(messages)) };
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        return { messages: [] };
    }
}

export async function sendMessage(orderId: string, content: string, isAdmin: boolean = false) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    try {
        await prisma.message.create({
            data: {
                orderId,
                content,
                isAdmin: Boolean(isAdmin)
            }
        });

        revalidatePath(`/orders/${orderId}`);
        revalidatePath(`/admin/orders/${orderId}`);
        return { success: true };
    } catch (error) {
        console.error("Send Message Error:", error);
        return { error: "Failed to transmit message" };
    }
}
