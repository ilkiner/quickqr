import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://quickqr-black.vercel.app";

const defaultTitle = "QuickQR – Free QR Code Generator for Business";
const defaultDescription =
  "Generate professional QR codes instantly — restaurant menus, vCards, Wi-Fi, social media, maps and more. Fast, free, and no sign-up required.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | QuickQR",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "QuickQR",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
