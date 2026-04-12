import type { Metadata } from "next";
import PricingSection from "src/components/PricingSection";
import FAQ from "src/components/FAQ";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare QuickQR plans — Free, Pro, and Business — with transparent monthly pricing and features for teams of every size.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen py-12 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <PricingSection />
      <FAQ />
    </main>
  );
}
