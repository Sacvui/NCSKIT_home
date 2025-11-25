import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <div className="glow-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

