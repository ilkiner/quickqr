"use client";

import Link from "next/link";
import { useLanguage } from "src/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <>
      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-6">
            {a.ourStory}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {a.heading}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {a.sub}
          </p>
        </div>
      </section>

      <section className="bg-green-600 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <p className="text-2xl md:text-3xl font-bold">500K+</p>
            <p className="text-sm md:text-base text-white/90 mt-1">{a.stats.qrGenerated}</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">50K+</p>
            <p className="text-sm md:text-base text-white/90 mt-1">{a.stats.happyUsers}</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">99.9%</p>
            <p className="text-sm md:text-base text-white/90 mt-1">{a.stats.uptime}</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">6</p>
            <p className="text-sm md:text-base text-white/90 mt-1">{a.stats.qrTypes}</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{a.mission.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{a.mission.p1}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{a.mission.p2}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "speed", icon: "ri-flashlight-line" },
              { key: "security", icon: "ri-shield-check-line" },
              { key: "accessibility", icon: "ri-global-line" },
              { key: "innovation", icon: "ri-lightbulb-line" },
            ].map((item) => {
              const val = a.values[item.key as keyof typeof a.values];
              return (
                <div
                  key={item.key}
                  className="bg-gray-50 dark:bg-[#141414] border border-transparent dark:border-white/10 rounded-xl p-5 hover:shadow-md hover:shadow-green-500/10 transition-all duration-200"
                >
                  <i className={`${item.icon} text-2xl text-green-600 mb-2`} aria-hidden />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{val.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{val.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-[#0d0d0d] py-16 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{a.whyBuilt.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{a.whyBuilt.p1}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{a.whyBuilt.p2}</p>
          <Link
            href="/generate"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
          >
            {a.whyBuilt.btn}
          </Link>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0a0a0a] py-12 px-4 md:px-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto bg-black dark:bg-[#141414] dark:border dark:border-white/10 rounded-3xl px-8 py-12 md:px-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{a.cta.title}</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">{a.cta.sub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
            >
              {a.cta.createBtn}
            </Link>
            <Link
              href="/pricing"
              className="inline-block border border-white/30 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-3xl transition"
            >
              {a.cta.pricingBtn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
