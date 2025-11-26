import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);
                if (!credentials?.email || !credentials?.password) return null;

                // 0. Priority Fallback for Root Admin (hailp) - Bypasses DB check
                if (credentials.email === "hailp" && credentials.password === "123456") {
                    console.log("Root Admin login successful");
                    return { id: "999", name: "Root Admin", email: "hailp@ncskit.org", role: "admin" };
                }

                // 0. Priority Fallback for Demo User
                if (credentials.email === "demo@ncskit.org" && credentials.password === "demo123") {
                    console.log("Demo User login successful");
                    return { id: "0", name: "Demo User", email: "demo@ncskit.org", role: "admin" };
                }

                try {
                    // 1. Check if user exists in database
                    const user = await db.query.users.findFirst({
                        where: eq(users.email, credentials.email),
                    });

                    // 2. If user exists, verify password
                    if (user && user.password) {
                        const isValid = await bcrypt.compare(credentials.password, user.password);
                        if (isValid) {
                            return {
                                id: user.id.toString(),
                                name: user.name,
                                email: user.email,
                                role: user.role || "user",
                            };
                        }
                    }
                } catch (error: any) {
                    console.error("Database error (will use fallback):", error?.message || error);
                    // Continue to fallback if DB fails - don't throw error
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
};
