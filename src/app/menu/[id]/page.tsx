"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "src/lib/supabase/client";
import { useLanguage } from "src/contexts/LanguageContext";

type Menu = {
  id: string;
  name: string;
  pdf_url: string;
};

export default function MenuViewerPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const m = t.menu;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("menus")
        .select("id, name, pdf_url")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setMenu(data as Menu);
      }
      setLoading(false);
    }
    void fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !menu) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <i className="ri-file-pdf-line text-5xl text-gray-300 dark:text-gray-600 mb-4 block" />
          <p className="text-gray-600 dark:text-gray-400">{m.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center gap-3">
        <i className="ri-file-pdf-line text-xl text-green-600" aria-hidden />
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
          {menu.name}
        </h1>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 relative">
        <iframe
          src={`${menu.pdf_url}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full absolute inset-0"
          style={{ minHeight: "calc(100vh - 100px)" }}
          title={menu.name}
          allow="fullscreen"
        />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-white/10 px-4 py-2 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
          <i className="ri-qr-code-line text-green-600" aria-hidden />
          {m.poweredBy}
        </p>
      </footer>
    </div>
  );
}
