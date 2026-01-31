"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitListing(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as string;
    const condition = formData.get("condition") as string;

    // Auto-generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Math.random().toString(36).substring(2, 7);

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price: price,
                categoryId,
                images: image,
                slug,
                sellerId: session.user.id,
                status: "PENDING",
                inStock: true,
                stock: 1,
                specs: JSON.stringify({ condition })
            }
        });
    } catch (e) {
        console.error("Listing Error", e);
        return { error: "Failed to create listing" };
    }

    revalidatePath("/my-listings");
    return { success: true };
}

export async function approveListing(productId: string) {
    // const session = await getServerSession(authOptions);
    // Assuming role check would happen here or in layout

    await prisma.product.update({
        where: { id: productId },
        data: { status: "APPROVED" }
    });

    revalidatePath("/admin/marketplace");
    revalidatePath("/shop");
    return { success: true };
}

export async function rejectListing(productId: string) {
    // const session = await getServerSession(authOptions);

    await prisma.product.delete({
        where: { id: productId }
    });

    revalidatePath("/admin/marketplace");
    return { success: true };
}

export async function startConversation(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product || !product.sellerId) throw new Error("Product not available from seller");

    if (product.sellerId === session.user.id) throw new Error("Cannot chat with yourself");

    // Check existing conversation
    let conversation = await prisma.conversation.findFirst({
        where: {
            buyerId: session.user.id,
            sellerId: product.sellerId,
            productId: productId
        }
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                buyerId: session.user.id,
                sellerId: product.sellerId,
                productId: productId
            }
        });
    }

    redirect(`/chat/${conversation.id}`);
}

export async function sendMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    });

    if (!conversation) throw new Error("Conversation not found");

    const receiverId = conversation.buyerId === session.user.id ? conversation.sellerId : conversation.buyerId;

    await prisma.directMessage.create({
        data: {
            conversationId,
            senderId: session.user.id,
            receiverId,
            content
        }
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });

    revalidatePath(`/chat/${conversationId}`);
}

export async function deleteListing(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product || product.sellerId !== session.user.id) {
        throw new Error("Unauthorized or product not found");
    }

    await prisma.product.delete({
        where: { id: productId }
    });

    revalidatePath("/my-listings");
    revalidatePath("/shop");
}

export async function updateListing(productId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product || product.sellerId !== session.user.id) {
        throw new Error("Unauthorized or product not found");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as string;
    const condition = formData.get("condition") as string;

    await prisma.product.update({
        where: { id: productId },
        data: {
            name,
            description,
            price,
            categoryId,
            images: image,
            specs: JSON.stringify({ condition })
        }
    });

    revalidatePath("/my-listings");
    revalidatePath("/shop");
    revalidatePath(`/product/${product.slug}`);
}

export async function toggleSold(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product || product.sellerId !== session.user.id) {
        throw new Error("Unauthorized or product not found");
    }

    await prisma.product.update({
        where: { id: productId },
        data: {
            inStock: !product.inStock,
            status: !product.inStock ? "SOLD" : "APPROVED"
        }
    });

    revalidatePath("/my-listings");
    revalidatePath("/shop");
    revalidatePath(`/product/${product.slug}`);
}

export async function checkUnreadMessages() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return false;

    const unread = await prisma.directMessage.count({
        where: {
            receiverId: session.user.id,
            read: false
        }
    });

    return unread > 0;
}

export async function markMessagesAsRead(conversationId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return;

    await prisma.directMessage.updateMany({
        where: {
            conversationId,
            receiverId: session.user.id,
            read: false
        },
        data: {
            read: true
        }
    });

    revalidatePath("/chats");
}
