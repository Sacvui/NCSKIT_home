import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./styles/design-system.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HtmlLangWrapper } from "./components/HtmlLangWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ncskit.org'),
  title: {
    default: "NCSKIT IDE · Research Operating System",
    template: "%s | NCSKIT IDE"
  },
  description:
    "NCSKIT IDE blends a custom VS Code OSS fork, FastAPI, and LangChain so researchers can turn ideas into publish-ready papers without writing code.",
  keywords: ["research", "economics", "data analysis", "SEM", "statistical analysis", "academic research", "no-code", "research automation"],
  authors: [{ name: "NCSKIT Team" }],
  creator: "NCSKIT",
  publisher: "NCSKIT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ncskit.org',
    siteName: 'NCSKIT IDE',
    title: 'NCSKIT IDE · Research Operating System',
    description: 'Automate your research workflow with AI-powered tools for data analysis, statistical modeling, and paper generation.',
    images: [
      {
        url: '/assets/logo.png',
        width: 1200,
        height: 630,
        alt: 'NCSKIT IDE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NCSKIT IDE · Research Operating System',
    description: 'Automate your research workflow with AI-powered tools',
    images: ['/assets/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

import { AuthProvider } from "./components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <div className="glow-bg" aria-hidden="true" />
          {children}
          <SpeedInsights />
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "NCSKIT IDE",
                  "url": "https://ncskit.org",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://ncskit.org/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "NCSKIT",
                  "url": "https://ncskit.org",
                  "logo": "https://ncskit.org/assets/logo.png"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

