import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && !session.user.permissions?.some((p: any) => p.id === 'products' && p.access === 'editor'))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const overrideBrandId = formData.get("brandId") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const workbook = xlsx.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return NextResponse.json({ error: "The provided Excel sheet is empty" }, { status: 400 });
        }

        let createdCount = 0;
        let updatedCount = 0;

        for (const row of data) {
            const rowId = row.ID ? String(row.ID).trim() : null;
            const nameEn = row.Name_EN ? String(row.Name_EN).trim() : "";
            const nameAr = row.Name_AR ? String(row.Name_AR).trim() : null;
            const descEn = row.Description_EN ? String(row.Description_EN).trim() : "";
            const descAr = row.Description_AR ? String(row.Description_AR).trim() : null;
            const price = parseFloat(row.Price) || 0;
            const salePrice = row.SalePrice ? parseFloat(row.SalePrice) : null;
            const stock = parseInt(row.Stock) || 0;
            const inStock = row.InStock === "TRUE" || row.InStock === true || row.InStock === 1;
            const rawImages = row.Images_URLs ? String(row.Images_URLs).trim() : "";
            // Convert to JSON array format if it's a plain URL or comma-separated URLs
            let images = rawImages;
            if (rawImages && !rawImages.startsWith("[")) {
                const urlList = rawImages.split(",").map((s: string) => s.trim()).filter(Boolean);
                images = JSON.stringify(urlList);
            }
            const categoryName = row.Category_Name ? String(row.Category_Name).trim() : null;
            const brandName = row.Brand_Name ? String(row.Brand_Name).trim() : null;

            if (!nameEn || price <= 0) {
                // Skip rows without minimum required fields
                continue;
            }

            // Map Category
            let categoryId = null;
            if (categoryName) {
                let category = await prisma.category.findFirst({
                    where: { name: { equals: categoryName, mode: 'insensitive' } }
                });
                if (!category) {
                    category = await prisma.category.create({
                        data: {
                            name: categoryName,
                            slug: String(categoryName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                        }
                    });
                }
                categoryId = category.id;
            }

            // Map Brand
            let finalBrandId = overrideBrandId && overrideBrandId !== "none" ? overrideBrandId : null;
            let finalBrandName = brandName;
            
            if (!finalBrandId && brandName) {
                let brand = await prisma.brand.findFirst({
                    where: { name: { equals: brandName, mode: 'insensitive' } }
                });
                if (!brand) {
                    brand = await prisma.brand.create({
                        data: {
                            name: brandName,
                            slug: String(brandName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                        }
                    });
                }
                finalBrandId = brand.id;
                finalBrandName = brand.name;
            }

            const productData = {
                name: nameEn,
                nameAr: nameAr,
                description: descEn,
                descriptionAr: descAr,
                price: price,
                salePrice: salePrice,
                stock: stock,
                inStock: inStock,
                images: images,
                categoryId: categoryId,
                brandId: finalBrandId,
                brandName: finalBrandName,
            };

            if (rowId) {
                // Update existing
                const existingProduct = await prisma.product.findUnique({ where: { id: rowId } });
                if (existingProduct) {
                    await prisma.product.update({
                        where: { id: rowId },
                        data: productData
                    });
                    updatedCount++;
                } else {
                    // Create if ID was provided but not found, though usually we shouldn't supply fake IDs. We'll generate slug.
                    await prisma.product.create({
                        data: {
                            ...productData,
                            slug: String(nameEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now()
                        }
                    });
                    createdCount++;
                }
            } else {
                // Create new
                await prisma.product.create({
                    data: {
                        ...productData,
                        slug: String(nameEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now()
                    }
                });
                createdCount++;
            }
        }

        return NextResponse.json({ 
            message: `Successfully processed! Created: ${createdCount}, Updated: ${updatedCount}.`,
            created: createdCount,
            updated: updatedCount
        });

    } catch (error: any) {
        console.error("[PRODUCTS_IMPORT]", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
