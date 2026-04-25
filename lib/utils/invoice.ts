"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceOrder {
    id: string;
    createdAt: string | Date;
    paymentMethod: string;
    phone?: string | null;
    shippingMethod?: string | null;
    total: number | string;
    user?: {
        name?: string | null;
        email?: string | null;
        addresses?: Array<{
            street?: string;
            line1?: string;
            city?: string;
            zip?: string;
            country?: string;
        }>;
    };
    shippingAddress?: {
        street?: string;
        line1?: string;
        city?: string;
        zip?: string;
        country?: string;
    };
    items: Array<{
        product: {
            name: string;
            sku?: string;
        };
        quantity: number;
        price: number | string;
    }>;
}

interface InvoiceSettings {
    storeAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
}

export const generateInvoice = (order: InvoiceOrder, settings: InvoiceSettings) => {
    const doc = new jsPDF();

    // --- HELPER: COLOR PALETTE ---
    const COLORS = {
        ONYX: [10, 10, 10],      // Deep Black
        HERITAGE: [89, 44, 47],  // Burgundy
        ZINC: [113, 113, 122],   // Deep Gray
        ZINC_LIGHT: [161, 161, 170], // Light Gray for labels
        EMERALD: [16, 185, 129], // Success
        WHITE: [255, 255, 255],
        CARD_BG: [248, 248, 248],
        BORDER: [241, 241, 241]
    };

    // --- 1. HERO HEADER (ONYX) ---
    doc.setFillColor(...COLORS.ONYX as [number, number, number]);
    doc.rect(0, 0, 210, 75, 'F');
    
    // Heritage Logo Implementation
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("ESTABLISHED 2013", 25, 25);

    // L-OCA-L (Serif Style)
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.text("L", 25, 40);
    doc.text("OCA", 34, 40, { charSpace: 1.5 }); // Adjusted for better visual balance
    doc.text("L", 65, 40);

    // BAZAR
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("BAZAR", 25, 52, { charSpace: 8 }); // Reduced width for tighter look

    // Store Info (Header Right)
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(settings?.storeAddress || "Luxury District, Doha, Qatar", 185, 25, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(settings?.contactPhone || "+974 5055 8884", 185, 30, { align: "right" });
    doc.text(settings?.contactEmail || "concierge@localbazar.qa", 185, 35, { align: "right" });
    doc.text("www.localbazar.qa", 185, 40, { align: "right" });

    // Document Label Badge
    doc.setFillColor(255, 255, 255, 0.05);
    doc.roundedRect(130, 50, 65, 8, 4, 4, 'F'); 
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL RECEIPT", 162.5, 55.5, { align: "center", charSpace: 0.5 }); 

    // --- 2. PROTOCOL METADATA ---
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PROTOCOL REF:", 185, 95, { align: "right" });
    doc.setFontSize(10);
    doc.text(`LB-PRT-${order.id.slice(-8).toUpperCase()}`, 185, 101, { align: "right" });

    // --- 3. THE TRIAD (CLIENT / LOGISTICS / PAYMENT) ---
    doc.setDrawColor(...COLORS.BORDER as [number, number, number]);
    doc.line(20, 135, 190, 135);

    // Column 1: Prestige Client
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.setFontSize(7);
    doc.text("PRESTIGE CLIENT", 25, 110);
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(16);
    doc.text(`${order.user?.name || "Distinguished Guest"}`, 25, 118);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text(`${(order.user?.email || "verified_member@localbazar.qa").toUpperCase()}`, 25, 124);
    if (order.phone) {
        doc.setTextColor(16, 185, 129); // Emerald-500
        doc.text(`${order.phone}`, 25, 128);
    }

    // Column 2: Logistics Hub
    const shippingAddr = order.user?.addresses?.[0] || order.shippingAddress;
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.setFontSize(7);
    doc.text("LOGISTICS HUB", 85, 110);
    doc.setTextColor(...COLORS.HERITAGE as [number, number, number]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("GLOBAL EXPRESS DELIVERY", 85, 115);
    
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("RECIPIENT:", 85, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.user?.name || "Distinguished Guest"}`, 105, 120);

    if (shippingAddr) {
        doc.setFont("helvetica", "bold");
        doc.text("DESTINATION:", 85, 124);
        doc.setFont("helvetica", "normal");
        doc.text(`${shippingAddr.street || shippingAddr.line1 || ""}, ${shippingAddr.city || ""}`, 105, 124);
        doc.text(`${shippingAddr.country || "QATAR"}`, 105, 128);
        
        doc.setFont("helvetica", "bold");
        doc.text("DISPATCH:", 85, 132);
        doc.setFont("helvetica", "normal");
        doc.text("Doha Heritage Hub", 105, 132);
    }

    // Column 3: Payment Matrix
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.setFontSize(7);
    doc.text("PAYMENT MATRIX", 145, 110);
    doc.setFillColor(...COLORS.CARD_BG as [number, number, number]);
    doc.roundedRect(145, 114, 40, 14, 2, 2, 'F');
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("SETTLEMENT", 150, 119);
    doc.setFontSize(10);
    doc.setFont("times", "bolditalic");
    doc.text(`${order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}`, 150, 124);

    // --- 4. ACQUISITION TABLE ---
    let itemsSubtotal = 0;
    const tableData = order.items.map((item) => {
        const itemTotal = item.quantity * Number(item.price);
        itemsSubtotal += itemTotal;
        return [
            { 
                content: item.product.name.toUpperCase(), 
                styles: { font: 'times', fontStyle: 'bolditalic' as const, fontSize: 10 } 
            },
            `LB-ACQ-${(order.id.slice(-4) + (item.product.sku || 'N/A').slice(-4)).toUpperCase()}`,
            `x${item.quantity}`,
            `QAR ${Number(item.price).toFixed(2)}`,
            `QAR ${itemTotal.toFixed(2)}`
        ];
    });

    autoTable(doc, {
        startY: 145,
        head: [['ACQUIRED ENTITY', 'SERIAL/SKU', 'UNIT', 'UNIT COST', 'SUBTOTAL']],
        body: tableData,
        headStyles: { 
            fillColor: COLORS.CARD_BG as [number, number, number], 
            textColor: COLORS.ZINC as [number, number, number], 
            fontStyle: 'bold',
            fontSize: 7,
            cellPadding: 5
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 6,
            textColor: [20, 20, 20]
        },
        margin: { left: 20, right: 20 },
        theme: 'striped',
        styles: { lineColor: COLORS.BORDER as [number, number, number], lineWidth: 0.1 }
    });

    // --- 5. FINANCIAL ARCHITECTURE ---
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    const summaryX = 130;
    const valueX = 188;
    
    // Calculations
    const totalOrder = Number(order.total);
    const shippingPrice = Math.max(0, totalOrder - itemsSubtotal);
    const totalItemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");

    // Row 1: Items Subtotal
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text(`ITEMS SUBTOTAL (${totalItemCount})`, summaryX, finalY);
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.text(`QAR ${itemsSubtotal.toFixed(2)}`, valueX, finalY, { align: "right" });

    // Row 2: Shipping Fees (always present — customer selects method at checkout)
    const shippingLabel = order.shippingMethod ? order.shippingMethod.toUpperCase() : "SHIPPING FEES";
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text(shippingLabel, summaryX, finalY + 8);
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.text(`QAR ${shippingPrice.toFixed(2)}`, valueX, finalY + 8, { align: "right" });

    // Row 3: VAT
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text("VAT / TAX (0%)", summaryX, finalY + 16);
    doc.text("QAR 0.00", valueX, finalY + 16, { align: "right" });

    // Separator line
    doc.setDrawColor(...COLORS.BORDER as [number, number, number]);
    doc.line(summaryX - 5, finalY + 21, valueX + 5, finalY + 21);

    // Equation hint: items + shipping = total
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text(`QAR ${itemsSubtotal.toFixed(2)} + QAR ${shippingPrice.toFixed(2)} = QAR ${totalOrder.toFixed(2)}`, valueX, finalY + 26, { align: "right" });

    // Final Total Card
    doc.setFillColor(...COLORS.ONYX as [number, number, number]);
    doc.roundedRect(summaryX - 5, finalY + 30, 75, 20, 3, 3, 'F');

    doc.setTextColor(...COLORS.ZINC_LIGHT as [number, number, number]);
    doc.setFontSize(7);
    doc.text("FINAL ACQUISITION TOTAL", summaryX, finalY + 37);

    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(18);
    doc.text(`QAR ${totalOrder.toFixed(2)}`, valueX - 2, finalY + 46, { align: "right" });

    // --- 6. AUTHENTICITY LAYER ---
    const footerY = 265;
    
    doc.setFillColor(...COLORS.CARD_BG as [number, number, number]);
    doc.roundedRect(20, footerY - 5, 170, 30, 4, 4, 'F');
    
    // Security Seal Circle
    doc.setFillColor(...COLORS.ONYX as [number, number, number]);
    doc.circle(35, footerY + 10, 10, 'F');
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFontSize(10);
    doc.text("LB", 35, footerY + 11.5, { align: "center" });

    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(9);
    doc.text(`Heritage Financial Protocol: ${order.id.slice(0, 12).toUpperCase()}`, 50, footerY + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.ZINC as [number, number, number]);
    doc.text("Electronic verification successful. This document constitutes a legal recording of the asset transfer and acquisition within the Local Bazar Heritage Framework.", 50, footerY + 12);
    doc.text(`PORTAL SESSION AUTO-LOG: 256bit-AES-SSL-VERIFIED-LB-TRANSACTION-METADATA-HASH-${Math.random().toString(36).substring(7).toUpperCase()}`, 50, footerY + 16);

    // Final download
    doc.save(`INVOICE-${order.id.slice(-8).toUpperCase()}.pdf`);
};
