"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import AuthModal from "./AuthModal";
import type { User } from "@supabase/supabase-js";
import { createClient } from "src/lib/supabase/client";
import { useLanguage } from "src/contexts/LanguageContext";
import type { Lang } from "src/lib/i18n";

function linkClass(active: boolean) {
  return active
    ? "text-green-600 font-semibold hover:text-green-600 transition-all duration-200"
    : "text-gray-700 dark:text-gray-300 font-medium hover:text-green-600 dark:hover:text-green-400 transition-all duration-200";
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
    >
      {theme === "dark" ? (
        <i className="ri-sun-line text-lg text-yellow-400" />
      ) : (
        <i className="ri-moon-line text-lg" />
      )}
    </button>
  );
}

function LangSelector() {
  const { lang, setLang } = useLanguage();
  const langs: Lang[] = ["en", "tr", "pl"];
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {langs.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLang(l)}
            className={`uppercase transition-all duration-200 ${
              lang === l
                ? "text-green-600"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {l}
          </button>
          {i < langs.length - 1 && (
            <span className="text-gray-300 dark:text-gray-600">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "register";
  }>({ open: false, tab: "login" });

  const nav = [
    { href: "/", label: t.nav.generate },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

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
    <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/10 shadow-sm fixed top-0 left-0 z-50 transition-colors duration-200">
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

        <div className="hidden md:flex justify-end items-center gap-3 text-sm">
          <LangSelector />
          <ThemeToggle />
          {authLoading ? (
            <div className="w-20 h-8 bg-gray-100 dark:bg-white/10 animate-pulse rounded-md" />
          ) : user ? (
            <>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>
              <Link href="/dashboard" className="hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-all duration-200 font-medium">
                {t.nav.dashboard}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-400 hover:text-red-600 transition-all duration-200"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthModal({ open: true, tab: "login" })}
                className="hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-all duration-200"
              >
                {t.nav.login}
              </button>
              <button
                type="button"
                onClick={() => setAuthModal({ open: true, tab: "register" })}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-200"
              >
                {t.nav.register}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-gray-700 dark:text-gray-300 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/10 shadow-md flex flex-col items-center py-4 gap-3 text-gray-700 dark:text-gray-300 font-medium">
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
              <div className="w-full h-9 bg-gray-100 dark:bg-white/10 animate-pulse rounded-md" />
            ) : user ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    {avatarLetter}
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-center hover:text-green-600 dark:hover:text-green-400"
                >
                  {t.nav.dashboard}
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await handleLogout();
                  }}
                  className="hover:text-red-600 transition-all duration-200"
                >
                  {t.nav.logout}
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
                  className="hover:text-green-600 dark:hover:text-green-400"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModal({ open: true, tab: "register" });
                    setMenuOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-200"
                >
                  {t.nav.register}
                </button>
              </>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <LangSelector />
              <ThemeToggle />
            </div>
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
