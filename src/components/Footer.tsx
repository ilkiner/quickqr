"use client";

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
            <li><a href="/generate" className="hover:text-white transition">Generate QR</a></li>
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-md font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-semibold mb-3">Contact</h4>
          <p className="text-sm">Email: support@quickqr.com</p>
          <p className="text-sm">Phone: +48 123 456 789</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} QuickQR. All rights reserved.
      </div>
    </footer>
  );
}
