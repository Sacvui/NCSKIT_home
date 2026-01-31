"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPostMeta } from "@/types/blog";
import { useMemo } from "react";

interface RelatedPostsProps {
    currentPost: BlogPostMeta;
    allPosts: BlogPostMeta[];
    maxPosts?: number;
}

/**
 * Calculate similarity score between two posts
 * Based on: category, tags, and title keywords
 */
function calculateSimilarity(post1: BlogPostMeta, post2: BlogPostMeta): number {
    let score = 0;

    // Same category = high relevance
    if (post1.category === post2.category) {
        score += 30;
    }

    // Matching tags
    const tags1 = new Set(post1.tags || []);
    const tags2 = post2.tags || [];
    const matchingTags = tags2.filter((tag) => tags1.has(tag)).length;
    score += matchingTags * 15;

    // Title word similarity (basic)
    const words1 = new Set(
        post1.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    );
    const words2 = post2.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchingWords = words2.filter((word) => words1.has(word)).length;
    score += matchingWords * 5;

    // Recency boost (newer posts get slight preference)
    const date1 = new Date(post1.date).getTime();
    const date2 = new Date(post2.date).getTime();
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) score += 10;
    else if (daysDiff < 90) score += 5;

    return score;
}

export function RelatedPosts({ currentPost, allPosts, maxPosts = 3 }: RelatedPostsProps) {
    const relatedPosts = useMemo(() => {
        return allPosts
            .filter((post) => post.slug !== currentPost.slug)
            .map((post) => ({
                post,
                score: calculateSimilarity(currentPost, post),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, maxPosts)
            .map(({ post }) => post);
    }, [currentPost, allPosts, maxPosts]);

    if (relatedPosts.length === 0) return null;

    return (
        <section className="related-posts-section">
            <h3 className="related-posts-title">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
                Related Articles
            </h3>
            <div className="related-posts-grid">
                {relatedPosts.map((post, index) => (
                    <motion.article
                        key={post.slug}
                        className="related-post-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={post.href} className="related-post-link">
                            <span className="related-post-category">
                                {post.categoryLabel || post.category}
                            </span>
                            <h4 className="related-post-title">{post.title}</h4>
                            <p className="related-post-summary">{post.summary}</p>
                            <div className="related-post-meta">
                                <span>{post.readingTime}</span>
                                <span className="related-post-arrow">
                                    Read more →
                                </span>
                            </div>
                        </Link>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
