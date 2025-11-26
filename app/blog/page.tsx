import type { Metadata } from "next";
import { LanguageProvider } from "../components/LanguageProvider";
import BlogClient from "./BlogClient";
import { getBlogIndex, type BlogPostMeta } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NCSKIT Blog · Knowledge Atlas & Research Lab Notes",
  description:
    "Bilingual MDX knowledge base that bridges the Economic Knowledge Group and Scientific Research Group with SEO-friendly silos.",
  alternates: {
    canonical: "https://ncskit.org/blog",
  },
  openGraph: {
    title: "NCSKIT Blog · Knowledge Atlas & Research Lab Notes",
    description:
      "Structured MDX categories spanning marketing psychology, governance, SEM labs, and academic writing.",
    url: "https://ncskit.org/blog",
    siteName: "NCSKIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NCSKIT Blog · Knowledge Atlas & Research Lab Notes",
    description:
      "MDX-powered blog for economic knowledge seekers and scientific researchers.",
  },
};

export default async function BlogPage() {
  const posts = await getBlogIndex();
  const postsByCategory = groupPostsByCategory(posts);

  return (
    <LanguageProvider>
      <BlogClient posts={posts} postsByCategory={postsByCategory} />
    </LanguageProvider>
  );
}

function groupPostsByCategory(posts: BlogPostMeta[]) {
  return posts.reduce<Record<string, BlogPostMeta[]>>((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});
}

