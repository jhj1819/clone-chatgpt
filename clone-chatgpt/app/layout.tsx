import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 채팅 애플리케이션",
  description: "Next.js, OpenAI 및 Vercel AI SDK를 사용한 AI 채팅 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
