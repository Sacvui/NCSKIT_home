"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useLanguageContext } from "../components/LanguageProvider";
import type { BlogPostMeta } from "@/types/blog";
import type { BlogGroup } from "@/lib/content";

const BLOG_GROUP_ORDER: BlogGroup[] = ["economic", "scientific"];

type BlogClientProps = {
  posts: BlogPostMeta[];
  postsByCategory: Record<string, BlogPostMeta[]>;
};

export default function BlogClient(props: BlogClientProps) {
  const { posts, postsByCategory } = props;
  const { copy } = useLanguageContext();
  const { blog } = copy;

  const heroPosts = posts.slice(0, 3);

  const groupedCategories = useMemo(
    () =>
      BLOG_GROUP_ORDER.map((groupKey) => ({
        id: groupKey,
        info: blog.groups[groupKey],
        categories: blog.categories.filter(
          (category) => category.group === groupKey,
        ),
      })),
    [blog.categories, blog.groups],
  );

  return (
    <>
      <Header variant="blog" nav={copy.nav} headerCtas={copy.headerCtas} />

      <main className="blog-page section-container">
        <section className="section blog-hero">
          <div className="container blog-hero-grid items-center gap-12">
            <div className="space-y-6">
              <p className="eyebrow">{blog.eyebrow}</p>
              <h1>{blog.title}</h1>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                {blog.description}
              </p>
              <div className="blog-tags-cloud compact">
                <span>{blog.tagsLabel}</span>
                {blog.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="blog-hero-card shadow-card">
              <h3>{blog.ctaLabel}</h3>
              <p>
                {blog.categories.length} categories · siloed for SEO · bilingual
                storytelling for the research community.
              </p>
              <ul>
                {heroPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={post.href}>
                      <strong>{post.title}</strong>
                      <span>
                        {post.readingTime} ·{" "}
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {groupedCategories.map((group) => (
          <section key={group.id} className="section blog-group">
            <div className="container space-y-8">
              <div className="max-w-3xl">
                <p className="eyebrow">{group.info.label}</p>
                <h2>{group.info.description}</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {group.categories.map((category) => {
                  const entries = postsByCategory[category.anchor] ?? [];
                  return (
                    <article
                      key={category.anchor}
                      id={category.anchor}
                      className="blog-card flex flex-col gap-4"
                    >
                      <div className="blog-card-head">
                        <p className="blog-slug">{category.slug}</p>
                        <h3>{category.title}</h3>
                      </div>
                      <p>{category.description}</p>
                      <p className="blog-excerpt">{category.excerpt}</p>
                      <ul className="space-y-2">
                        {category.featured.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                      {category.children && (
                        <div className="blog-subsections">
                          {category.children.map((sub) => (
                            <div
                              key={sub.anchor}
                              id={sub.anchor}
                              className="blog-subsection-card"
                            >
                              <h4>{sub.title}</h4>
                              <p>{sub.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white/70 p-4">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                          Latest posts
                        </p>
                        {entries.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            Coming soon.
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {entries.slice(0, 3).map((post) => (
                              <li key={post.slug} className="space-y-1">
                                <Link
                                  href={post.href}
                                  className="font-medium text-brand hover:underline"
                                >
                                  {post.title}
                                </Link>
                                <p className="text-sm text-slate-500">
                                  {post.summary}
                                </p>
                                <div className="text-xs uppercase tracking-wide text-slate-400">
                                  {post.readingTime} ·{" "}
                                  {new Date(post.date).toLocaleDateString()}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <section className="section blog-tags-cloud">
          <div className="container blog-tags flex-wrap gap-3">
            <span>{blog.tagsLabel}</span>
            {blog.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

