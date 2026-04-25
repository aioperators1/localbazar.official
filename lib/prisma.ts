import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismaV3: PrismaClient };

// RESILIENCE: If DATABASE_URL is missing during build (common on Vercel/Netlify), 
// we provide a dummy proxy to prevent the build from crashing when Next.js
// collects page data or attempts to prerender.
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL;

let prismaInstance: any;

try {
    if (isBuildTime && !process.env.DATABASE_URL) {
        // Return a proxy that handles any method call by returning a dummy promise
        prismaInstance = new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'then') return undefined;
                return new Proxy(() => Promise.resolve([]), {
                    get: (t, p) => {
                        if (p === 'then') return undefined;
                        if (p === 'aggregate' || p === 'count' || p === 'groupBy') return () => Promise.resolve({ _sum: { total: 0 }, _count: 0 });
                        if (p === 'findUnique' || p === 'findFirst') return () => Promise.resolve(null);
                        return () => Promise.resolve([]);
                    }
                });
            }
        });
    } else {
        prismaInstance = globalForPrisma.prismaV3 || new PrismaClient({
            log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        });
    }
} catch (e) {
    console.warn("Prisma initialization failed, using fallback proxy.");
    prismaInstance = new Proxy({}, { get: () => () => Promise.resolve([]) });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaV3 = prisma;
