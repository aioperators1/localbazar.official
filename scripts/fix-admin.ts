import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const newPassword = "fjwhgyfw1323h";
    const hashedPassword = await hash(newPassword, 12);

    // Delete ALL existing admin users and create fresh
    await prisma.user.deleteMany({ where: { role: "ADMIN" } });
    console.log("Deleted old admin users");

    const admin = await prisma.user.create({
        data: {
            username: "adminlocal345",
            email: "admin-lb@localbazar.internal",
            name: "Admin",
            password: hashedPassword,
            role: "ADMIN",
        }
    });
    
    // Verify immediately
    const found = await prisma.user.findFirst({ where: { username: "adminlocal345" } });
    if (!found) { console.log("ERROR: Not found after creation"); return; }
    
    const valid = await compare(newPassword, found.password);
    console.log("\n=== RESULT ===");
    console.log("Created user ID:", admin.id);
    console.log("username:", found.username);
    console.log("email:", found.email);
    console.log("role:", found.role);
    console.log("Password valid:", valid);
    console.log("\n✅ Login with: adminlocal345 / fjwhgyfw1323h");
}

main().catch(e => console.error("FATAL:", e.message)).finally(() => prisma.$disconnect());
