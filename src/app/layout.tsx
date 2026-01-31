import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memewale - Meme Culture First",
  description:
    "Discover, share, and rate the best memes. A community-driven meme platform where funny comes first and merch follows.",
  keywords: [
    "memes",
    "funny",
    "viral",
    "desi memes",
    "indian memes",
    "bollywood memes",
    "cricket memes",
    "meme community",
  ],
  authors: [{ name: "Memewale" }],
  creator: "Memewale",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://memewale.com",
    siteName: "Memewale",
    title: "Memewale - Meme Culture First",
    description:
      "Discover, share, and rate the best memes. A community-driven meme platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memewale - Meme Culture First",
    description:
      "Discover, share, and rate the best memes. A community-driven meme platform.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
