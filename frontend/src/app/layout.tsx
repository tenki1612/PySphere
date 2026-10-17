import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PySphere - Nền tảng tự học lập trình Python thực chiến",
  description:
    "Học Python 60 ngày thực chiến: Vừa học lý thuyết, vừa gõ code trực tiếp trên trình duyệt qua WebAssembly, vừa trực quan hóa thuật toán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col transition-colors">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

