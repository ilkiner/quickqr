"use client";

import Link from "next/link";
import { useLanguage } from "src/contexts/LanguageContext";
import { multilingualPosts } from "src/lib/blog";

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const b = t.blog;

  const posts = multilingualPosts.map((p) => ({ slug: p.slug, ...p[lang] }));

  return (
    <main className="bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-200">
      {/* Hero */}
      <section className="bg-gray-900 dark:bg-[#0d0d0d] py-16 px-4 text-center border-b border-transparent dark:border-white/10">
        <span className="inline-block bg-green-600/20 text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-4">
          {b.resources}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {b.title}
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          {b.subtitle}
        </p>
      </section>

      {/* Post grid */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200"
            >
              <div className="h-2 bg-green-600" />
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 leading-relaxed">
                  {post.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 group-hover:gap-2 transition-all">
                  {b.readArticle}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 dark:bg-[#0d0d0d] border-t border-transparent dark:border-white/10 py-14 px-4 transition-colors duration-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {b.ctaTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {b.ctaDesc}
          </p>
          <Link
            href="/generate"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
          >
            {b.ctaBtn}
          </Link>
        </div>
      </section>
    </main>
  );
}
