"use client";

import { CSSProperties } from "react";

/**
 * Skeleton loading component for perceived performance
 * Displays animated placeholder while content is loading
 */

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    style?: CSSProperties;
    variant?: "text" | "circular" | "rectangular" | "rounded";
    animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
    className = "",
    width,
    height,
    borderRadius,
    style,
    variant = "rectangular",
    animation = "pulse",
}: SkeletonProps) {
    const getVariantStyles = (): CSSProperties => {
        switch (variant) {
            case "text":
                return { borderRadius: "4px", height: height || "1em" };
            case "circular":
                return { borderRadius: "50%" };
            case "rounded":
                return { borderRadius: borderRadius || "12px" };
            default:
                return { borderRadius: borderRadius || "4px" };
        }
    };

    const baseStyles: CSSProperties = {
        display: "block",
        backgroundColor: "var(--color-border, rgba(15, 23, 42, 0.08))",
        width: width || "100%",
        height: height || "20px",
        ...getVariantStyles(),
        ...style,
    };

    return (
        <span
            className={`skeleton skeleton-${animation} ${className}`}
            style={baseStyles}
            aria-hidden="true"
        />
    );
}

/**
 * Card skeleton for blog posts and feature cards
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`component-card ${className}`}>
            <Skeleton variant="rounded" height={200} className="mb-4" />
            <Skeleton variant="text" width="60%" height={12} className="mb-2" />
            <Skeleton variant="text" height={24} className="mb-3" />
            <Skeleton variant="text" height={16} className="mb-2" />
            <Skeleton variant="text" height={16} width="80%" className="mb-4" />
            <div className="flex gap-2">
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
            </div>
        </div>
    );
}

/**
 * Blog grid skeleton
 */
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="blog-grid">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Article skeleton for blog post loading
 */
export function ArticleSkeleton() {
    return (
        <div className="container section-container">
            <div className="component-card mb-12">
                <Skeleton variant="text" width={100} height={14} className="mb-4" />
                <Skeleton variant="text" height={48} className="mb-4" />
                <Skeleton variant="text" height={20} width="70%" className="mb-6" />
                <Skeleton variant="rounded" height={400} className="mb-6" />
                <div className="flex gap-4">
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={120} height={16} />
                </div>
            </div>

            <div className="prose max-w-none">
                <Skeleton variant="text" height={32} className="mb-6" />
                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} width="90%" className="mb-6" />

                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} width="85%" className="mb-6" />

                <Skeleton variant="rounded" height={300} className="mb-6" />

                <Skeleton variant="text" height={28} width="60%" className="mb-4" />
                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} className="mb-2" />
                <Skeleton variant="text" height={18} width="75%" />
            </div>
        </div>
    );
}

/**
 * Table skeleton for data tables
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="analysis-table-wrapper">
            <div className="analysis-table-header">
                <Skeleton variant="text" width={200} height={24} />
                <Skeleton variant="rounded" width={80} height={28} />
            </div>
            <div className="overflow-x-auto">
                <table className="analysis-table w-full">
                    <thead>
                        <tr>
                            {Array.from({ length: cols }).map((_, i) => (
                                <th key={i} className="p-3">
                                    <Skeleton variant="text" height={14} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: cols }).map((_, colIndex) => (
                                    <td key={colIndex} className="p-3">
                                        <Skeleton variant="text" height={16} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/**
 * Hero skeleton for homepage
 */
export function HeroSkeleton() {
    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <Skeleton variant="text" width={150} height={14} className="mb-4" />
                    <Skeleton variant="text" height={56} className="mb-2" />
                    <Skeleton variant="text" height={56} width="80%" className="mb-6" />
                    <Skeleton variant="text" height={20} className="mb-2" />
                    <Skeleton variant="text" height={20} width="90%" className="mb-6" />
                    <div className="flex gap-4">
                        <Skeleton variant="rounded" width={180} height={48} />
                        <Skeleton variant="rounded" width={140} height={48} />
                    </div>
                </div>
                <div className="hero-demo">
                    <Skeleton variant="rounded" height={400} />
                </div>
            </div>
        </section>
    );
}
