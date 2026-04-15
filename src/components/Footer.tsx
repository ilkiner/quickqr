"use client";

import Link from "next/link";
import { useLanguage } from "src/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-[#0a0a0a] dark:border-t dark:border-white/10 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">QuickQR</h3>
          <p className="text-sm">{t.footer.desc}</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-md font-semibold mb-3">{t.footer.links}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/generate" className="hover:text-white transition">{t.nav.generate}</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">{t.nav.pricing}</Link></li>
            <li><Link href="/about" className="hover:text-white transition">{t.nav.about}</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">{t.nav.blog}</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">{t.nav.contact}</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-md font-semibold mb-3">{t.footer.followUs}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-semibold mb-3">{t.footer.contact}</h4>
          <p className="text-sm">Email: support@qrfast.dev</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition">{t.footer.privacy}</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">{t.footer.terms}</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-700 dark:border-white/10">
        © {new Date().getFullYear()} QuickQR. {t.footer.copyright}
        {" · "}
        <Link href="/privacy" className="hover:text-gray-300 transition">{t.footer.privacy}</Link>
        {" · "}
        <Link href="/terms" className="hover:text-gray-300 transition">{t.footer.terms}</Link>
      </div>
    </footer>
  );
}
