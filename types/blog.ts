import type { ReactNode } from "react";
import type { BlogGroup } from "@/lib/content";

export type BlogFrontmatter = {
  title: string;
  slug?: string;
  summary: string;
  seoDescription: string;
  group: BlogGroup;
  groupLabel?: string;
  category: string;
  categoryLabel?: string;
  tags?: string[];
  date: string;
  updated?: string;
  cover?: string;
  authors?: string[];
  readingTime?: string;
};

export type TOCItem = {
  title: string;
  url: string;
  depth: number;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  tags: string[];
  readingTime: string;
  href: string;
  toc: TOCItem[];
};

export type BlogPost = {
  meta: BlogPostMeta;
  content: ReactNode;
};

// Alias for SEO components compatibility
export type BlogMeta = BlogPostMeta & {
  author?: string;
  image?: string;
  lang?: string;
  readTime?: string;
};

