import { PrismaClient } from "../prisma/generated/client";

const globalForPrisma = global as unknown as { prismaNew: PrismaClient };

export const prisma =
    globalForPrisma.prismaNew ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaNew = prisma;
