// MyFatoorah Payment Gateway Utility — Server-side only

// Clean environment variables: remove quotes and whitespace
const cleanEnvVar = (val: string | undefined) => val?.replace(/['"]/g, "").trim();

const MYFATOORAH_API_URL = cleanEnvVar(process.env.MYFATOORAH_API_URL) || "https://apitest.myfatoorah.com";
const MYFATOORAH_TOKEN = cleanEnvVar(process.env.MYFATOORAH_API_KEY);

if (!MYFATOORAH_TOKEN) {
    console.warn("CRITICAL: MYFATOORAH_API_KEY is missing from environment variables.");
}

async function sendRequest(endpoint: string, method: string = "POST", data?: Record<string, unknown>) {
    if (!MYFATOORAH_TOKEN) throw new Error("Payment Gateway Configuration Error: API Key missing.");
    
    const baseUrl = MYFATOORAH_API_URL.endsWith("/") ? MYFATOORAH_API_URL.slice(0, -1) : MYFATOORAH_API_URL;
    const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    
    // Ensure "Bearer " is present only once
    const rawToken = MYFATOORAH_TOKEN.replace(/^Bearer\s+/i, "");
    const token = `Bearer ${rawToken}`;

    const headers: HeadersInit = {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (data && method !== "GET") {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const json = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            console.error("MyFatoorah API Error HTTP:", json || response.statusText);
            throw new Error(json?.Message || json?.ValidationErrors?.[0]?.Error || `MyFatoorah API returned ${response.status}`);
        }

        return json;
    } catch (e: unknown) {
        if (e instanceof Error && e.message?.includes("fetch")) {
            throw new Error("Network error connecting to MyFatoorah. Please try again.");
        }
        throw e;
    }
}

export async function initiatePayment(amount: number, orderId: string, email: string, name: string) {
    // Determine base URL, works smoothly on local and production if NEXT_PUBLIC_BASE_URL is set
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_URL || 'yourdomain.com'}` : "http://localhost:3000");
    
    const requestBody = {
        CustomerName: (name || email.split('@')[0]).trim(), 
        NotificationOption: "LNK", // Generate a payment link
        CustomerEmail: email.trim(),
        InvoiceValue: Math.round(amount * 100) / 100, 
        CallBackUrl: `${baseUrl}/api/payment/myfatoorah/callback?orderId=${orderId}`,
        ErrorUrl: `${baseUrl}/api/payment/myfatoorah/callback?orderId=${orderId}`, 
        UserDefinedField: orderId,
        Language: "ar"
    };

    const data = await sendRequest("/v2/SendPayment", "POST", requestBody);
    
    if (data?.IsSuccess && data?.Data?.InvoiceURL) {
        return {
            paymentUrl: data.Data.InvoiceURL as string,
            invoiceId: String(data.Data.InvoiceId)
        };
    }

    console.error("MyFatoorah payload issue:", data);
    throw new Error(data?.Message || data?.ValidationErrors?.[0]?.Error || "Failed to create MyFatoorah invoice");
}

export async function getPaymentStatus(paymentId: string) {
    const requestBody = {
        Key: paymentId,
        KeyType: "PaymentId"
    };

    const data = await sendRequest("/v2/GetPaymentStatus", "POST", requestBody);
    
    if (data?.IsSuccess && data?.Data) {
        return data.Data;
    }

    throw new Error(data?.Message || "Failed to retrieve payment status");
}
