import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/utils/myfatoorah";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const paymentId = searchParams.get("paymentId");
    const orderId = searchParams.get("orderId");
    
    // Determine base URL properly
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (process.env.NODE_ENV === 'production' 
            ? `https://${process.env.VERCEL_URL || 'yourdomain.com'}` 
            : "http://localhost:3000");

    console.log(`[MyFatoorah Callback] Received: paymentId=${paymentId}, orderId=${orderId}`);

    // If no paymentId, the payment was not completed or cancelled by user
    if (!paymentId) {
        if (orderId) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "FAILED" }
            }).catch((e) => console.error("[MyFatoorah Callback] Status Update Error:", e));
        }
        return NextResponse.redirect(`${baseUrl}/cart?error=PaymentCancelled`);
    }

    try {
        const paymentData = await getPaymentStatus(paymentId);
        const isPaid = paymentData.InvoiceStatus === "Paid";
        
        // Fallback for orderId from MyFatoorah metadata if missing in URL
        const finalOrderId = orderId || paymentData.UserDefinedField;

        if (isPaid) {
            console.log(`[MyFatoorah Callback] Success for Order ${finalOrderId}`);
            
            if (finalOrderId) {
                await prisma.order.update({
                    where: { id: finalOrderId },
                    data: { 
                        status: "PAID",
                        paymentId: String(paymentId) 
                    }
                });
            }
            
            // Revalidate admin pages
            revalidatePath('/admin');
            revalidatePath('/admin/orders');
            
            return NextResponse.redirect(`${baseUrl}/success?orderId=${finalOrderId || ''}&payment=success`);
        } else {
            console.warn(`[MyFatoorah Callback] Payment Status: ${paymentData.InvoiceStatus} for Order ${finalOrderId}`);
            
            if (finalOrderId) {
                await prisma.order.update({
                    where: { id: finalOrderId },
                    data: { status: "FAILED" }
                }).catch((e) => console.error("[MyFatoorah Callback] Failure Update Error:", e));
            }
            
            return NextResponse.redirect(`${baseUrl}/cart?error=PaymentStatus_${paymentData.InvoiceStatus}`);
        }
    } catch (error: any) {
        console.error("[MyFatoorah Callback] Verification Error:", error);
        
        const errorMsg = error?.message || "VerificationFailed";
        const cleanError = errorMsg.includes("Unauthorized") ? "InvalidGatewayToken" : encodeURIComponent(errorMsg);
        return NextResponse.redirect(`${baseUrl}/cart?error=${cleanError}`);
    }
}