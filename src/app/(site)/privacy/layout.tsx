import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QuickQR",
  description:
    "Learn how QuickQR collects, uses, and protects your personal data including email, QR history, payments, and cookies.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
