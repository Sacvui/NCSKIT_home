"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPostMeta } from "@/types/blog";

interface BlogSearchProps {
    posts: BlogPostMeta[];
    placeholder?: string;
}

export function BlogSearch({ posts, placeholder = "Search articles..." }: BlogSearchProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize Fuse.js for fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: [
                { name: "title", weight: 0.4 },
                { name: "summary", weight: 0.3 },
                { name: "tags", weight: 0.2 },
                { name: "categoryLabel", weight: 0.1 },
            ],
            threshold: 0.3,
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 2,
        });
    }, [posts]);

    // Search results
    const results = useMemo(() => {
        if (!query.trim()) return [];
        return fuse.search(query).slice(0, 8);
    }, [fuse, query]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen || results.length === 0) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        window.location.href = results[selectedIndex].item.href;
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    setQuery("");
                    inputRef.current?.blur();
                    break;
            }
        },
        [isOpen, results, selectedIndex]
    );

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    // Highlight matching text
    const highlightMatch = (text: string, indices: readonly [number, number][] | undefined) => {
        if (!indices || indices.length === 0) return text;

        const parts: JSX.Element[] = [];
        let lastIndex = 0;

        indices.forEach(([start, end], i) => {
            if (start > lastIndex) {
                parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
            }
            parts.push(
                <mark key={`match-${i}`} className="search-highlight">
                    {text.slice(start, end + 1)}
                </mark>
            );
            lastIndex = end + 1;
        });

        if (lastIndex < text.length) {
            parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
        }

        return <>{parts}</>;
    };

    return (
        <div ref={containerRef} className="blog-search-container">
            <div className="search-input-wrapper">
                <svg
                    className="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="search-input"
                    aria-label="Search articles"
                    aria-expanded={isOpen}
                    aria-controls="search-results"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="search-clear"
                        aria-label="Clear search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                )}
                <kbd className="search-shortcut">⌘K</kbd>
            </div>

            <AnimatePresence>
                {isOpen && query.trim() && (
                    <motion.div
                        id="search-results"
                        className="search-results"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {results.length > 0 ? (
                            <>
                                <div className="search-results-header">
                                    <span>{results.length} result{results.length > 1 ? "s" : ""}</span>
                                    <span className="search-hint">↑↓ navigate • Enter select • Esc close</span>
                                </div>
                                <ul className="search-results-list" role="listbox">
                                    {results.map((result, index) => {
                                        const titleMatch = result.matches?.find((m) => m.key === "title");
                                        return (
                                            <li
                                                key={result.item.slug}
                                                role="option"
                                                aria-selected={index === selectedIndex}
                                            >
                                                <Link
                                                    href={result.item.href}
                                                    className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                >
                                                    <div className="search-result-content">
                                                        <span className="search-result-category">
                                                            {result.item.categoryLabel || result.item.category}
                                                        </span>
                                                        <h4 className="search-result-title">
                                                            {titleMatch
                                                                ? highlightMatch(result.item.title, titleMatch.indices)
                                                                : result.item.title}
                                                        </h4>
                                                        <p className="search-result-summary">{result.item.summary}</p>
                                                        <div className="search-result-meta">
                                                            <span>{result.item.readingTime}</span>
                                                            {result.item.tags?.slice(0, 3).map((tag) => (
                                                                <span key={tag} className="search-result-tag">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <svg
                                                        className="search-result-arrow"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="m9 18 6-6-6-6" />
                                                    </svg>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        ) : (
                            <div className="search-no-results">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                    <path d="M8 8h6" />
                                </svg>
                                <p>No articles found for &ldquo;{query}&rdquo;</p>
                                <span>Try different keywords or browse categories below</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
