import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const newUsername = "adminlocal345";
    const newPassword = "fjwhgyfw1323h";
    const hashedPassword = await hash(newPassword, 12);

    // Show all users before
    const all = await prisma.user.findMany({ select: { id: true, username: true, email: true, role: true } });
    console.log("Users:", JSON.stringify(all, null, 2));

    // Update the admin user — find by ADMIN role
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    
    if (admin) {
        const updated = await prisma.user.update({
            where: { id: admin.id },
            data: {
                username: newUsername,
                password: hashedPassword,
                role: "ADMIN",
                name: "Admin",
            }
        });
        console.log("\n✅ Updated:", updated.username, updated.email, updated.role);
    } else {
        // No admin at all - create one with a unique email
        const created = await prisma.user.create({
            data: {
                username: newUsername,
                email: "admin@localbazar.internal",
                name: "Admin",
                password: hashedPassword,
                role: "ADMIN",
            }
        });
        console.log("\n✅ Created:", created.username, created.role);
    }
}

main().catch(e => { console.error("ERROR:", e.message); }).finally(() => prisma.$disconnect());
