import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        console.log("DB Object:", db);
        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
    }
}
