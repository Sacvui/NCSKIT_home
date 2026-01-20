"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguageContext } from "./LanguageProvider";
import { useScrollSpy } from "./ScrollSpy";
import { UserMenu } from "./UserMenu";
import type { NavItem } from "@/lib/content";

type HeaderProps = {
  nav?: NavItem[];
  headerCtas?: {
    readme: string;
    release: string;
  };
  variant?: "default" | "blog" | "article";
  backHref?: string;
  backLabel?: string;
};

export function Header({ nav, headerCtas, variant = "default", backHref, backLabel }: HeaderProps) {
  const { copy } = useLanguageContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;

  const navigation = nav ?? copy.nav;
  const ctas = headerCtas ?? copy.headerCtas;
  const isBlog = variant === "blog" || variant === "article";

  // Extract section IDs for scroll spy
  const sectionIds = navigation
    .map((item) => {
      const href = item.href;
      if (href.startsWith("#")) {
        return href.substring(1);
      }
      return null;
    })
    .filter((id): id is string => id !== null);

  // Always call hook, but only use result for default variant
  const activeSectionIdRaw = useScrollSpy(sectionIds, 120);
  const activeSectionId = variant === "default" ? activeSectionIdRaw : "";

  // Smooth scroll with offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const renderNavItems = (onClick?: () => void, isMobile = false) =>
    navigation.map((item) => {
      const href = item.href;
      const sectionId = href.startsWith("#") ? href.substring(1) : "";
      const isActive = !isMobile && variant === "default" && activeSectionId === sectionId;

      // Convert relative anchor links to absolute paths for blog pages
      const getLinkHref = (linkHref: string) => {
        if (linkHref.startsWith("#") && isBlog) {
          return `/${linkHref}`;
        }
        return linkHref;
      };

      return (
        <li
          key={item.href}
          className={`nav-item relative group px-2 py-1${item.children ? " has-children" : ""}${isActive ? " active" : ""}`}
        >
          <Link
            href={getLinkHref(href)}
            onClick={(e) => {
              if (onClick) onClick();
              if (variant === "default" && href.startsWith("#") && !href.startsWith("/")) {
                handleNavClick(e, href);
              }
            }}
            className="flex items-center gap-1 hover:text-brand transition-colors text-sm font-medium"
          >
            {item.label}
            {item.children && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="m6 9 6 6 6-6" /></svg>
            )}
          </Link>
          {item.children && (
            <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 p-2 min-w-[240px]">
                <div className="grid gap-1">
                  {item.children.map((child, index) => (
                    <Link
                      key={`${item.href}-${child.href}`}
                      href={getLinkHref(child.href)}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-brand hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        if (onClick) onClick();
                        if (isBlog && child.href.startsWith("#")) {
                          e.preventDefault();
                          window.location.href = `/${child.href}`;
                        }
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </li>
      );
    });

  return (
    <header className={`site-header ${isBlog ? "blog-shell sticky top-0 z-40" : ""} ${variant === "article" ? "bg-white/80 backdrop-blur" : ""}`}>
      <div className="container header-inner">
        <Link className="brand" href={isBlog ? "/blog" : "/"}>
          <Image
            src="/assets/logo.png"
            alt="NCSKIT logo"
            width={144}
            height={48}
            priority
          />
        </Link>

        <nav className="nav" aria-label="Primary">
          <ul className="flex items-center gap-6">
            {renderNavItems(undefined, false)}
          </ul>
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

        <div className={`header-actions${mobileMenuOpen ? " mobile-visible" : ""} ${isBlog ? "gap-2" : ""}`}>
          <LanguageToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              {variant === "default" && (
                <a className="primary-btn" href="/login">
                  {ctas.release}
                </a>
              )}
              {variant === "blog" && (
                <a className="primary-btn" href="/login">
                  {ctas.release}
                </a>
              )}
              {variant === "article" && backHref && (
                <Link className="ghost-btn" href={backHref}>
                  ← {backLabel ?? copy.blog.ctaLabel}
                </Link>
              )}
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <>
            <div
              className={`mobile-menu-overlay${mobileMenuOpen ? " active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="mobile-menu active">
              <nav className="nav" aria-label="Primary mobile">
                {renderNavItems(() => setMobileMenuOpen(false), true)}
                {variant === "blog" && (
                  <>
                    <div className="nav-divider" />
                    <div className="nav-section-label">Blog Categories</div>
                    {copy.blog.categories.map((category) => (
                      <a
                        key={category.anchor}
                        href={`#${category.anchor}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="mobile-nav-item"
                      >
                        {category.title}
                      </a>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

