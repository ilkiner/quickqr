"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "./AuthModal";

const nav = [
  { href: "/", label: "Generate" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function linkClass(active: boolean) {
  return active
    ? "text-green-600 font-semibold hover:text-green-600 transition"
    : "text-gray-700 font-medium hover:text-green-600 transition";
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "register";
  }>({ open: false, tab: "login" });

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-green-600">
          <Link href="/">QuickQR</Link>
        </div>

        <nav className="hidden md:flex justify-center gap-6 text-gray-700 font-medium text-base">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(pathname === item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex justify-end items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() =>
              setAuthModal({ open: true, tab: "login" })
            }
            className="hover:text-green-600 transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() =>
              setAuthModal({ open: true, tab: "register" })
            }
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            Register
          </button>
        </div>

        <button
          type="button"
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md flex flex-col items-center py-4 gap-3 text-gray-700 font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={linkClass(pathname === item.href)}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 mt-2 w-full px-8">
            <button
              type="button"
              onClick={() => {
                setAuthModal({ open: true, tab: "login" });
                setMenuOpen(false);
              }}
              className="hover:text-green-600"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModal({ open: true, tab: "register" });
                setMenuOpen(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
              Register
            </button>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        defaultTab={authModal.tab}
      />
    </header>
  );
}
