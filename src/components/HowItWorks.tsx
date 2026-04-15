"use client";

import { useLanguage } from "src/contexts/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-gray-50 dark:bg-[#0a0a0a] py-16 transition-colors duration-200" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t.how.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.how.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {t.how.steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {index < t.how.steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-green-500 to-green-300" />
              )}
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl">
                <span className="text-5xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
