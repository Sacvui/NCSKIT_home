"use client";

import type { ReactNode } from "react";
import { FormattedDate } from "../components/FormattedDate";



import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollProgressBar } from "../components/ScrollProgressBar";
import { useLanguageContext } from "../components/LanguageProvider";
import type { BlogPostMeta } from "@/types/blog";
import type { Article, WithContext, BreadcrumbList } from "schema-dts";
import { BreadcrumbSchema } from "../components/seo/BlogPostSchema";

type BlogArticleClientProps = {
  meta: BlogPostMeta;
  children: ReactNode;
  relatedPosts?: BlogPostMeta[]; // Add relatedPosts prop
};

export default function BlogArticleClient({
  meta,
  children,
  relatedPosts = [], // Default to empty array
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
      <ScrollProgressBar />
      <Header variant="article" nav={copy.nav} headerCtas={copy.headerCtas} backHref="/blog" backLabel={copy.blog.ctaLabel} />

      <main className="blog-article container section-container">
        <section className="component-card mb-12">
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
            <FormattedDate date={meta.date} />
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

        <div className="lg:flex lg:gap-12 items-start">
          <article className="prose prose-slate prose-lg max-w-none flex-1 min-w-0 prose-headings:font-display prose-headings:scroll-mt-24 prose-a:text-brand">
            {children}
          </article>

          {meta.toc && meta.toc.length > 0 && (
            <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
              <div className="p-6 rounded-2xl bg-white/50 backdrop-blur border border-slate-200 shadow-sm">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">On this page</h4>
                <nav className="space-y-1">
                  {meta.toc.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      className={`block text-sm py-1 hover:text-brand transition-colors ${item.depth === 3 ? "pl-4 text-slate-500" : "text-slate-700 font-medium"
                        }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <a key={post.slug} href={post.href} className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-800">
                  <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={post.cover || "/assets/NCSKIT.png"}
                      alt={post.title}
                      width={600}
                      height={337}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold text-brand uppercase mb-2">{post.categoryLabel || post.category}</p>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors mb-2 line-clamp-2">{post.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FormattedDate date={post.date} />
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb Schema for navigation hierarchy */}
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: categoryLabel || "Article", href: `/blog#${meta.category}` },
          { name: meta.title, href: meta.href },
        ]}
      />
    </>
  );
}

