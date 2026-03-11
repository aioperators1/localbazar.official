"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma"; // Disabled to prevent DB crashes
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// MOCK MODE: DB operations are disabled to prevent crashing.

export async function submitListing(formData: FormData) {
    console.log("Mock submit listing", formData);
    return { success: true };
}

export async function approveListing(productId: string) {
    console.log("Mock approve listing", productId);
    return { success: true };
}

export async function rejectListing(productId: string) {
    console.log("Mock reject listing", productId);
    return { success: true };
}

export async function startConversation(productId: string) {
    // Mock behavior: Redirect to a fake chat or just do nothing
    console.log("Mock start conversation", productId);
    // We can't easily mock a dynamic route redirect without a real ID, 
    // so we'll just redirect to a construction page or home for now.
    redirect(`/?mock-chat-started=${productId}`);
}

export async function sendMessage(conversationId: string, content: string) {
    console.log("Mock send message", conversationId, content);
}

export async function deleteListing(productId: string) {
    console.log("Mock delete listing", productId);
}

export async function updateListing(productId: string, formData: FormData) {
    console.log("Mock update listing", productId);
}

export async function toggleSold(productId: string) {
    console.log("Mock toggle sold", productId);
}

export async function checkUnreadMessages() {
    return false;
}

export async function markMessagesAsRead(conversationId: string) {
    console.log("Mock mark read", conversationId);
}
