import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            credits: users.credits,
            createdAt: users.createdAt,
            isActive: users.isActive,
        })
            .from(users)
            .orderBy(desc(users.createdAt));

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
