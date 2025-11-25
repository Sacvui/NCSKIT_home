"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguageContext } from "./LanguageProvider";

const currentYear = new Date().getFullYear();

export function Footer() {
  const { copy } = useLanguageContext();
  const { footer, blog } = copy;
  const footerText = footer.text.replace("{year}", `${currentYear}`);

  return (
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
          <Link href="/blog">{blog.ctaLabel}</Link>
          <Link href="/#contact">{copy.contact.title}</Link>
        </div>
      </div>
    </footer>
  );
}

