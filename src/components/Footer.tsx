"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">QuickQR</h3>
          <p className="text-sm">
            Simple and fast QR code generator for websites, menus, and digital cards.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-md font-semibold mb-3">Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/generate" className="hover:text-white transition">
                Generate QR
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-md font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-semibold mb-3">Contact</h4>
          <p className="text-sm">Email: support@qrfast.dev</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} QuickQR. All rights reserved.
        {" · "}
        <Link href="/privacy" className="hover:text-gray-300 transition">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/terms" className="hover:text-gray-300 transition">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
