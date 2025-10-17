import React from "react";

const featureList = [
  {
    title: "Fast",
    description: "Generate QR codes in seconds with our user-friendly interface.",
    icon: "ri-check-line",
  },
  {
    title: "Secure",
    description: "Your data is encrypted and protected.",
    icon: "ri-check-line",
  },
  {
    title: "Easy to Use",
    description: "Simple interface, powerful features.",
    icon: "ri-check-line",
  },
  {
    title: "Mobile Friendly",
    description: "Works perfectly on all devices.",
    icon: "ri-check-line",
  },
];

const WhyQuickQR = () => {
  return (
    <section className="w-full bg-white py-16 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why QuickQR?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the benefits of using QuickQR for your QR code needs.
        </p>
      </div>

      {/* Özellik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {featureList.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center sm:text-left"
          >
            <i
              className={`${feature.icon} text-green-600 text-4xl mb-4 block`}
              aria-hidden="true"
            ></i>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyQuickQR;
