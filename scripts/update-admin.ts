import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const newUsername = "adminlocal345";
    const newPassword = "fjwhgyfw1323h";

    const hashedPassword = await hash(newPassword, 12);

    // Find the existing admin user
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    });

    if (admin) {
        await prisma.user.update({
            where: { id: admin.id },
            data: {
                username: newUsername,
                email: `${newUsername}@localbazar.qa`,
                name: "Admin",
                password: hashedPassword,
            }
        });
        console.log("✅ Admin credentials updated successfully!");
        console.log(`   Username: ${newUsername}`);
        console.log(`   Password: ${newPassword}`);
    } else {
        // Create new admin user if none exists
        await prisma.user.create({
            data: {
                username: newUsername,
                email: `${newUsername}@localbazar.qa`,
                name: "Admin",
                password: hashedPassword,
                role: "ADMIN",
            }
        });
        console.log("✅ Admin user created successfully!");
        console.log(`   Username: ${newUsername}`);
        console.log(`   Password: ${newPassword}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
