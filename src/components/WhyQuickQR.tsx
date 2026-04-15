"use client";

import { useLanguage } from "src/contexts/LanguageContext";

export default function WhyQuickQR() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-16 px-6 sm:px-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t.why.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          {t.why.sub}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {t.why.features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-[#141414] border border-transparent dark:border-white/10 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300 text-center sm:text-left"
            style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
          >
            <i className="ri-check-line text-green-600 text-4xl mb-4 block" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
