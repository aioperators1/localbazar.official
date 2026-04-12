import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismaV3: PrismaClient };

export const prisma =
    globalForPrisma.prismaV3 ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaV3 = prisma;
