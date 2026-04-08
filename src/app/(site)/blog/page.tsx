import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "../../../lib/blog";

export const metadata: Metadata = {
  title: "Blog — QuickQR",
  description:
    "Tips, guides, and ideas on using QR codes to grow your business.",
};

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <span className="inline-block bg-green-600/20 text-green-400 rounded-full px-4 py-1 text-sm font-medium mb-4">
          Resources
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          QuickQR Blog
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Guides, tips, and ideas to help you get more out of QR codes.
        </p>
      </section>

      {/* Post grid */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Coloured top bar */}
              <div className="h-2 bg-green-600" />

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition leading-snug">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  {post.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
                  Read article
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to create your first QR code?
          </h2>
          <p className="text-gray-600 mb-6">
            Free to use — no account required for basic generation.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
          >
            Generate QR Free
          </Link>
        </div>
      </section>
    </main>
  );
}
