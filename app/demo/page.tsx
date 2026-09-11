'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { AnalyzeModule } from '@/components/analyze/AnalyzeModule';

export default function DemoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent shadow-sm"></div>
            </div>
        }>
            <AnalyzeModule isDemo={true} />
        </Suspense>
    );
}
