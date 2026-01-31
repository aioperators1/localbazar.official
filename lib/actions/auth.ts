"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (!username || !password || !email) {
        return { error: "Missing required fields" };
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return { error: "Username or Email already exists" };
        }

        const hashedPassword = await hash(password, 12);

        await prisma.user.create({
            data: {
                username,
                email,
                name: name || username,
                password: hashedPassword,
                role: "USER"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Failed to create account" };
    }
}
