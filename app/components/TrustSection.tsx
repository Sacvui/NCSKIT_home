"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type TrustLogo = {
  name: string;
  logo?: string;
  url?: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  affiliation?: string;
  avatar?: string;
};

type TrustSectionProps = {
  title?: string;
  logos?: TrustLogo[];
  testimonials?: Testimonial[];
  showTestimonials?: boolean;
};

const defaultLogos: TrustLogo[] = [
  { name: "Vietnam National University" },
  { name: "Ho Chi Minh City University of Technology" },
  { name: "University of Economics Ho Chi Minh City" },
  { name: "Foreign Trade University" },
  { name: "Academy of Finance" },
  { name: "Research Institutions" },
];

const defaultTestimonials: Testimonial[] = [
  {
    quote: "NCSKIT transformed my thesis workflow. What used to take weeks now takes days. The automated analysis and APA formatting saved me countless hours.",
    author: "Nguyễn Thị Lan",
    role: "PhD Candidate",
    affiliation: "Vietnam National University",
  },
  {
    quote: "As a faculty member, I appreciate how NCSKIT standardizes research methodology. My students produce higher quality work with less technical friction.",
    author: "Dr. Trần Văn Minh",
    role: "Associate Professor",
    affiliation: "University of Economics HCMC",
  },
  {
    quote: "The no-code approach is perfect for researchers who want to focus on knowledge, not tooling. NCSKIT bridges the gap between ideas and published papers.",
    author: "Hải Rong Chơi",
    role: "Creator & Rong Chơi",
    affiliation: "NCSKIT Research",
  },
];

export function TrustSection({
  title = "Trusted by researchers worldwide",
  logos = defaultLogos,
  testimonials = defaultTestimonials,
  showTestimonials = true,
}: TrustSectionProps) {
  return (
    <section className="trust-section">
      <div className="container">
        {/* Trust Logos */}
        <div className="trust-logos">
          <p className="trust-label">{title}</p>
          <div className="logos-grid">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                className="logo-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {logo.logo ? (
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className="logo-image"
                    unoptimized
                  />
                ) : (
                  <span className="logo-text">{logo.name}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {showTestimonials && (
          <div className="testimonials-section">
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="testimonial-card component-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <div className="testimonial-quote">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="quote-icon"
                    >
                      <path
                        d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                        fill="currentColor"
                        opacity="0.2"
                      />
                    </svg>
                    <p>{testimonial.quote}</p>
                  </div>
                  <div className="testimonial-author">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="author-avatar"
                        unoptimized
                      />
                    ) : (
                      <div className="author-avatar-placeholder">
                        {testimonial.author.charAt(0)}
                      </div>
                    )}
                    <div className="author-info">
                      <strong>{testimonial.author}</strong>
                      <span>
                        {testimonial.role}
                        {testimonial.affiliation && ` · ${testimonial.affiliation}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

