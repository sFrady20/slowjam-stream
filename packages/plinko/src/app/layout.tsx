import "@/styles/main.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const displayFont = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});
const bodyFont = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});
const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "plinko",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="system"
      className={`${[displayFont, bodyFont, monoFont]
        .map((x) => x.variable)
        .join(" ")}`}
    >
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
