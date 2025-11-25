"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AILogos } from "./AIPartnerLogos";

type AIPartner = {
  name: string;
  logo: string;
  url: string;
  description?: string;
  category: "llm" | "search" | "analysis" | "coding";
};

const aiPartners: AIPartner[] = [
  {
    name: "OpenAI GPT",
    logo: "openai",
    url: "https://openai.com",
    description: "Advanced language models",
    category: "llm",
  },
  {
    name: "Google Gemini",
    logo: "gemini",
    url: "https://gemini.google.com",
    description: "Multimodal AI platform",
    category: "llm",
  },
  {
    name: "xAI Grok",
    logo: "grok",
    url: "https://x.ai",
    description: "Real-time AI assistant",
    category: "llm",
  },
  {
    name: "Anthropic Claude",
    logo: "claude",
    url: "https://www.anthropic.com",
    description: "Constitutional AI",
    category: "llm",
  },
  {
    name: "Perplexity",
    logo: "perplexity",
    url: "https://www.perplexity.ai",
    description: "AI-powered search",
    category: "search",
  },
  {
    name: "LangChain",
    logo: "langchain",
    url: "https://www.langchain.com",
    description: "LLM application framework",
    category: "coding",
  },
  {
    name: "Hugging Face",
    logo: "huggingface",
    url: "https://huggingface.co",
    description: "AI model hub",
    category: "coding",
  },
  {
    name: "Wolfram Alpha",
    logo: "wolfram",
    url: "https://www.wolframalpha.com",
    description: "Computational intelligence",
    category: "analysis",
  },
];

export function AIPartnersSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPartnerLogo = (logoKey: string) => {
    const logoMap: Record<string, JSX.Element> = {
      openai: AILogos.openai,
      gemini: AILogos.gemini,
      grok: AILogos.grok,
      claude: AILogos.claude,
      perplexity: AILogos.perplexity,
      langchain: AILogos.langchain,
      huggingface: AILogos.huggingface,
      wolfram: AILogos.wolfram,
    };
    return logoMap[logoKey.toLowerCase()] || null;
  };

  const getPartnerIcon = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 3);
    return initials;
  };

  return (
    <section id="ai-partners" className="section ai-partners-section">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">AI Integration</p>
          <h2>Connected AI Partners</h2>
          <p>
            NCSKIT integrates with leading AI platforms to deliver the best research experience.
            Click on any logo to explore each partner.
          </p>
        </motion.div>

        <div className="ai-partners-toggle-container">
          <button
            type="button"
            className="ai-partners-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Hide" : "Show"} AI Partners</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="ai-partners-grid"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
          {aiPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="ai-partner-card component-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-partner-link"
              >
                <div className="ai-partner-logo">
                  {getPartnerLogo(partner.logo) ? (
                    <div className="ai-partner-svg-logo">
                      {getPartnerLogo(partner.logo)}
                    </div>
                  ) : (
                    <div className="ai-partner-icon">
                      <span>{getPartnerIcon(partner.name)}</span>
                    </div>
                  )}
                </div>
                <div className="ai-partner-info">
                  <h3>{partner.name}</h3>
                  {partner.description && (
                    <p className="ai-partner-description">{partner.description}</p>
                  )}
                  <span className="ai-partner-category">{partner.category.toUpperCase()}</span>
                </div>
                <div className="ai-partner-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 3L14 10L7 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>
            ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="ai-partners-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p>
                NCSKIT supports integration with many other AI platforms.{" "}
                <Link href="/#contact" className="inline-link">
                  Contact us
                </Link>{" "}
                to learn more about integration capabilities.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

