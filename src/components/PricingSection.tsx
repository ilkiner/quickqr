"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    plan: null,
    popular: false,
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
    popular: true,
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
    popular: false,
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
    <section className="py-16 bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((p, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                p.highlight
                  ? "border-green-500 dark:border-green-500 ring-2 ring-green-500 shadow-[0_0_30px_rgba(22,163,74,0.25)] dark:shadow-[0_0_40px_rgba(22,163,74,0.3)] scale-105 bg-white dark:bg-[#141414]"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] hover:shadow-lg hover:shadow-green-500/10 hover:scale-[1.02]"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              {/* Most Popular badge */}
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 mt-2">
                {p.name}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {p.price}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">/mo</span>
              </p>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-3 mb-6">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <i className="ri-check-line text-green-600 text-base flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {p.plan === null ? (
                <button
                  onClick={() => router.push("/generate")}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
                  style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => void handleCheckout(p.plan!)}
                  disabled={loadingPlan === p.plan}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                    p.highlight
                      ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/30"
                      : "bg-gray-900 dark:bg-white/10 hover:bg-gray-800 dark:hover:bg-white/20"
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
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
