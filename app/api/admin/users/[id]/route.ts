import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { role, credits, isActive } = body;

        const updates: any = {};
        if (role !== undefined) updates.role = role;
        if (credits !== undefined) updates.credits = credits;
        if (isActive !== undefined) updates.isActive = isActive;

        await db.update(users)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
