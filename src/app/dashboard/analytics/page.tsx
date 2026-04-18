"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { createClient } from "src/lib/supabase/client";
import { useLanguage } from "src/contexts/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────
type Scan = {
  scanned_at: string;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  qr_code_id: string;
};

type QrRow = { id: string; title: string | null };

// ── Colour palette ─────────────────────────────────────────────────────────
const GREEN = "#16a34a";
const GREENS = ["#16a34a", "#15803d", "#166534", "#14532d", "#bbf7d0"];
const DEVICE_COLORS: Record<string, string> = {
  Mobile: "#16a34a",
  Tablet: "#15803d",
  Desktop: "#166534",
  Other: "#374151",
};
const OS_COLORS: Record<string, string> = {
  iOS: "#16a34a",
  Android: "#15803d",
  Windows: "#1d4ed8",
  Mac: "#166534",
  Linux: "#374151",
  Other: "#4b5563",
};

// ── Tooltip styles ─────────────────────────────────────────────────────────
const darkTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #374151",
  borderRadius: 8,
  color: "#f9fafb",
  fontSize: 13,
};

// ── Helper: count by key ───────────────────────────────────────────────────
function countBy<T>(arr: T[], fn: (item: T) => string): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  for (const item of arr) {
    const k = fn(item) || "Other";
    map[k] = (map[k] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-500">
      <i className="ri-bar-chart-2-line text-4xl text-gray-700" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

// ── Custom dark tooltip ────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label, scansLabel }: Record<string, unknown> & { scansLabel?: string }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div style={darkTooltipStyle} className="px-3 py-2">
      <p className="text-gray-400 text-xs mb-1">{label as string}</p>
      <p className="font-semibold text-green-400">{(payload[0] as { value: number }).value} {scansLabel ?? "scans"}</p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const a = t.analytics;

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro" | "business" | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/"); return; }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    const userPlan = (profileData?.plan as "free" | "pro" | "business" | null) ?? "free";
    setPlan(userPlan);
    if (userPlan === "free") { setLoading(false); return; }

    // Fetch user's QR codes
    const { data: qrData } = await supabase
      .from("qr_codes")
      .select("id, title")
      .eq("user_id", user.id);

    const qrs: QrRow[] = qrData ?? [];
    const map: Record<string, string> = {};
    for (const q of qrs) map[q.id] = q.title ?? "Untitled";
    setQrMap(map);

    if (qrs.length === 0) { setLoading(false); return; }

    // Fetch scans for last 14 days
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const qrIds = qrs.map((q) => q.id);

    const { data: scanData } = await supabase
      .from("qr_scans")
      .select("scanned_at, device_type, os, browser, qr_code_id")
      .in("qr_code_id", qrIds)
      .gte("scanned_at", since)
      .order("scanned_at", { ascending: false });

    setScans((scanData as Scan[] | null) ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadData(); }, [loadData]);

  // ── Derived data ──────────────────────────────────────────────────────
  const { thisWeek, lastWeek, weekChange, daily, hourly, topQr, peakHour } = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const weekAgo = now - weekMs;
    const twoWeeksAgo = now - 2 * weekMs;

    const thisWeekScans = scans.filter((s) => new Date(s.scanned_at).getTime() >= weekAgo);
    const lastWeekScans = scans.filter((s) => {
      const t = new Date(s.scanned_at).getTime();
      return t >= twoWeeksAgo && t < weekAgo;
    });

    const thisWeek = thisWeekScans.length;
    const lastWeek = lastWeekScans.length;
    const weekChange = lastWeek === 0 ? null : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

    // Daily chart: last 7 days
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString(a.dateLocale, { day: "2-digit", month: "short" });
      days[key] = 0;
    }
    for (const s of thisWeekScans) {
      const key = new Date(s.scanned_at).toLocaleDateString(a.dateLocale, { day: "2-digit", month: "short" });
      if (key in days) days[key]++;
    }
    const daily = Object.entries(days).map(([name, value]) => ({ name, value }));

    // Hourly heatmap: all scans
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, value: 0 }));
    for (const s of scans) hours[new Date(s.scanned_at).getHours()].value++;

    const peakHour = hours.reduce((a, b) => (b.value > a.value ? b : a), hours[0]);

    // Top QR this week
    const qrCounts: Record<string, number> = {};
    for (const s of thisWeekScans) qrCounts[s.qr_code_id] = (qrCounts[s.qr_code_id] ?? 0) + 1;
    const topQrId = Object.entries(qrCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const topQr = topQrId ? (qrMap[topQrId] ?? "–") : "–";

    return { thisWeek, lastWeek, weekChange, daily, hourly: hours, topQr, peakHour };
  }, [scans, qrMap, a.dateLocale]);

  const deviceData = useMemo(() => countBy(scans, (s) => s.device_type ?? "Other"), [scans]);
  const osData = useMemo(() => countBy(scans, (s) => s.os ?? "Other"), [scans]);
  const browserData = useMemo(() => countBy(scans, (s) => s.browser ?? "Other"), [scans]);

  const maxHour = useMemo(() => Math.max(...hourly.map((h) => h.value), 1), [hourly]);

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  // ── Paywall ───────────────────────────────────────────────────────────
  if (plan === "free") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center space-y-6 py-24">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <i className="ri-bar-chart-2-line text-green-500 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">{a.paywallTitle}</h1>
            <p className="text-gray-400">{a.paywallDesc}</p>
            <Link href="/pricing" className="inline-flex bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition">
              {a.upgradeBtn}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{a.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{a.subtitle}</p>
            </div>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition">
              <i className="ri-arrow-left-line" /> {a.backToDashboard}
            </Link>
          </div>

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon="ri-qr-scan-2-line"
              label={a.thisWeek}
              value={thisWeek}
              sub={
                weekChange === null
                  ? a.noPreviousData
                  : weekChange >= 0
                  ? `${a.up} ${weekChange}% ${a.vsLastWeek}`
                  : `${a.down} ${Math.abs(weekChange)}% ${a.vsLastWeek}`
              }
              subColor={weekChange === null ? "text-gray-500" : weekChange >= 0 ? "text-green-400" : "text-red-400"}
            />
            <SummaryCard
              icon="ri-star-line"
              label={a.mostScanned}
              value={topQr}
              valueSmall
              sub={a.thisWeekLabel}
              subColor="text-gray-500"
            />
            <SummaryCard
              icon="ri-time-line"
              label={a.peakHour}
              value={peakHour.value > 0 ? `${String(peakHour.hour).padStart(2, "0")}:00` : "–"}
              sub={peakHour.value > 0 ? `${peakHour.value} ${a.scans}` : a.noDataYet}
              subColor="text-gray-500"
            />
            <SummaryCard
              icon="ri-device-line"
              label={a.total14Days}
              value={scans.length}
              sub={`${lastWeek} ${a.lastWeek}`}
              subColor="text-gray-500"
            />
          </div>

          {/* ── 7-day bar chart ── */}
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-white font-semibold mb-5">{a.last7Days}</h2>
            {scans.length === 0 ? (
              <EmptyState text={a.noScansYet} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={daily} barSize={32}>
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<DarkTooltip scansLabel={a.scans} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" fill={GREEN} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Hourly heatmap ── */}
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-white font-semibold mb-5">{a.hourlyDensity}</h2>
            {scans.length === 0 ? (
              <EmptyState text={a.noScans} />
            ) : (
              <div className="grid grid-cols-12 gap-1.5">
                {hourly.map(({ hour, value }) => {
                  const intensity = value / maxHour;
                  let bg = "bg-gray-800";
                  if (value > 0) {
                    if (intensity < 0.25) bg = "bg-green-950";
                    else if (intensity < 0.5) bg = "bg-green-800";
                    else if (intensity < 0.75) bg = "bg-green-600";
                    else bg = "bg-green-500";
                  }
                  return (
                    <div
                      key={hour}
                      title={`${a.hour} ${String(hour).padStart(2, "0")}:00 — ${value} ${a.scans}`}
                      className={`${bg} rounded-lg aspect-square flex flex-col items-center justify-center cursor-default transition-all hover:ring-2 hover:ring-green-400`}
                    >
                      <span className="text-[10px] text-gray-400 leading-none">{String(hour).padStart(2, "0")}</span>
                      {value > 0 && <span className="text-[10px] text-white font-bold leading-none mt-0.5">{value}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Device & OS donut charts ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DonutCard title={a.deviceType} data={deviceData} colorMap={DEVICE_COLORS} scansLabel={a.scans} />
            <DonutCard title={a.operatingSystem} data={osData} colorMap={OS_COLORS} scansLabel={a.scans} />
          </div>

          {/* ── Browser horizontal bars ── */}
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-white font-semibold mb-5">{a.browserDist}</h2>
            {browserData.length === 0 ? (
              <EmptyState text={a.noScans} />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, browserData.length * 48)}>
                <BarChart data={browserData} layout="vertical" barSize={20}>
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#d1d5db", fontSize: 13 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip scansLabel={a.scans} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {browserData.map((_, idx) => (
                      <Cell key={idx} fill={GREENS[idx % GREENS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SummaryCard({
  icon,
  label,
  value,
  sub,
  subColor,
  valueSmall = false,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  subColor: string;
  valueSmall?: boolean;
}) {
  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
          <i className={`${icon} text-green-500 text-base`} />
        </div>
      </div>
      <p className={`font-bold text-white leading-tight ${valueSmall ? "text-lg truncate" : "text-3xl"}`}>
        {value}
      </p>
      <p className={`text-xs ${subColor}`}>{sub}</p>
    </div>
  );
}

function DonutCard({
  title,
  data,
  colorMap,
  scansLabel,
}: {
  title: string;
  data: { name: string; value: number }[];
  colorMap: Record<string, string>;
  scansLabel: string;
}) {
  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
      <h2 className="text-white font-semibold mb-4">{title}</h2>
      {data.length === 0 ? (
        <EmptyState text="—" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={colorMap[entry.name] ?? GREENS[idx % GREENS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={darkTooltipStyle}
              formatter={(v) => [`${v as number} ${scansLabel}`, ""]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span style={{ color: "#d1d5db", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
