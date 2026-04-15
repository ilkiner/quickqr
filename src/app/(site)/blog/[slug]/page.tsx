import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPost } from "../../../../lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — QuickQR Blog`,
    description: post.description,
  };
}

/** Very small Markdown-to-JSX renderer — handles ##, ###, **, |table|, - lists */
function renderContent(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-3"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-2"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Table header (line starts with |)
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // Filter separator rows (---|---)
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/));
      const [header, ...body] = rows;
      const parseCells = (l: string) =>
        l
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);

      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] font-semibold text-gray-900 dark:text-gray-100">
              <tr>
                {parseCells(header).map((c, ci) => (
                  <th key={ci} className="text-left px-4 py-3">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {body.map((row, ri) => (
                <tr key={ri}>
                  {parseCells(row).map((c, ci) => (
                    <td key={ci} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc pl-6 space-y-2 my-4 text-gray-700">
          {items.map((item, ii) => (
            <li key={ii}>{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal pl-6 space-y-2 my-4 text-gray-700">
          {items.map((item, ii) => (
            <li key={ii}>{inlineFormat(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed my-4">
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

/** Handle **bold**, [text](url), and backtick `code` inline */
function inlineFormat(text: string): React.ReactNode {
  // Split on **bold**, [link](url), `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-gray-100 dark:bg-white/10 dark:text-gray-300 rounded px-1 text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith("http");
      return (
        <Link
          key={i}
          href={linkMatch[2]}
          className="text-green-600 hover:underline"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {linkMatch[1]}
        </Link>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== slug);

  return (
    <main className="bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-200">
      {/* Hero */}
      <section className="bg-gray-900 dark:bg-[#0d0d0d] py-16 px-4 border-b border-transparent dark:border-white/10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-6"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All articles
          </Link>

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span>{post.date}</span>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-gray-400 text-lg">{post.description}</p>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 py-12 dark:text-gray-300">
        {renderContent(post.content)}

        {/* CTA inside article */}
        <div className="mt-14 bg-black dark:bg-[#141414] dark:border dark:border-white/10 rounded-3xl px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Create your QR code in seconds
          </h2>
          <p className="text-gray-300 mb-6">
            Free to use — no account required for basic generation.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-3xl transition"
          >
            Generate QR Free
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {otherPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-[#0d0d0d] py-14 px-4 border-t border-transparent dark:border-white/10 transition-colors duration-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              More articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-md hover:shadow-green-500/10 transition-all duration-200"
                >
                  <div className="h-1.5 bg-green-600" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{p.date}</span>
                      <span>&middot;</span>
                      <span>{p.readingTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
