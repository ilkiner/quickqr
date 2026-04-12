"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { createClient } from "src/lib/supabase/client";

type Profile = {
  full_name: string | null;
  plan: "free" | "pro" | "business" | null;
};

type QrCodeRow = {
  id: string;
  type: string;
  title: string | null;
  qr_url: string | null;
  scan_count: number | null;
  created_at: string;
  is_dynamic: boolean | null;
  redirect_url: string | null;
};

const planLimitMap: Record<string, string> = {
  free: "5",
  pro: "100",
  business: "∞",
};

function SuccessBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("success") !== "true") return null;
  return (
    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
      Payment successful! Your plan has been upgraded. It may take a few seconds to reflect below.
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [qrRows, setQrRows] = useState<QrCodeRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [monthlyCreatedCount, setMonthlyCreatedCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please sign in to view your dashboard.");
        setLoading(false);
        return;
      }

      const [{ data: profileData, error: profileError }, { data: qrData, error: qrError }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, plan")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("qr_codes")
            .select("id, type, title, qr_url, scan_count, created_at, is_dynamic, redirect_url")
            .eq("user_id", user.id)
            .is("deleted_at", null)
            .order("created_at", { ascending: false }),
        ]);

      if (profileError) {
        setError(profileError.message);
      }
      if (qrError) {
        setError(qrError.message);
      }

      // Count all QR codes created this month (including deleted) for limit
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count: monthCount } = await supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", monthStart);

      setMonthlyCreatedCount(monthCount ?? 0);
      setProfile((profileData as Profile | null) ?? null);
      setQrRows((qrData as QrCodeRow[] | null) ?? []);
    } catch {
      setError("Could not load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const displayName = profile?.full_name?.trim() || "there";
  const plan = profile?.plan ?? "free";
  const planLimit = planLimitMap[plan] ?? "5";
  const totalScans = useMemo(
    () => qrRows.reduce((sum, row) => sum + (row.scan_count ?? 0), 0),
    [qrRows]
  );
  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return qrRows.filter((row) => {
      const created = new Date(row.created_at);
      return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
    }).length;
  }, [qrRows]);
  const limitReached =
    (plan === "free" && monthlyCreatedCount >= 5) ||
    (plan === "pro" && monthlyCreatedCount >= 100);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("qr_codes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setQrRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleDownload = async (row: QrCodeRow) => {
    if (!row.qr_url) return;
    const res = await fetch(row.qr_url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `quickqr-${row.type}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const handleSaveUrl = async (id: string) => {
    if (!editUrl.trim()) return;
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("qr_codes")
      .update({ redirect_url: editUrl.trim() })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setQrRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, redirect_url: editUrl.trim() } : row))
    );
    setEditingId(null);
    setEditUrl("");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Suspense fallback={null}>
            <SuccessBanner />
          </Suspense>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName}!</h1>
              <span className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm">
                {plan === "free" ? "Free Plan" : plan === "pro" ? "Pro Plan" : "Business Plan"}
              </span>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Upgrade to Pro
            </Link>
          </section>

          {limitReached && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-900 text-sm">
              {plan === "pro"
                ? "You've used all 100 QR codes for this month. Upgrade to Business for unlimited QR codes."
                : "You've reached your free limit. Upgrade to Pro for 100 QR codes/month."}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-3" />
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                </div>
              ))
            ) : (
              <>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">QR Codes Created</p>
                  <p className="text-2xl font-bold text-gray-900">{qrRows.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">Total Scans</p>
                  <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{thisMonthCount}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">Plan Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{planLimit}</p>
                </div>
              </>
            )}
          </section>

          <div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              <i className="ri-add-line text-lg" aria-hidden />
              Create New QR
            </Link>
          </div>

          {(plan === "pro" || plan === "business") && (
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900">Custom QR Design</h2>
                <p className="text-sm text-gray-500">
                  Get a professionally designed QR code tailored to your brand.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    plan === "business"
                      ? "bg-green-100 text-green-700"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {plan === "business" ? "30% off for Business members" : "20% off for Pro members"}
                </span>
                <Link
                  href="/custom-design"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md font-medium transition whitespace-nowrap"
                >
                  <i className="ri-palette-line text-lg" aria-hidden />
                  Request Custom Design
                </Link>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">QR History</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded-md" />
                ))}
              </div>
            ) : qrRows.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <p className="text-gray-500">No QR codes yet</p>
                <Link
                  href="/generate"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Create your first QR
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4">Title</th>
                      <th className="py-3 pr-4">Created</th>
                      <th className="py-3 pr-4">Scans</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrRows.map((row) => (
                      <tr key={row.id} className="border-b last:border-b-0">
                        <td className="py-3 pr-4 capitalize">
                          <span className="flex items-center gap-1.5">
                            {row.type}
                            {row.is_dynamic && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-1.5 py-0.5 rounded">
                                Dynamic
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{row.title || "-"}</td>
                        <td className="py-3 pr-4">{new Date(row.created_at).toLocaleDateString()}</td>
                        <td className="py-3 pr-4">{row.scan_count ?? 0}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {row.is_dynamic && (
                              editingId === row.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="url"
                                    value={editUrl}
                                    onChange={(e) => setEditUrl(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm w-48 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    placeholder="https://..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") void handleSaveUrl(row.id);
                                      if (e.key === "Escape") { setEditingId(null); setEditUrl(""); }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => void handleSaveUrl(row.id)}
                                    className="px-2 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setEditingId(null); setEditUrl(""); }}
                                    className="px-2 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { setEditingId(row.id); setEditUrl(row.redirect_url ?? ""); }}
                                  className="px-3 py-1 border border-green-200 text-green-700 rounded-md hover:bg-green-50"
                                >
                                  Edit URL
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() => void handleDownload(row)}
                              className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50"
                            >
                              Download
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(row.id)}
                              className="px-3 py-1 text-red-600 border border-red-100 rounded-md hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
