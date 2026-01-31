"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Header } from "../components/Header";
import { FormattedDate } from "../components/FormattedDate";
import { Footer } from "../components/Footer";
import { useLanguageContext } from "../components/LanguageProvider";
import { BlogSearch } from "../components/blog/BlogSearch";
import { Newsletter } from "../components/Newsletter";
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

  // Get the most recent post as featured
  const featuredPost = posts[0];
  // Get next 3 posts for "Recent" section
  const recentPosts = posts.slice(1, 4);

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

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  return (
    <>
      <Header variant="blog" nav={copy.nav} headerCtas={copy.headerCtas} />

      <main className="blog-page min-h-screen bg-slate-50/50 dark:bg-slate-950">
        {/* Hero Section with Featured Post */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Blog Intro */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <p className="text-brand font-bold tracking-widest uppercase text-sm">{blog.eyebrow}</p>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {blog.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold hover:bg-brand hover:text-white transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Blog Search */}
                <BlogSearch posts={posts} placeholder="Search articles..." />
              </div>

              {/* Featured Post Card */}
              <div className="lg:col-span-7">
                {featuredPost && (
                  <Link href={featuredPost.href} className="group block relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={featuredPost.cover || "/assets/NCSKIT.png"}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                        <div className="flex items-center gap-3 mb-3 text-sm font-medium text-slate-200">
                          <span className="bg-brand px-2 py-0.5 rounded text-white">{featuredPost.categoryLabel || featuredPost.category}</span>
                          <span>•</span>
                          <span>{featuredPost.readingTime}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-brand-light transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-slate-200 line-clamp-2 max-w-2xl">
                          {featuredPost.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Grid */}
        <section className="py-16 md:py-24">
          <div className="container space-y-16">

            {/* Latest Articles */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest Articles</h2>
                <span className="text-sm text-slate-500">Fresh from the lab</span>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {recentPosts.map((post) => (
                  <Link key={post.slug} href={post.href} className="group block text-left break-inside-avoid bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-brand/50 hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                      <Image
                        src={post.cover || "/assets/NCSKIT.png"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center gap-2 text-xs font-semibold text-brand mb-3 uppercase tracking-wide">
                        <span>{post.categoryLabel || post.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                        {post.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {post.authors?.[0]?.charAt(0) || "N"}
                          </div>
                          <span>{post.authors?.[0] || "NCSKIT Team"}</span>
                        </div>
                        <span className="ml-auto"><FormattedDate date={post.date} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Grouped Categories */}
            {groupedCategories.map((group) => (
              <div key={group.id} className="space-y-8 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <p className="text-brand font-bold tracking-widest uppercase text-xs mb-1">{group.info.label}</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{group.info.description}</h2>
                  </div>
                </div>

                <div className="grid gap-12">
                  {group.categories.map((category) => {
                    const entries = postsByCategory[category.anchor] ?? [];
                    if (entries.length === 0) return null;

                    return (
                      <div key={category.anchor} id={category.anchor} className="space-y-6 scroll-mt-32">
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{category.title}</h3>
                          <div className="h-px flex-grow bg-slate-200 dark:border-slate-800"></div>
                          <Link href={`/blog/category/${category.anchor}`} className="text-sm font-medium text-brand hover:underline">View all</Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {entries.slice(0, 3).map((post) => (
                            <Link key={post.slug} href={post.href} className="group flex gap-4 items-start p-4 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 dark:hover:bg-slate-900">
                              <div className="w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                <Image
                                  src={post.cover || "/assets/NCSKIT.png"}
                                  alt={post.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2 mb-1">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                  <FormattedDate date={post.date} />
                                  <span>•</span>
                                  <span>{post.readingTime}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20">
          <div className="container">
            <Newsletter />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

