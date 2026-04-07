"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    plan: null,
    features: [
      "5 QR codes / month",
      "Basic QR types",
      "Email support",
      "History for 7 days",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    plan: "pro" as const,
    features: [
      "100 QR codes / month",
      "All QR types unlocked",
      "High resolution export",
      "Branding options",
      "Analytics (30 days)",
    ],
    highlight: true,
  },
  {
    name: "Business",
    price: "$29.99",
    plan: "business" as const,
    features: [
      "Unlimited QR codes",
      "Team collaboration",
      "API access",
      "Advanced analytics",
      "Priority support",
    ],
    highlight: false,
  },
];

function CanceledBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("canceled") !== "true") return null;
  return (
    <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 text-center">
      Payment canceled. No charges were made.
    </div>
  );
}

export default function PricingSection() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCheckout = async (plan: "pro" | "business") => {
    setLoadingPlan(plan);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        router.push("/");
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 mb-8">
          Choose a plan that works best for your business needs. No hidden fees.
        </p>

        <Suspense fallback={null}>
          <CanceledBanner />
        </Suspense>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, index) => (
            <div
              key={index}
              className={`rounded-xl border p-6 shadow-sm transition ${
                p.highlight
                  ? "border-green-500 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">{p.price}/mo</p>
              <ul className="text-gray-700 space-y-8 mb-6">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              {p.plan === null ? (
                <button
                  onClick={() => router.push("/generate")}
                  className="w-full py-2 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => void handleCheckout(p.plan!)}
                  disabled={loadingPlan === p.plan}
                  className="w-full py-2 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingPlan === p.plan ? "Redirecting…" : "Upgrade Now"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
