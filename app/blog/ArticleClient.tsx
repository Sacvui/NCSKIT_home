"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "../components/LanguageToggle";
import { useLanguageContext } from "../components/LanguageProvider";
import type { BlogPostMeta } from "@/types/blog";
import type { Article, WithContext } from "schema-dts";

type BlogArticleClientProps = {
  meta: BlogPostMeta;
  children: ReactNode;
};

const currentYear = new Date().getFullYear();

export default function BlogArticleClient({
  meta,
  children,
}: BlogArticleClientProps) {
  const { copy } = useLanguageContext();
  const { footer } = copy;
  const footerText = footer.text.replace("{year}", `${currentYear}`);
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
      <header className="site-header blog-shell bg-white/80 backdrop-blur">
        <div className="container header-inner gap-4">
          <Link className="brand" href="/blog">
            <Image
              src="/assets/logo.png"
              alt="NCSKIT logo"
              width={64}
              height={64}
              priority
            />
          </Link>
          <div className="header-actions gap-2">
            <LanguageToggle />
            <Link className="ghost-btn" href="/blog">
              ← {copy.blog.ctaLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="blog-article container space-y-10 pb-16 pt-16">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-card">
          <p className="eyebrow">{meta.groupLabel ?? groupInfo?.label}</p>
          <h1 className="text-4xl font-semibold leading-tight">{meta.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{meta.summary}</p>
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

      <footer className="site-footer border-t border-slate-200 bg-white/80">
        <div className="container footer-grid">
          <div>
            <Image
              src="/assets/ncskit-icon.svg"
              alt="NCSKIT icon"
              width={40}
              height={40}
            />
            <p>{footerText}</p>
            <small className="footer-note">{footer.note}</small>
          </div>
          <div className="footer-links">
            <Link href="/">{copy.nav[0]?.label ?? "Home"}</Link>
            <Link href="/blog">{copy.blog.ctaLabel}</Link>
            <Link href="/#contact">{copy.contact.title}</Link>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

