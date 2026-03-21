import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate QR Code",
  description:
    "Build scannable QR codes for menus, profiles, maps, email, and Wi-Fi with QuickQR's step-by-step generator.",
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
