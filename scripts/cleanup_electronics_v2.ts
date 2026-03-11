import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
    console.log("Starting Robust Electronics Cleanup...");

    try {
        // 1. Delete all products with electronics keywords in name or category
        const deletedProducts = await prisma.product.deleteMany({
            where: {
                OR: [
                    { name: { contains: "PC", mode: "insensitive" } },
                    { name: { contains: "Ryzen", mode: "insensitive" } },
                    { name: { contains: "Intel", mode: "insensitive" } },
                    { name: { contains: "RTX", mode: "insensitive" } },
                    { name: { contains: "SSD", mode: "insensitive" } },
                    { name: { contains: "RAM", mode: "insensitive" } },
                    { name: { contains: "Motherboard", mode: "insensitive" } },
                    { name: { contains: "Monitor", mode: "insensitive" } },
                    { name: { contains: "Gaming", mode: "insensitive" } },
                    { name: { contains: "HP Victus", mode: "insensitive" } },
                    { name: { contains: "Innovation IT", mode: "insensitive" } },
                    { name: { contains: "Energy Sistem", mode: "insensitive" } },
                    { name: { contains: "DIGITUS", mode: "insensitive" } },
                    { category: { name: { contains: "Components", mode: "insensitive" } } },
                    { category: { name: { contains: "Audio", mode: "insensitive" } } },
                    { category: { name: { contains: "Monitors", mode: "insensitive" } } },
                    { category: { name: { contains: "Peripherals", mode: "insensitive" } } },
                    { category: { name: { contains: "Laptops", mode: "insensitive" } } }
                ]
            }
        });

        console.log(`Successfully deleted ${deletedProducts.count} electronics products.`);

        // 2. Delete the electronics categories
        const deletedCategories = await prisma.category.deleteMany({
            where: {
                OR: [
                    { name: { contains: "Components", mode: "insensitive" } },
                    { name: { contains: "Audio", mode: "insensitive" } },
                    { name: { contains: "Monitors", mode: "insensitive" } },
                    { name: { contains: "Peripherals", mode: "insensitive" } },
                    { name: { contains: "Laptops", mode: "insensitive" } },
                    { name: { contains: "Screen Space", mode: "insensitive" } },
                    { name: { contains: "Ordi Space", mode: "insensitive" } }
                ]
            }
        });

        console.log(`Successfully deleted ${deletedCategories.count} electronics categories.`);

    } catch (error) {
        console.error("Critical error during robust cleanup:", error);
    } finally {
        await prisma.$disconnect();
        console.log("Cleanup process finished.");
    }
}

cleanup();
