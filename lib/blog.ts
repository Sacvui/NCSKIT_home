import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import type {
  BlogFrontmatter,
  BlogPost,
  BlogPostMeta,
} from "@/types/blog";
export type { BlogFrontmatter, BlogPost, BlogPostMeta } from "@/types/blog";

export const BLOG_DIR = path.join(process.cwd(), "content/blog");
const WORDS_PER_MINUTE = 210;

function estimateReadingTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export async function getBlogIndex(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir(BLOG_DIR);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(BLOG_DIR, file);
        const raw = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(raw);
        const frontmatter = data as BlogFrontmatter;
        const slug = frontmatter.slug ?? file.replace(/\.mdx$/, "");

        return {
          ...frontmatter,
          slug,
          tags: frontmatter.tags ?? [],
          readingTime: frontmatter.readingTime ?? estimateReadingTime(content),
          href: `/blog/${slug}`,
          toc: [],
        };
      }),
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostsByCategory() {
  const posts = await getBlogIndex();
  return posts.reduce<Record<string, BlogPostMeta[]>>((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});
}

import { BlogChart } from "@/app/components/blog/BlogChart";

// ... (existing imports)

// ...

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const source = await fs.readFile(fullPath, "utf-8");

  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source,
    components: {
      BlogChart,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex, rehypeSlug],
      },
    },
  });

  const fm = frontmatter as BlogFrontmatter;
  const headings = getHeadings(source);

  const meta: BlogPostMeta = {
    ...fm,
    slug: fm.slug ?? slug,
    tags: fm.tags ?? [],
    readingTime: fm.readingTime ?? estimateReadingTime(source),
    href: `/blog/${fm.slug ?? slug}`,
    toc: headings,
  };

  return {
    meta,
    content,
  };
}

function getHeadings(source: string) {
  const slugger = new GithubSlugger();
  const headingLines = source.split("\n").filter((line) => {
    return line.match(/^#{2,3}\s/);
  });

  return headingLines.map((raw) => {
    const text = raw.replace(/^#{2,3}\s/, "");
    // Remove markdown links from text if any
    const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const depth = raw.match(/^#{2,3}/)?.[0].length ?? 2;
    const url = `#${slugger.slug(cleanText)}`;

    return {
      title: cleanText,
      url,
      depth,
    };
  });
}

export async function getAllPostSlugs() {
  const files = await fs.readdir(BLOG_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3,
): Promise<BlogPostMeta[]> {
  const allPosts = await getBlogIndex();

  return allPosts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        post.category === category
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
    .slice(0, limit);
}

