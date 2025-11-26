import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// GET user profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = parseInt(session.user.id);

        // Root admin fallback
        if (userId === 999) {
            return NextResponse.json({
                id: "999",
                name: "Root Admin",
                email: "hailp@ncskit.org",
                role: "admin",
                createdAt: new Date().toISOString(),
            });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Don't return password
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}

// UPDATE user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = parseInt(session.user.id);
        const body = await request.json();
        const { name, email, currentPassword, newPassword } = body;

        // Root admin can't be updated via API
        if (userId === 999) {
            return NextResponse.json(
                { error: "Root admin profile cannot be updated via API" },
                { status: 403 }
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update name
        if (name && name !== user.name) {
            await db.update(users)
                .set({ name, updatedAt: new Date() })
                .where(eq(users.id, userId));
        }

        // Update email (check if not taken)
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: "Invalid email format" },
                    { status: 400 }
                );
            }

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser && existingUser.id !== userId) {
                return NextResponse.json(
                    { error: "Email already taken" },
                    { status: 409 }
                );
            }

            await db.update(users)
                .set({ email, updatedAt: new Date() })
                .where(eq(users.id, userId));
        }

        // Update password (if provided)
        if (newPassword && currentPassword) {
            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 401 }
                );
            }

            // Validate new password
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: "New password must be at least 6 characters long" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.update(users)
                .set({ password: hashedPassword, updatedAt: new Date() })
                .where(eq(users.id, userId));
        }

        // Fetch updated user
        const updatedUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        const { password, ...userWithoutPassword } = updatedUser!;

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userWithoutPassword,
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}

