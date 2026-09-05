import { NextResponse } from 'next/server';
import { runBootstrapping } from '@/lib/webr/pls-sem';

export async function GET() {
    console.log("Starting test-boot...");
    
    // Generate some dummy data that won't cause zero-variance errors
    const data: number[][] = [];
    for (let i = 0; i < 100; i++) {
        data.push([
            Math.random() * 5 + 1,
            Math.random() * 5 + 1,
            Math.random() * 5 + 1,
            Math.random() * 5 + 1
        ]);
    }

    const measurementModel = [
        { construct: "A", items: [0, 1] },
        { construct: "B", items: [2, 3] }
    ];
    const structuralModel = [
        { from: "A", to: "B" }
    ];

    try {
        console.log("Calling runBootstrapping...");
        const res = await runBootstrapping(data, measurementModel, structuralModel, 100);
        console.log("runBootstrapping succeeded!");
        return NextResponse.json(res);
    } catch (e: any) {
        console.error("runBootstrapping failed:", e);
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
