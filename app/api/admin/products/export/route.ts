import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && !session.user.permissions?.some((p: any) => p.id === 'products' && p.access === 'editor'))) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const brandId = searchParams.get("brandId");
        const isTemplate = searchParams.get("template") === "true";

        const headers = [
            "ID",
            "Name_EN",
            "Name_AR",
            "Description_EN",
            "Description_AR",
            "Price",
            "SalePrice",
            "Category_Name",
            "Brand_Name",
            "Stock",
            "InStock",
            "Images_URLs"
        ];

        let dataToExport: any[] = [];

        if (isTemplate) {
            let prefilledBrandName = "";
            if (brandId && brandId !== "all") {
                const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { name: true } });
                if (brand) prefilledBrandName = brand.name;
            }
            
            // Add one empty row with the brand name pre-filled
            dataToExport = [{
                ID: "",
                Name_EN: "",
                Name_AR: "",
                Description_EN: "",
                Description_AR: "",
                Price: "",
                SalePrice: "",
                Category_Name: "",
                Brand_Name: prefilledBrandName,
                Stock: "",
                InStock: "",
                Images_URLs: ""
            }];
        } else {
            const where: any = {};
            if (brandId && brandId !== "all") {
                where.brandId = brandId;
            }

            const products = await prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                },
                orderBy: { createdAt: 'desc' }
            });

            dataToExport = products.map((p: any) => ({
                ID: p.id,
                Name_EN: (p.name || "").substring(0, 32000),
                Name_AR: (p.nameAr || "").substring(0, 32000),
                Description_EN: (p.description || "").substring(0, 32000),
                Description_AR: (p.descriptionAr || "").substring(0, 32000),
                Price: Number(p.price),
                SalePrice: p.salePrice ? Number(p.salePrice) : "",
                Category_Name: (p.category?.name || "").substring(0, 32000),
                Brand_Name: (p.brand?.name || p.brandName || "").substring(0, 32000),
                Stock: p.stock,
                InStock: p.inStock ? "TRUE" : "FALSE",
                Images_URLs: (p.images || "").substring(0, 32000)
            }));
        }

        const worksheet = xlsx.utils.json_to_sheet(dataToExport, { header: headers });
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="products_export.xlsx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error: any) {
        console.error("[PRODUCTS_EXPORT]", error);
        return new NextResponse(error.stack || error.message || "Internal Error", { status: 500 });
    }
}
