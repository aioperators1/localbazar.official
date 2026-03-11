import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
    console.log("Starting product cleanup...");

    try {
        // Find categories that should be removed
        const categoriesToRemove = await prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: "PC" } },
                    { name: { contains: "Composants" } },
                    { name: { contains: "Informatique" } },
                    { name: { contains: "Electronics" } },
                    { name: { contains: "Gamer" } }
                ]
            }
        });

        const categoryIds = categoriesToRemove.map(c => c.id);
        console.log(`Found ${categoryIds.length} electronics categories.`);

        // Delete products in these categories OR products with electronics-keywords in name
        const deletedProducts = await prisma.product.deleteMany({
            where: {
                OR: [
                    { categoryId: { in: categoryIds } },
                    { name: { contains: "Ryzen" } },
                    { name: { contains: "Intel" } },
                    { name: { contains: "NVIDIA" } },
                    { name: { contains: "RTX" } },
                    { name: { contains: "RAM" } },
                    { name: { contains: "SSD" } },
                    { name: { contains: "Motherboard" } },
                    { name: { contains: "Laptop" } },
                    { name: { contains: "Victus" } }
                ]
            }
        });

        console.log(`Successfully deleted ${deletedProducts.count} electronics products.`);

        // Also cleanup categories if they are empty now
        const remainingProducts = await prisma.product.findMany({
            select: { categoryId: true }
        });
        const activeCategoryIds = new Set(remainingProducts.map(p => p.categoryId));

        const emptyCategories = await prisma.category.deleteMany({
            where: {
                id: { notIn: Array.from(activeCategoryIds) },
                OR: [
                    { name: { contains: "PC" } },
                    { name: { contains: "Composants" } },
                    { name: { contains: "Informatique" } }
                ]
            }
        });

        console.log(`Successfully deleted ${emptyCategories.count} empty electronics categories.`);

    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
