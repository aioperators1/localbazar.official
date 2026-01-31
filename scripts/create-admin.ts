
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await hash("password123", 12);

    const user = await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            password,
            role: "ADMIN",
            email: "admin@electroislam.com",
        },
        create: {
            username: "admin",
            name: "Master Admin",
            email: "admin@electroislam.com",
            password,
            role: "ADMIN",
        },
    });

    console.log("Admin user created/updated:", user);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
