
"use server";

import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { setDriverToken } from "@/lib/driver-auth";

export async function loginDriver(phone: string, password: string) {
    try {
        const driver = await prisma.driver.findUnique({
            where: { phone }
        });

        if (!driver || !driver.active) {
            return { success: false, error: "Access Denied: Invalid credentials or inactive account." };
        }

        const isPasswordValid = await compare(password, driver.password);
        if (!isPasswordValid) {
            return { success: false, error: "Access Denied: Invalid credentials." };
        }

        // Set secure JWT cookie
        await setDriverToken(driver.id, driver.name);

        return { success: true };
    } catch (error) {
        console.error("Login Driver Error:", error);
        return { success: false, error: "A system error occurred during login." };
    }
}
