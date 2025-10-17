"use client";

export default function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 mb-12">
          Choose a plan that works best for your business needs. No hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl border p-6 shadow-sm transition ${
                plan.highlight
                  ? "border-green-500 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}/mo</p>
              <ul className="text-gray-700 space-y-8 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition">
                {plan.name === "Free" ? "Get Started" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
