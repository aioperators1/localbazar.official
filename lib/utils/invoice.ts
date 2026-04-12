"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceOrder {
    id: string;
    createdAt: string | Date;
    paymentMethod: string;
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
        ONYX: [24, 24, 24],
        GOLD: [184, 134, 11],
        BURGUNDY: [89, 44, 47],
        SILVER: [200, 200, 200],
        WHITE: [255, 255, 255],
        LIGHT_GRAY: [250, 250, 250],
        BORDER: [230, 230, 230]
    };

    // --- 1. PREMIUM HEADER ---
    // Dark background banner
    doc.setFillColor(...COLORS.ONYX as [number, number, number]);
    doc.rect(0, 0, 210, 55, 'F');
    
    // Logo / Brand
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("LOCAL BAZAR", 20, 28);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.SILVER as [number, number, number]);
    doc.text("EXCELLENCE • HERITAGE • LUXURY PORTAL", 20, 35);

    // Store Info (Right Aligned in Header)
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.setFontSize(8);
    doc.text(settings?.storeAddress || "Luxury District, Doha, Qatar", 190, 22, { align: "right" });
    doc.text(settings?.contactPhone || "+974 5055 8884", 190, 27, { align: "right" });
    doc.text(settings?.contactEmail || "localbazar.qtr@gmail.com", 190, 32, { align: "right" });
    doc.text("www.localbazar.qa", 190, 37, { align: "right" });

    // --- 2. INVOICE OVERVIEW ---
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL INVOICE", 190, 80, { align: "right" });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`REFERENCE ID:`, 190, 90, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`${order.id.toUpperCase()}`, 190, 95, { align: "right" });
    
    doc.setFont("helvetica", "bold");
    doc.text(`DATE OF ISSUE:`, 190, 105, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 190, 110, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(`PAYMENT METHOD:`, 190, 120, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`${order.paymentMethod === 'COD' ? 'CASH ON DELIVERY' : order.paymentMethod}`, 190, 125, { align: "right" });

    // --- 3. CUSTOMER / SHIPPING DETAILS ---
    // Client Info Box
    doc.setFillColor(...COLORS.LIGHT_GRAY as [number, number, number]);
    doc.rect(20, 75, 80, 55, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PRESTIGE CLIENT:", 25, 85);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${order.user?.name || "Distinguished Guest"}`, 25, 93);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`${order.user?.email || ""}`, 25, 98);

    // Delivery Logistics
    const shippingAddr = order.user?.addresses?.[0] || order.shippingAddress;
    if (shippingAddr) {
        doc.setTextColor(...COLORS.ONYX as [number, number, number]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("DELIVERY LOGISTICS:", 25, 108);
        doc.setFont("helvetica", "normal");
        doc.text(`${shippingAddr.street || shippingAddr.line1 || ""}`, 25, 114);
        doc.text(`${shippingAddr.city || ""}, ${shippingAddr.zip || ""}`, 25, 119);
        doc.setFont("helvetica", "bold");
        doc.text(`${shippingAddr.country || "QATAR"}`, 25, 124);
    }

    // --- 4. ITEMS TABLE ---
    const tableData = order.items.map((item) => [
        { content: item.product.name.toUpperCase(), styles: { fontStyle: 'bold' as const } },
        item.product.sku || 'N/A',
        item.quantity,
        `QAR ${Number(item.price).toFixed(2)}`,
        `QAR ${(item.quantity * Number(item.price)).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 145,
        head: [['DESCRIPTION', 'SKU', 'QTY', 'UNIT PRICE', 'SUBTOTAL']],
        body: tableData,
        headStyles: { 
            fillColor: COLORS.ONYX as [number, number, number], 
            textColor: COLORS.WHITE as [number, number, number], 
            fontStyle: 'bold',
            fontSize: 8,
            cellPadding: 5
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 4,
            textColor: [40, 40, 40]
        },
        alternateRowStyles: { 
            fillColor: [253, 253, 253] 
        },
        margin: { left: 20, right: 20 },
        theme: 'grid',
        styles: { lineColor: COLORS.BORDER as [number, number, number], lineWidth: 0.1 }
    });

    // --- 5. FINANCIAL SUMMARY ---
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    
    // Summary Layout (Right Side)
    const summaryX = 130;
    const valueX = 190;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("SUBTOTAL:", summaryX, finalY);
    doc.text(`QAR ${Number(order.total).toFixed(2)}`, valueX, finalY, { align: "right" });
    
    doc.text("TAXES & DUTIES (0%):", summaryX, finalY + 7);
    doc.text("QAR 0.00", valueX, finalY + 7, { align: "right" });

    doc.text("SHIPPING (EXPRESS):", summaryX, finalY + 14);
    doc.text("COMPLIMENTARY", valueX, finalY + 14, { align: "right" });

    // Total Highlighter
    doc.setFillColor(...COLORS.ONYX as [number, number, number]);
    doc.rect(summaryX - 5, finalY + 19, 65, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.WHITE as [number, number, number]);
    doc.text("TOTAL DUE:", summaryX, finalY + 27);
    doc.setFontSize(12);
    doc.text(`QAR ${Number(order.total).toFixed(2)}`, valueX, finalY + 27, { align: "right" });

    // --- 6. FOOTER / LEGAL ---
    const footerY = 270;
    
    // Signature Area
    doc.setTextColor(...COLORS.ONYX as [number, number, number]);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text("Verified by Local Bazar Management", 190, footerY - 10, { align: "right" });
    doc.text("________________________________", 190, footerY - 8, { align: "right" });

    // Legal & Contact
    doc.setDrawColor(...COLORS.BORDER as [number, number, number]);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, 190, footerY);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    const footerText = "Thank you for choosing Local Bazar. We curate the finest legacy pieces for your sophisticated collection. This document is electronically verified for authenticity and serves as a formal proof of transfer. All items are authenticated prior to dispatch. For inquiries, contact our concierge via support@localbazar.qa";
    const splitText = doc.splitTextToSize(footerText, 170);
    doc.text(splitText, 20, footerY + 5);

    doc.setFont("helvetica", "bold");
    doc.text(`PORTAL ID: LB-SEC-${order.id.slice(-6).toUpperCase()}-${new Date().getFullYear()}`, 20, footerY + 20);

    // Final download
    doc.save(`INVOICE-${order.id.slice(-8).toUpperCase()}.pdf`);
};
