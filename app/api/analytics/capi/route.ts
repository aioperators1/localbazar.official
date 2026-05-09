import { NextResponse } from "next/server";
import { getAdminSettings } from "@/lib/actions/admin";
import crypto from "crypto";

// Helper to hash user data as required by Meta CAPI
function hashData(data: string | undefined): string | undefined {
    if (!data) return undefined;
    const normalized = data.trim().toLowerCase();
    return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventName, eventId, value, currency, contents, content_ids, content_type, userData, sourceUrl } = body;

        // Fetch settings from DB
        const settings = await getAdminSettings();
        const pixelId = settings?.facebookPixelId;
        const accessToken = settings?.facebookAccessToken;

        if (!pixelId || !accessToken) {
            return NextResponse.json({ success: false, message: "CAPI not configured" }, { status: 200 }); // Not an error, just inactive
        }

        // Prepare User Data
        const clientIpAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
        const userAgent = userData?.clientUserAgent || req.headers.get('user-agent');

        let hashedEmail, hashedPhone, hashedFirstName, hashedLastName, hashedCity, hashedCountry, hashedZip;
        
        if (userData) {
            hashedEmail = hashData(userData.email);
            hashedPhone = hashData(userData.phone);
            hashedFirstName = hashData(userData.firstName);
            hashedLastName = hashData(userData.lastName);
            hashedCity = hashData(userData.city);
            hashedCountry = hashData(userData.country);
            hashedZip = hashData(userData.zip);
        }

        // Build Payload
        const capiEvent = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_id: eventId,
                    event_source_url: sourceUrl,
                    user_data: {
                        client_ip_address: clientIpAddress,
                        client_user_agent: userAgent,
                        em: hashedEmail ? [hashedEmail] : undefined,
                        ph: hashedPhone ? [hashedPhone] : undefined,
                        fn: hashedFirstName ? [hashedFirstName] : undefined,
                        ln: hashedLastName ? [hashedLastName] : undefined,
                        ct: hashedCity ? [hashedCity] : undefined,
                        country: hashedCountry ? [hashedCountry] : undefined,
                        zp: hashedZip ? [hashedZip] : undefined,
                        fbp: userData?.fbp,
                        fbc: userData?.fbc,
                    },
                    custom_data: {
                        value: value,
                        currency: currency || "QAR",
                        contents: contents,
                        content_ids: content_ids,
                        content_type: content_type,
                    }
                }
            ],
            // test_event_code: "TEST28833" // Use for debugging via Events Manager
        };

        // Clean undefined values
        const cleanPayload = JSON.parse(JSON.stringify(capiEvent));

        // Send to Facebook Graph API
        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanPayload)
        });

        const result = await response.json();
        
        if (!response.ok) {
            console.error("Meta CAPI Error:", result);
            return NextResponse.json({ success: false, error: result }, { status: 400 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("CAPI Route Exception:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
