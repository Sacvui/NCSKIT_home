"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useLanguageContext } from "../components/LanguageProvider";
import type { BlogPostMeta } from "@/types/blog";
import type { Article, WithContext } from "schema-dts";

type BlogArticleClientProps = {
  meta: BlogPostMeta;
  children: ReactNode;
};

export default function BlogArticleClient({
  meta,
  children,
}: BlogArticleClientProps) {
  const { copy } = useLanguageContext();
  const categoryInfo = copy.blog.categories.find(
    (category) => category.anchor === meta.category,
  );
  const categoryLabel = meta.categoryLabel ?? categoryInfo?.title ?? meta.category;
  const groupInfo = copy.blog.groups[meta.group];

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.seoDescription || meta.summary,
    datePublished: meta.date,
    dateModified: meta.updated ?? meta.date,
    author: (meta.authors ?? ["NCSKIT Research"]).map((name) => ({
      "@type": "Person",
      name,
    })),
    inLanguage: ["en", "vi"],
    keywords: meta.tags,
    url: `https://ncskit.org${meta.href}`,
    publisher: {
      "@type": "Organization",
      name: "NCSKIT",
      url: "https://ncskit.org",
      logo: {
        "@type": "ImageObject",
        url: "https://ncskit.org/assets/logo.png",
      },
    },
  };

  return (
    <>
      <Header variant="article" backHref="/blog" backLabel={copy.blog.ctaLabel} />

      <main className="blog-article container section-container">
        <section className="component-card">
          <p className="eyebrow">{meta.groupLabel ?? groupInfo?.label}</p>
          <h1 className="section-heading">{meta.title}</h1>
          <p className="section-description">{meta.summary}</p>
          {meta.cover && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100">
              <Image
                src={meta.cover}
                alt={meta.title}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{new Date(meta.date).toLocaleDateString()}</span>
            <span>{meta.readingTime}</span>
            <span>{categoryLabel}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <article className="prose prose-slate prose-lg mx-auto max-w-none prose-headings:font-display prose-a:text-brand">
          {children}
        </article>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

