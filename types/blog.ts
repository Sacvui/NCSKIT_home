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

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  tags: string[];
  readingTime: string;
  href: string;
};

export type BlogPost = {
  meta: BlogPostMeta;
  content: ReactNode;
};

