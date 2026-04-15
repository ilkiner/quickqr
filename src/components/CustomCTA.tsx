"use client";

import { useLanguage } from "src/contexts/LanguageContext";

export default function CustomCTA() {
  const { t } = useLanguage();

  return (
    <section className="w-full py-12 px-4 bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="bg-black dark:bg-[#141414] dark:border dark:border-white/10 px-6 py-12 rounded-3xl max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {t.cta.heading}
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          {t.cta.sub}
        </p>
        <a
          href="/contact"
          className="inline-block text-white text-lg bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full mt-6 transition-all duration-200"
        >
          {t.cta.button}
        </a>
      </div>
    </section>
  );
}
