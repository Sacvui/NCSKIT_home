"use client";

import { useEffect, useState } from "react";

type FormattedDateProps = {
    date: string | Date;
    className?: string;
};

export function FormattedDate({ date, className }: FormattedDateProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Format: "November 27, 2025"
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    if (!mounted) {
        // Render the same thing on server to attempt a match, 
        // but if it fails, the client update will fix it without error because we handle mounted state?
        // Actually, to avoid hydration mismatch completely, we can render a consistent fallback 
        // or just render the formatted string if we are sure server uses same node version/locale.
        // But since server/client differ, let's strictly rely on this:
        return <span className={className} suppressHydrationWarning>{formatted}</span>;
    }

    return <span className={className}>{formatted}</span>;
}
