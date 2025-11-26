import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../components/LanguageProvider";
import BlogArticleClient from "../ArticleClient";
import {
  getAllPostSlugs,
  getPostBySlug,
  type BlogPost,
} from "@/lib/blog";

type BlogPageParams = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = await getPostBySlug(slug);
    const title = `${meta.title} · NCSKIT Blog`;
    const description = meta.seoDescription ?? meta.summary;

    return {
      title,
      description,
      alternates: {
        canonical: `https://ncskit.org${meta.href}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://ncskit.org${meta.href}`,
        publishedTime: meta.date,
        modifiedTime: meta.updated ?? meta.date,
        tags: meta.tags,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "NCSKIT Blog",
    };
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<BlogPageParams>;
}) {
  const { slug } = await params;
  const post = await safeGetPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <LanguageProvider>
      <BlogArticleClient meta={post.meta}>{post.content}</BlogArticleClient>
    </LanguageProvider>
  );
}

async function safeGetPost(slug: string): Promise<BlogPost | null> {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}

