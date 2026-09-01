import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import { ClientProviders } from "@/components/ClientProviders"
import CacheVersionChecker from "@/components/CacheVersionChecker";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "NCSKIT.org - Nền tảng Phân tích Thống kê Chuẩn Khoa học",
  description: "Trình duyệt xử lý thuật toán R chuẩn xác dành cho nghiên cứu khoa học. Không cần cài đặt, không lưu dữ liệu trên server, bảo mật 100%.",
  keywords: ["thống kê ncs", "pls-sem", "cfa", "efa", "cronbach alpha", "phân tích dữ liệu", "nghiên cứu khoa học", "ai giải thích số liệu"],
  icons: {
    icon: '/favicon.svg',
  },
  verification: {
    google: "8CL6Lq3oZfJkk2HA8DhITuFYPTRgqnTBzBL3b0NEY1w",
  },
  openGraph: {
    title: "NCSKIT.org - Thống kê & Phân tích Chuyên sâu",
    description: "Giải pháp nghiên cứu 100% trong trình duyệt.",
    url: "https://stat.ncskit.org",
    siteName: "NCSKIT.org",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <CacheVersionChecker />
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}

