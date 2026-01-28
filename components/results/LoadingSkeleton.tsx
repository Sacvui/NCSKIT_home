'use client';

import React from 'react';

/**
 * Loading Skeleton Component
 * Displays animated placeholder while lazy-loaded components are loading
 */
export function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>

            {/* Main content skeleton */}
            <div className="space-y-4">
                <div className="h-64 bg-gray-100 rounded"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
            </div>

            {/* Additional content skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-100 rounded"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
            </div>
        </div>
    );
}

export default LoadingSkeleton;
