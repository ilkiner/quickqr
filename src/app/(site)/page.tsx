import type { Metadata } from "next";
import Hero from "../../components/Hero";
import QRTypeGrid from "../../components/QRTypeGrid";
import CustomCTA from "src/components/CustomCTA";
import WhyQuickQR from "src/components/WhyQuickQR";
import HowItWorks from "src/components/HowItWorks";

const siteUrl = "https://quickqr-black.vercel.app";

export const metadata: Metadata = {
  title: "QuickQR – Free QR Code Generator",
  description:
    "Create QR codes for restaurant menus, Wi-Fi, vCards, social profiles, maps, and email. Free, fast, and no account required.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "QuickQR",
      url: siteUrl,
      description:
        "Generate professional QR codes instantly — restaurant menus, vCards, Wi-Fi, social media, maps and more.",
    },
    {
      "@type": "SoftwareApplication",
      name: "QuickQR",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: siteUrl,
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <QRTypeGrid />
      <CustomCTA />
      <WhyQuickQR />
      <HowItWorks />
    </main>
  );
}
