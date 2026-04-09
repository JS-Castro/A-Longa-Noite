import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Longa Noite",
  description:
    "Vertical slice de um jogo de browser de sobrevivencia narrativa em portugues europeu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
