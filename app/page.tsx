"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StatusBoard } from "./components/StatusBoard";
import { ArchitectureTabs } from "./components/ArchitectureTabs";
import { LanguageProvider, useLanguageContext } from "./components/LanguageProvider";
import { LanguageToggle } from "./components/LanguageToggle";
import type { BlogPostMeta } from "@/types/blog";

const currentYear = new Date().getFullYear();

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}

function HomeContent() {
  const { copy } = useLanguageContext();
  const {
    nav,
    headerCtas,
    hero,
    status,
    features,
    architecture,
    workflow,
    changelog,
    marketing,
    automation,
    techRequirements,
    blog,
    resources,
    release,
    contact,
    footer,
  } = copy;
  const [latestPosts, setLatestPosts] = useState<BlogPostMeta[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog?limit=3");
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setLatestPosts(data.posts);
        }
      } catch (error) {
        console.error("Failed to load blog posts", error);
      }
    }

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const footerText = footer.text.replace("{year}", `${currentYear}`);
  const previewPosts = latestPosts.slice(0, 3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#hero">
            <Image src="/assets/logo.png" alt="NCSKIT logo" width={64} height={64} priority />
          </a>
          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <div
                key={item.href}
                className={`nav-item${item.children ? " has-children" : ""}`}
              >
                <a href={item.href}>{item.label}</a>
                {item.children && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-grid">
                      {item.children.map((child, index) => {
                        const midPoint = Math.ceil(item.children!.length / 2);
                        const column = index < midPoint ? "left" : "right";
                        return (
                          <a
                            key={`${item.href}-${child.href}`}
                            href={child.href}
                            className={`nav-dropdown-item ${column}`}
                          >
                            {child.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <button
            className={`mobile-menu-toggle${mobileMenuOpen ? " active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`header-actions${mobileMenuOpen ? " mobile-visible" : ""}`}>
            <LanguageToggle />
            <div className="header-cta">
              <a className="ghost-btn" href="/docs/README.md" download>
                {headerCtas.readme}
              </a>
              <a className="primary-btn" href="#release">
                {headerCtas.release}
              </a>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="mobile-menu active">
              <nav className="nav" aria-label="Primary mobile">
                {nav.map((item) => (
                  <div
                    key={item.href}
                    className={`nav-item${item.children ? " has-children" : ""}`}
                  >
                    <a href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="nav-dropdown">
                        <div className="nav-dropdown-grid">
                          {item.children.map((child, index) => {
                            const midPoint = Math.ceil(item.children!.length / 2);
                            const column = index < midPoint ? "left" : "right";
                            return (
                              <a
                                key={`${item.href}-${child.href}`}
                                href={child.href}
                                className={`nav-dropdown-item ${column}`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1>{hero.title}</h1>
              <p className="lede">{hero.lede}</p>
              <div className="hero-actions">
                <a className="primary-btn" href="/docs/ARCHITECTURE.md" download>
                  {hero.primaryCta}
                </a>
                <a className="secondary-btn" href="#modules">
                  {hero.secondaryCta}
                </a>
              </div>
              <div className="hero-tags">
                {hero.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="hero-metrics">
                {hero.metrics.map((metric) => (
                  <div key={metric.label} className="hero-metric">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className="hero-announcement">
                <strong>{hero.announcementLabel}: </strong>
                <span>{hero.announcementDescription}</span>
              </div>
            </div>
            <div className="hero-showcase">
              <div>
                <div className="section-head compact">
                  <p className="eyebrow">{status.eyebrow}</p>
                  <h2>{status.title}</h2>
                  <p>{status.description}</p>
                </div>
                <StatusBoard columns={status.columns} />
              </div>
              <div className="mini-terminal" aria-live="polite">
                <div className="terminal-header">
                  <span />
                  <span />
                  <span />
                  <p>{status.terminalTitle}</p>
                </div>
                <pre>
                  <code>{status.terminalLog}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="section features">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{features.eyebrow}</p>
              <h2>{features.title}</h2>
              <p>{features.description}</p>
            </div>
            <div className="feature-grid">
              {features.list.map((feature) => (
                <article key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul>
                    {feature.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="architecture" className="section architecture">
          <div className="container architecture-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">{architecture.eyebrow}</p>
                <h2>{architecture.title}</h2>
                <p>{architecture.description}</p>
              </div>
              <ArchitectureTabs tabs={architecture.tabs} />
            </div>
            <div className="architecture-card">
              <h3>{architecture.techStackTitle}</h3>
              <dl>
                {architecture.techStack.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <Image src="/assets/NCSKIT.png" alt={architecture.imageAlt} width={640} height={360} />
            </div>
          </div>
        </section>

        <section id="workflow" className="section workflow">
          <div className="container workflow-grid">
            <div>
              <div className="section-head">
                <p className="eyebrow">{workflow.eyebrow}</p>
                <h2>{workflow.title}</h2>
                <p>{workflow.description}</p>
              </div>
              <ul className="workflow-list">
                {workflow.steps.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="api-card">
              <h3>{workflow.apiTitle}</h3>
              <div className="api-list">
                {workflow.apiHighlights.map((api) => (
                  <article key={api.title}>
                    <h4>{api.title}</h4>
                    <p>{api.detail}</p>
                  </article>
                ))}
              </div>
              <a href="/docs/ARCHITECTURE.md" className="ghost-btn" download>
                {workflow.apiCta}
              </a>
            </div>
          </div>
        </section>

        <section id="auto-flow" className="section automation">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{automation.eyebrow}</p>
              <h2>{automation.title}</h2>
              <p>{automation.description}</p>
            </div>
            <div className="automation-grid">
              {automation.phases.map((phase) => (
                <article key={phase.title} className="automation-phase">
                  <header>
                    <h3>{phase.title}</h3>
                    <p className="phase-subtitle">{phase.subtitle}</p>
                  </header>
                  <p>{phase.description}</p>
                  <ul>
                    {phase.outputs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tech" className="section tech-req">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{techRequirements.eyebrow}</p>
              <h2>{techRequirements.title}</h2>
              <p>{techRequirements.description}</p>
            </div>
            <div className="tech-grid">
              {techRequirements.items.map((item) => (
                <article key={item.title} className="tech-card">
                  <h3>{item.title}</h3>
                  <ul>
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="marketing" className="section marketing">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{marketing.eyebrow}</p>
              <h2>{marketing.title}</h2>
              <p>{marketing.description}</p>
            </div>
            <div className="marketing-grid">
              {marketing.cards.map((card) => (
                <article key={card.title} className="marketing-card">
                  <div className="marketing-card-header">
                    <h3>{card.title}</h3>
                  </div>
                  <p>{card.description}</p>
                  <ul>
                    {card.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a
                    className="marketing-cta"
                    href={card.ctaHref}
                    target={card.ctaHref.startsWith("http") ? "_blank" : undefined}
                    rel={card.ctaHref.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {card.ctaLabel}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="blog-preview" className="section blog-preview">
          <div className="container blog-preview-grid">
            <div className="blog-preview-copy">
              <p className="eyebrow">{blog.eyebrow}</p>
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>
              <a className="primary-btn" href="/blog">
                {blog.ctaLabel}
              </a>
            </div>
            <div className="blog-preview-cards">
              {previewPosts.length > 0
                ? previewPosts.map((post) => {
                    const groupLabel =
                      copy.blog.groups[post.group]?.label ?? copy.blog.groups.economic.label;
                    return (
                      <article key={post.slug} className="blog-preview-card">
                        <p className="blog-slug">{groupLabel}</p>
                      <h3>{post.title}</h3>
                      <p>{post.summary}</p>
                      <p className="blog-excerpt">
                        {post.readingTime} · {new Date(post.date).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={`${post.slug}-${tag}`}
                            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                        <a
                          className="inline-flex items-center gap-2 font-semibold text-brand"
                          href={post.href}
                        >
                          {blog.ctaLabel}
                          <span aria-hidden="true">→</span>
                        </a>
                      </article>
                    );
                  })
                : blog.categories.slice(0, 3).map((category) => (
                    <article key={category.anchor} className="blog-preview-card">
                      <p className="blog-slug">{category.slug}</p>
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                      <p className="blog-excerpt">{category.excerpt}</p>
                      <ul>
                        {category.featured.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
            </div>
          </div>
        </section>

        <section id="changelog" className="section changelog">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{changelog.eyebrow}</p>
              <h2>{changelog.title}</h2>
              <p>{changelog.description}</p>
            </div>
            <div className="changelog-list">
              {changelog.entries.map((entry) => (
                <article key={entry.version} className="changelog-item">
                  <strong>{entry.version}</strong>
                  <small>{entry.date}</small>
                  <p>{entry.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="section resources">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{resources.eyebrow}</p>
              <h2>{resources.title}</h2>
            </div>
            <div className="resources-grid">
              {resources.cards.map((resource) => (
                <article key={resource.title}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a
                    href={resource.href}
                    download={resource.download ? true : undefined}
                  >
                    {resource.label}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="release" className="section release">
          <div className="container release-card">
            <div>
              <p className="eyebrow">{release.eyebrow}</p>
              <h2>{release.title}</h2>
              <p className="release-description">{release.description}</p>
              <ul>
                {release.checklist.map((item) => (
                  <li key={item}>✅ {item}</li>
                ))}
              </ul>
            </div>
            <div className="release-actions">
              <a className="primary-btn" href={release.primaryHref} target="_blank" rel="noreferrer">
                {release.primaryCta}
              </a>
              <a className="secondary-btn" href={release.secondaryHref}>
                {release.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow">{contact.eyebrow}</p>
              <h2>{contact.title}</h2>
              <p>{contact.description}</p>
              <div className="contact-info">
                <a href={`mailto:${contact.email}`}>{contact.emailLabel}: {contact.email}</a>
                <a href={contact.website} target="_blank" rel="noreferrer">
                  {contact.websiteLabel}: {contact.website.replace("https://", "")}
                </a>
              </div>
            </div>
            <form className="contact-form" action="#" method="post">
              <label>
                {contact.form.nameLabel}
                <input type="text" name="name" placeholder={contact.form.namePlaceholder} required />
              </label>
              <label>
                {contact.form.emailLabel}
                <input
                  type="email"
                  name="email"
                  placeholder={contact.form.emailPlaceholder}
                  required
                />
              </label>
              <label>
                {contact.form.needLabel}
                <textarea
                  name="message"
                  rows={3}
                  placeholder={contact.form.needPlaceholder}
                />
              </label>
              <button type="submit" className="primary-btn">
                {contact.form.submit}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Image src="/assets/ncskit-icon.svg" alt="NCSKIT icon" width={40} height={40} />
            <p>{footerText}</p>
            <small>{footer.note}</small>
          </div>
          <div className="footer-links">
            {footer.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

