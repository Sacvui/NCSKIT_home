import React from 'react';

export function ResultSkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-6">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>

            {/* Stats row skeleton */}
            <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>

            {/* Chart skeleton */}
            <div className="h-64 bg-gray-200 rounded"></div>

            {/* Table skeleton */}
            <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
            </div>
        </div>
    );
}
