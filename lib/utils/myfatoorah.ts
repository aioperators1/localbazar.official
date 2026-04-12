// MyFatoorah Payment Gateway Utility — Server-side only

// Clean environment variables: remove quotes and whitespace
const cleanEnvVar = (val: string | undefined) => val?.replace(/['"]/g, "").trim();

const MYFATOORAH_API_URL = cleanEnvVar(process.env.MYFATOORAH_API_URL) || "https://apitest.myfatoorah.com";
const MYFATOORAH_TOKEN = cleanEnvVar(process.env.MYFATOORAH_TOKEN) || "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6HXIGEp92NdGaozUceZ1qjZ2P-9kK1J2HqGEaFp5wGvS6C-c_TInoB_0v-Q1b2iKngB3R4P9Snd7eZ6ZcZ-fQ_pItm0sQh3V7UjFzH2wD-S2H5d1QzO3K5xK1uX8q9d9x9T7B2q4yL_P82V6vU-gVb_j_Oq3h7V_rN7_Qn6z4h-9Q6V-x_-5U-sK5F7Hn9_5Yy_4o7eG6w9_R9L8P_b3P_6rJ_oQ5yV9jG7t_y1W_Pz-_j-_g-_a-_W-_i-_a-_9";

async function sendRequest(endpoint: string, method: string = "POST", data?: Record<string, unknown>) {
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
        DisplayCurrencyIso: "MAD",
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
