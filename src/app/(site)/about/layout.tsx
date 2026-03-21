import type { Metadata } from "next";

const siteUrl = "https://quickqr-black.vercel.app";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about QuickQR — our mission to make QR codes simple, fast, and accessible for every business.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QuickQR",
  url: siteUrl,
  description:
    "QuickQR helps businesses create professional QR codes for menus, contacts, Wi-Fi, and more.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {children}
    </>
  );
}
