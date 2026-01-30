"use client";

import type { BlogMeta } from "@/types/blog";

interface BlogPostSchemaProps {
    meta: BlogMeta;
    content?: string;
}

/**
 * Generates JSON-LD structured data for blog articles
 * Follows schema.org BlogPosting specification for rich search results
 */
export function BlogPostSchema({ meta, content }: BlogPostSchemaProps) {
    const baseUrl = "https://ncskit.org";
    const articleUrl = `${baseUrl}${meta.href}`;

    // Estimate word count for reading time (approx 200 words per minute)
    const wordCount = content ? content.split(/\s+/).length : meta.readTime ? parseInt(meta.readTime) * 200 : 1000;

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        "headline": meta.title,
        "description": meta.seoDescription || meta.summary,
        "image": meta.image
            ? [`${baseUrl}${meta.image}`]
            : [`${baseUrl}/assets/logo.png`],
        "author": {
            "@type": "Person",
            "name": meta.author || "NCSKIT Team",
            "url": baseUrl,
        },
        "publisher": {
            "@type": "Organization",
            "name": "NCSKIT",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/assets/logo.png`,
                "width": 600,
                "height": 200,
            },
        },
        "datePublished": meta.date,
        "dateModified": meta.updated || meta.date,
        "keywords": meta.tags?.join(", ") || "",
        "articleSection": meta.category || "Research",
        "inLanguage": meta.lang || "vi",
        "wordCount": wordCount,
        "isAccessibleForFree": true,
        "license": "https://creativecommons.org/licenses/by/4.0/",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Breadcrumb schema for navigation hierarchy
 */
interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const baseUrl = "https://ncskit.org";

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${baseUrl}${item.href}`,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Combined SEO component for blog articles
 */
interface BlogSEOProps {
    meta: BlogMeta;
    content?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export function BlogSEO({ meta, content, breadcrumbs }: BlogSEOProps) {
    const defaultBreadcrumbs: BreadcrumbItem[] = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: meta.title, href: meta.href },
    ];

    return (
        <>
            <BlogPostSchema meta={meta} content={content} />
            <BreadcrumbSchema items={breadcrumbs || defaultBreadcrumbs} />
        </>
    );
}
