"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import type { User } from "@supabase/supabase-js";
import { createClient } from "src/lib/supabase/client";

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
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "register";
  }>({ open: false, tab: "login" });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setUser(data.user ?? null);
        setAuthLoading(false);
      }
    };

    void loadUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "U";
  const avatarLetter = String(displayName).trim().charAt(0).toUpperCase() || "U";

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
          {authLoading ? (
            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-md" />
          ) : user ? (
            <>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>
              <Link href="/dashboard" className="hover:text-green-600 transition font-medium">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthModal({ open: true, tab: "login" })}
                className="hover:text-green-600 transition"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthModal({ open: true, tab: "register" })}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              >
                Register
              </button>
            </>
          )}
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
            {authLoading ? (
              <div className="w-full h-9 bg-gray-100 animate-pulse rounded-md" />
            ) : user ? (
              <>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    {avatarLetter}
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-center hover:text-green-600"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await handleLogout();
                  }}
                  className="text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
