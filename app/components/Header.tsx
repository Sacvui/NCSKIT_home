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
        <div
          key={item.href}
          className={`nav-item${item.children ? " has-children" : ""}${isActive ? " active" : ""}`}
        >
          <a
            href={getLinkHref(href)}
            onClick={(e) => {
              if (onClick) onClick();
              // Only handle anchor links for smooth scroll on homepage
              if (variant === "default" && href.startsWith("#") && !href.startsWith("/")) {
                handleNavClick(e, href);
              }
              // For routes (/features, /architecture, etc.), let browser handle navigation
            }}
          >
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
                      href={getLinkHref(child.href)}
                      className={`nav-dropdown-item ${column}`}
                      onClick={(e) => {
                        if (onClick) onClick();
                        if (isBlog && child.href.startsWith("#")) {
                          e.preventDefault();
                          window.location.href = `/${child.href}`;
                        }
                      }}
                    >
                      {child.label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
          {renderNavItems(undefined, false)}
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
        )}
      </div>
    </header>
  );
}

