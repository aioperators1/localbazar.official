import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/actions/checkout";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Use our existing hardened checkout engine to create the order safely
        // This ensures the order is in the DB, prices are verified, and inventory is tracked
        const res = await placeOrder({
            firstName: body.firstName || "Guest",
            lastName: body.lastName || "User",
            email: body.email || "guest@localbazar.com",
            phone: body.phone || "00000000",
            address: body.address || "Cart Express",
            city: body.city || "Doha",
            zip: body.zip || "0000",
            paymentMethod: "MYFATOORAH",
            items: body.items,
            total: body.amount
        });

        if (res.success && res.paymentUrl) {
            return NextResponse.json({ 
                success: true, 
                Data: { InvoiceURL: res.paymentUrl } 
            });
        }

        return NextResponse.json({ 
            success: false, 
            Message: res.error || "Failed to initiate payment" 
        }, { status: 400 });

    } catch (error: any) {
        console.error("[API Create Payment] Error:", error);
        return NextResponse.json({ 
            success: false, 
            Message: error.message || "Internal Server Error" 
        }, { status: 500 });
    }
}
