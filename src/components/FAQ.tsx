"use client";

import { useLanguage } from "src/contexts/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="bg-gray-50 dark:bg-[#0d0d0d] py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">
          {t.faq.title}
        </h2>
        <div className="space-y-6">
          {t.faq.items.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#141414] shadow-sm rounded-lg p-6 border border-gray-200 dark:border-white/10 hover:shadow-md hover:shadow-green-500/10 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <i className="ri-question-line text-green-600 text-2xl pt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {item.question}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-400">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
