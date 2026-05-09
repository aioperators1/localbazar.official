"use client";

import { v4 as uuidv4 } from "uuid";

// We'll define a basic structure for the events
export interface TrackingEvent {
    eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";
    eventId?: string;
    value?: number;
    currency?: string;
    contents?: { id: string; quantity: number; price?: number }[];
    content_ids?: string[];
    content_type?: "product" | "product_group";
    userData?: {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        city?: string;
        country?: string;
        zip?: string;
        clientIpAddress?: string;
        clientUserAgent?: string;
        fbc?: string;
        fbp?: string;
    };
    sourceUrl?: string;
}

export const trackEvent = async (event: TrackingEvent) => {
    // 1. Generate an Event ID for deduplication if not provided
    const eventId = event.eventId || uuidv4();
    const sourceUrl = event.sourceUrl || (typeof window !== "undefined" ? window.location.href : "");

    const fullEvent = { ...event, eventId, sourceUrl };

    // 2. Fire Client-Side Pixels
    fireClientPixels(fullEvent);

    // 3. Fire Server-Side CAPI
    await fireServerCapi(fullEvent);
    
    return eventId;
};

const fireClientPixels = (event: TrackingEvent) => {
    if (typeof window === "undefined") return;
    
    const { eventName, eventId, value, currency, contents, content_ids, content_type } = event;

    // ----- FACEBOOK BROWSER PIXEL -----
    if (window.fbq) {
        let fbPayload: any = {};
        if (value) fbPayload.value = value;
        if (currency) fbPayload.currency = currency;
        if (contents) fbPayload.contents = contents;
        if (content_ids) fbPayload.content_ids = content_ids;
        if (content_type) fbPayload.content_type = content_type;
        
        // Custom mapping for FB events
        let fbEventName = eventName;
        
        window.fbq('track', fbEventName, fbPayload, { eventID: eventId });
    }

    // ----- SNAPCHAT BROWSER PIXEL -----
    if (window.snaptr) {
        let snapPayload: any = {};
        if (value) snapPayload.price = value;
        if (currency) snapPayload.currency = currency;
        if (content_ids && content_ids.length > 0) snapPayload.item_ids = content_ids;
        
        let snapEventName = "";
        switch (eventName) {
            case "PageView": snapEventName = "PAGE_VIEW"; break;
            case "ViewContent": snapEventName = "VIEW_CONTENT"; break;
            case "AddToCart": snapEventName = "ADD_CART"; break;
            case "InitiateCheckout": snapEventName = "START_CHECKOUT"; break;
            case "Purchase": snapEventName = "PURCHASE"; break;
        }
        
        if (snapEventName) {
            window.snaptr('track', snapEventName, snapPayload); // Snap doesn't have a standard eventID deduplication in browser
        }
    }

    // ----- TIKTOK BROWSER PIXEL -----
    if (window.ttq) {
        let ttPayload: any = {};
        if (value) ttPayload.value = value;
        if (currency) ttPayload.currency = currency;
        if (contents) ttPayload.contents = contents.map(c => ({ content_id: c.id, content_type: 'product', quantity: c.quantity, price: c.price }));
        
        let ttEventName = "";
        switch (eventName) {
            case "PageView": ttEventName = "page"; window.ttq.page(); break; // Special case for TikTok
            case "ViewContent": ttEventName = "ViewContent"; break;
            case "AddToCart": ttEventName = "AddToCart"; break;
            case "InitiateCheckout": ttEventName = "InitiateCheckout"; break;
            case "Purchase": ttEventName = "CompletePayment"; break;
        }

        if (ttEventName && ttEventName !== "page") {
             window.ttq.track(ttEventName, ttPayload, { event_id: eventId });
        }
    }
};

const fireServerCapi = async (event: TrackingEvent) => {
    // Send to our internal API route to handle CAPI
    try {
        // Collect fbc/fbp from cookies if available
        let fbp, fbc;
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';').map(c => c.trim());
            fbp = cookies.find(c => c.startsWith('_fbp='))?.split('=')[1];
            fbc = cookies.find(c => c.startsWith('_fbc='))?.split('=')[1];
        }

        const enrichedEvent = {
            ...event,
            userData: {
                ...event.userData,
                fbp: event.userData?.fbp || fbp,
                fbc: event.userData?.fbc || fbc,
                clientUserAgent: navigator.userAgent
                // clientIpAddress will be picked up by the server from request headers
            }
        };

        await fetch('/api/analytics/capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedEvent)
        });
    } catch (e) {
        console.error("Failed to fire CAPI", e);
    }
};
