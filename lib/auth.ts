
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET || "super_secret_key_123_456",
    pages: {
        signIn: "/admin/login", // Redirect to admin login by default
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("[Auth] Attempting login for:", credentials?.username);

                    if (!credentials?.username || !credentials?.password) {
                        console.warn("[Auth] Login attempt with missing credentials");
                        return null;
                    }

                    // Attempt to find user by username OR email
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { username: credentials.username },
                                { email: credentials.username }
                            ]
                        }
                    });

                    if (!user) {
                        console.warn("[Auth] No user found with identifier:", credentials.username);
                        return null;
                    }

                    console.log("[Auth] User found, verifying password for:", user.username);

                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        console.warn("[Auth] Invalid password for user:", user.username);
                        return null;
                    }

                    console.log("[Auth] Successfully authenticated:", user.username, "Role:", user.role);

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("[Auth] Critical error during authorization:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.picture = user.image;
            }
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.image = token.picture as string;
            }
            return session;
        }
    },
};
