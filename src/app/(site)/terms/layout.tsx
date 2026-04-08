import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — QuickQR",
  description:
    "Read QuickQR's Terms of Service including plan limits, payment policy, content responsibility, and account rules.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
