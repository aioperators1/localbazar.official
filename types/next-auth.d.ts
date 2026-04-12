import { DefaultSession } from "next-auth"

export type AccessLevel = 'visitor' | 'editor';

export interface PagePermission {
    id: string;
    access: AccessLevel;
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            permissions?: PagePermission[] | null
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        permissions?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        permissions?: PagePermission[] | string | null
    }
}
