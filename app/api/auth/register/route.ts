import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        try {
            // Check if user already exists
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 409 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const [newUser] = await db.insert(users).values({
                name,
                email,
                password: hashedPassword,
                role: "user",
                isActive: true,
            }).returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });

            return NextResponse.json(
                {
                    message: "User registered successfully",
                    user: newUser,
                },
                { status: 201 }
            );
        } catch (dbError: any) {
            console.error("Database error during registration:", dbError);

            // Check if it's a connection error
            // Check if it's a connection error
            const isConnectionError =
                dbError.code === 'ECONNREFUSED' ||
                dbError.code === 'ENOTFOUND' ||
                dbError.message?.includes('connect') ||
                dbError.message?.includes('connection') ||
                dbError.message?.includes('Postgres');

            if (isConnectionError) {
                return NextResponse.json(
                    {
                        error: "Database connection failed",
                        message: "The application is running without a valid database connection. Registration requires a PostgreSQL database.",
                        hint: "You can still log in using the demo account: demo@ncskit.org / demo123"
                    },
                    { status: 503 }
                );
            }

            throw dbError; // Re-throw to be caught by outer catch
        }
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                error: "Registration failed",
                message: error.message || "Internal server error",
                hint: "Please contact support if this persists"
            },
            { status: 500 }
        );
    }
}

