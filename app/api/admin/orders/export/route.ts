import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && !session.user.permissions?.some((p: any) => p.id === 'orders' && p.access === 'editor'))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startDateStr = searchParams.get("startDate");
        const endDateStr = searchParams.get("endDate");

        const where: any = {};
        
        if (startDateStr || endDateStr) {
            where.createdAt = {};
            if (startDateStr) {
                where.createdAt.gte = new Date(startDateStr);
            }
            if (endDateStr) {
                where.createdAt.lte = new Date(endDateStr);
            }
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    include: {
                        addresses: {
                            take: 1,
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                },
                assignedDriver: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        // Compute total revenue for the export
        let totalRevenue = 0;
        orders.forEach((o: any) => {
            totalRevenue += Number(o.total);
        });

        const dataToExport = orders.map((o: any) => {
            const itemsSummary = o.items.map((i: any) => `${i.quantity}x ${i.product?.name || 'Unknown'} (Size: ${i.size || 'N/A'}, Color: ${i.color || 'N/A'})`).join(' | ');

            return {
                "Order ID": o.id,
                "Date": new Date(o.createdAt).toLocaleString(),
                "Status": o.status,
                "Customer Name": o.user?.name || "Guest",
                "Customer Email": o.user?.email || "-",
                "Customer Phone": o.phone || "-",
                "Country": o.user?.addresses?.[0]?.country || "-",
                "City": o.user?.addresses?.[0]?.city || "-",
                "Building No": o.user?.addresses?.[0]?.buildingNo || "-",
                "Street": o.user?.addresses?.[0]?.street || "-",
                "Zone No": o.user?.addresses?.[0]?.zoneNo || "-",
                "Total Revenue (QAR)": Number(o.total),
                "Payment Method": o.paymentMethod,
                "Payment ID": o.paymentId || "-",
                "Driver": o.assignedDriver?.name || "Unassigned",
                "Shipping Method": o.shippingMethod || "-",
                "Items": itemsSummary
            };
        });

        // Add a summary row at the bottom for total revenue
        dataToExport.push({
            "Order ID": "SUMMARY",
            "Date": "-",
            "Status": "-",
            "Customer Name": "-",
            "Customer Email": "-",
            "Customer Phone": "-",
            "Country": "-",
            "City": "-",
            "Building No": "-",
            "Street": "-",
            "Zone No": "-",
            "Total Revenue (QAR)": totalRevenue as any,
            "Payment Method": "-",
            "Payment ID": "-",
            "Driver": "-",
            "Shipping Method": "-",
            "Items": `Total Orders: ${orders.length}`
        });

        const worksheet = xlsx.utils.json_to_sheet(dataToExport);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Orders Analytics");

        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        const qatarDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Qatar' });

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="localbazar_orders_${qatarDate}.xlsx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error: any) {
        console.error("[ORDERS_EXPORT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
