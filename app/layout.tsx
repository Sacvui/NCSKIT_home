import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./styles/design-system.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "NCSKIT IDE · Research Operating System",
  description:
    "NCSKIT IDE blends a custom VS Code OSS fork, FastAPI, and LangChain so researchers can turn ideas into publish-ready papers without writing code.",
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/logo.png',
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
      </body>
    </html>
  );
}

