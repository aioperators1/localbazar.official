"use client";

import { useCart } from "@/hooks/use-cart";

export default function PayButton() {
    const { items } = useCart();

    // 1) Calculate total price from cart
    const total = items.reduce((sum, item) => sum + item.price, 0);

    const pay = async () => {
        const res = await fetch("/api/payment/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: total, 
                items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color
                }))
            }), 
        });

        const data = await res.json();

        // 2) Get payment URL
        const paymentUrl = data.Data?.InvoiceURL;

        if (paymentUrl) {
            window.location.href = paymentUrl; // redirect to MyFatoorah
        } else {
            alert("Payment URL not found. Please try again.");
        }
    };

    return (
        <button
            onClick={pay}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Pay {total} MAD
        </button>
    );
}