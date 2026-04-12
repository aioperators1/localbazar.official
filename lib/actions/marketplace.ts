"use server";

import { redirect } from "next/navigation";

// MOCK MODE: DB operations are disabled to prevent crashing.

export async function submitListing(_formData: FormData) {
    console.log("Mock submit listing", _formData);
    return { success: true };
}

export async function approveListing(_productId: string) {
    console.log("Mock approve listing", _productId);
    return { success: true };
}

export async function rejectListing(_productId: string) {
    console.log("Mock reject listing", _productId);
    return { success: true };
}

export async function startConversation(productId: string) {
    // Mock behavior: Redirect to a fake chat or just do nothing
    console.log("Mock start conversation", productId);
    // We can't easily mock a dynamic route redirect without a real ID, 
    // so we'll just redirect to a construction page or home for now.
    redirect(`/?mock-chat-started=${productId}`);
}

export async function sendMessage(_conversationId: string, _content: string) {
    console.log("Mock send message", _conversationId, _content);
}

export async function deleteListing(_productId: string) {
    console.log("Mock delete listing", _productId);
}

export async function updateListing(_productId: string, _formData: FormData) {
    console.log("Mock update listing", _productId, _formData);
}

export async function toggleSold(_productId: string) {
    console.log("Mock toggle sold", _productId);
}

export async function checkUnreadMessages() {
    return false;
}

export async function markMessagesAsRead(_conversationId: string) {
    console.log("Mock mark read", _conversationId);
}
