"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguageContext } from "./LanguageProvider";

const currentYear = new Date().getFullYear();

export function Footer() {
  const { copy } = useLanguageContext();
  const { footer, blog, nav } = copy;
  const footerText = footer.text.replace("{year}", `${currentYear}`);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Image
              src="/assets/ncskit-icon.svg"
              alt="NCSKIT"
              width={48}
              height={48}
              className="footer-logo"
            />
            <p className="footer-description">{footerText}</p>
            <small className="footer-note">{footer.note}</small>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#modules">Features</Link>
                </li>
                <li>
                  <Link href="/#architecture">Architecture</Link>
                </li>
                <li>
                  <Link href="/#workflow">Workflow</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Research</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/blog">Knowledge Atlas</Link>
                </li>
                <li>
                  <Link href="/blog#blog-lab">Research Lab</Link>
                </li>
                <li>
                  <Link href="/#sem-research">SEM Models</Link>
                </li>
                <li>
                  <Link href="/#contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li>
                  <a href="/docs/README.md" target="_blank" rel="noopener noreferrer">
                    Project README
                  </a>
                </li>
                <li>
                  <a href="/docs/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">
                    Architecture
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://ncskit.org" target="_blank" rel="noopener noreferrer">
                    Official Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} NCSKIT Research. All rights reserved.
            </p>
            <p className="footer-creator">
              Created by <strong>Lê Phúc Hải</strong> · PhD Candidate
            </p>
          </div>
          <div className="footer-social">
            <a
              href="https://ncskit.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Visit ncskit.org"
            >
              ncskit.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
