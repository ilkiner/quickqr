"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "src/components/AuthModal";
import type { User } from "@supabase/supabase-js";
import { createClient } from "src/lib/supabase/client";
import { useLanguage } from "src/contexts/LanguageContext";

const QUERY_TO_ID: Record<string, string> = {
  url: "url", website: "url", link: "url",
  "restaurant-menu": "restaurant", restaurant: "restaurant",
  vcard: "vcard",
  "social-media": "social", social: "social",
  "google-maps": "location", maps: "location", location: "location",
  email: "email",
  wifi: "wifi",
};

const ID_TO_QUERY: Record<string, string> = {
  url: "url", restaurant: "restaurant-menu", vcard: "vcard",
  social: "social-media", location: "google-maps", email: "email", wifi: "wifi",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidHttpUrl(value: string): boolean {
  const t = value.trim();
  if (!/^https?:\/\//i.test(t)) return false;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: "ri-instagram-line", placeholder: "https://instagram.com/yourbrand" },
  { key: "twitter", label: "Twitter / X", icon: "ri-twitter-x-line", placeholder: "https://x.com/yourbrand" },
  { key: "linkedin", label: "LinkedIn", icon: "ri-linkedin-box-line", placeholder: "https://linkedin.com/in/yourprofile" },
  { key: "tiktok", label: "TikTok", icon: "ri-tiktok-line", placeholder: "https://tiktok.com/@yourbrand" },
  { key: "facebook", label: "Facebook", icon: "ri-facebook-circle-line", placeholder: "https://facebook.com/yourbrand" },
  { key: "youtube", label: "YouTube", icon: "ri-youtube-line", placeholder: "https://youtube.com/@yourchannel" },
];

const QR_PX = 300;
const WATERMARK_H = 28;
const FRAME_H = 40;
const FREE_LIMIT = 5;
const PRO_LIMIT = 100;

function getUnauthQrKey(): string {
  const now = new Date();
  return `uqr_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getUnauthQrCount(): number {
  if (typeof window === "undefined") return 0;
  const key = getUnauthQrKey();
  const count = localStorage.getItem(key);
  return count ? parseInt(count, 10) : 0;
}

function incrementUnauthQrCount(): void {
  if (typeof window === "undefined") return;
  const key = getUnauthQrKey();
  const count = getUnauthQrCount();
  localStorage.setItem(key, String(count + 1));
}

async function downloadQrCanvas(proxyUrl: string, withWatermark: boolean, filename: string, frameLabel: string): Promise<void> {
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("QR fetch failed");
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const frameH = frameLabel ? FRAME_H : 0;
      const canvas = document.createElement("canvas");
      canvas.width = QR_PX;
      canvas.height = QR_PX + frameH + (withWatermark ? WATERMARK_H : 0);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, QR_PX, QR_PX);
      let yOffset = QR_PX;
      if (frameLabel) {
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(0, yOffset, QR_PX, FRAME_H);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px system-ui, Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(frameLabel, QR_PX / 2, yOffset + FRAME_H / 2);
        yOffset += FRAME_H;
      }
      if (withWatermark) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, yOffset, QR_PX, WATERMARK_H);
        ctx.fillStyle = "#9ca3af";
        ctx.font = "500 12px system-ui, Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Made with QuickQR", QR_PX / 2, yOffset + WATERMARK_H / 2);
      }
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = filename;
      a.click();
      resolve();
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });
}

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const g = t.generate;

  const qrTypeList = [
    { id: "url", label: g.types.url },
    { id: "restaurant", label: g.types.restaurant },
    { id: "vcard", label: g.types.vcard },
    { id: "social", label: g.types.social },
    { id: "location", label: g.types.location },
    { id: "email", label: g.types.email },
    { id: "wifi", label: g.types.wifi },
  ];

  const FRAME_OPTIONS = [
    { value: "", label: g.frames.noFrame },
    { value: g.frames.scanMe, label: g.frames.scanMe },
    { value: g.frames.seeMenu, label: g.frames.seeMenu },
    { value: g.frames.rateUs, label: g.frames.rateUs },
    { value: g.frames.scanWifi, label: g.frames.scanWifi },
    { value: g.frames.getDirections, label: g.frames.getDirections },
  ];

  const [activeType, setActiveType] = useState("url");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savePromptVisible, setSavePromptVisible] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "register" }>({ open: false, tab: "register" });
  const [profilePlan, setProfilePlan] = useState<"free" | "pro" | "business" | null>(null);
  const [planLoaded, setPlanLoaded] = useState(false);
  const [qrProxyUrl, setQrProxyUrl] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [limitReachedModal, setLimitReachedModal] = useState(false);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [frameLabel, setFrameLabel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDynamic, setIsDynamic] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const applyUserAndPlan = async (user: User | null) => {
      setCurrentUser(user);
      if (!user) { setProfilePlan(null); setPlanLoaded(true); return; }
      setPlanLoaded(false);
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      if (!mounted) return;
      const p = data?.plan;
      if (p === "pro" || p === "business") setProfilePlan(p);
      else setProfilePlan("free");
      setPlanLoaded(true);
    };

    void supabase.auth.getUser().then(({ data: { user } }) => { if (mounted) void applyUserAndPlan(user ?? null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) void applyUserAndPlan(session?.user ?? null);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const syncQueryFromType = useCallback((id: string) => {
    const q = ID_TO_QUERY[id] ?? "restaurant-menu";
    router.replace(`/generate?type=${q}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    const raw = searchParams.get("type");
    if (!raw) return;
    const id = QUERY_TO_ID[raw.toLowerCase()];
    if (id) setActiveType(id);
  }, [searchParams]);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) setFormValues((prev) => ({ ...prev, url: data }));
  }, [searchParams]);

  const resetForm = useCallback(() => {
    setFormValues({});
    setErrors({});
    setQrUrl("");
    setQrProxyUrl("");
    setImgLoaded(false);
    setImgError(false);
  }, []);

  const handleTypeChange = (id: string) => {
    setActiveType(id);
    resetForm();
    syncQueryFromType(id);
    if (id === "wifi") setFrameLabel(g.frames.scanWifi);
    else if (id === "location") setFrameLabel(g.frames.getDirections);
    else setFrameLabel("");
  };

  const setField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  function buildQrData(activeType: string, values: Record<string, string>): { data: string; error?: string } {
    switch (activeType) {
      case "url": {
        const url = values.url?.trim() ?? "";
        if (!url) return { data: "", error: g.errors.urlRequired };
        if (!isValidHttpUrl(url)) return { data: "", error: g.errors.invalidUrl };
        return { data: url };
      }
      case "restaurant": {
        const url = values.url?.trim() ?? "";
        if (!url) return { data: "", error: g.errors.urlRequired };
        if (!isValidHttpUrl(url)) return { data: "", error: g.errors.invalidUrl };
        return { data: url };
      }
      case "social": {
        const filled = SOCIAL_PLATFORMS.map((p) => ({ label: p.label, url: values[p.key]?.trim() ?? "" })).filter((p) => p.url);
        if (filled.length === 0) return { data: "", error: g.errors.socialRequired };
        for (const { url } of filled) {
          if (!isValidHttpUrl(url)) return { data: "", error: g.errors.invalidUrl };
        }
        if (filled.length === 1) return { data: filled[0].url };
        return { data: filled.map(({ label, url }) => `${label}: ${url}`).join("\n") };
      }
      case "location": {
        const address = values.address?.trim() ?? "";
        if (!address) return { data: "", error: g.errors.addressRequired };
        const query = [values.businessName?.trim(), address].filter(Boolean).join(", ");
        return { data: `https://maps.google.com/?q=${encodeURIComponent(query)}` };
      }
      case "vcard": {
        const name = values.name?.trim() ?? "";
        const phone = values.phone?.trim() ?? "";
        const email = values.email?.trim() ?? "";
        const website = values.website?.trim() ?? "";
        if (!name) return { data: "", error: g.errors.nameRequired };
        if (email && !emailRegex.test(email)) return { data: "", error: g.errors.invalidEmail };
        if (website && !isValidHttpUrl(website)) return { data: "", error: g.errors.invalidWebsite };
        return { data: ["BEGIN:VCARD", "VERSION:3.0", `FN:${name}`, `TEL:${phone}`, `EMAIL:${email}`, `URL:${website}`, "END:VCARD"].join("\n") };
      }
      case "email": {
        const to = values.to?.trim() ?? "";
        const subject = values.subject ?? "";
        const body = values.body ?? "";
        if (!to) return { data: "", error: g.errors.recipientRequired };
        if (!emailRegex.test(to)) return { data: "", error: g.errors.invalidEmail };
        return { data: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
      }
      case "wifi": {
        const ssid = values.ssid?.trim() ?? "";
        const password = values.password ?? "";
        const security = values.security ?? "WPA";
        if (!ssid) return { data: "", error: g.errors.ssidRequired };
        if (security === "nopass") return { data: `WIFI:T:nopass;S:${ssid};P:;;` };
        return { data: `WIFI:T:${security};S:${ssid};P:${password};;` };
      }
      default:
        return { data: "", error: "Unknown type" };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = buildQrData(activeType, formValues);
    if (error) { setErrors({ _form: error }); return; }
    setErrors({});
    setSubmitting(true);

    const paid = profilePlan === "pro" || profilePlan === "business";
    const dynamicEnabled = isDynamic && paid;
    const colorParam = `&color=${qrColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user ?? null);

      if (user) {
        if (profilePlan !== "business") {
          const monthlyLimit = profilePlan === "pro" ? PRO_LIMIT : FREE_LIMIT;
          const now = new Date();
          const { count, error: countError } = await supabase.from("qr_codes").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString());
          if (countError) { setErrors({ _form: countError.message }); setSubmitting(false); return; }
          if ((count ?? 0) >= monthlyLimit) { setLimitReachedModal(true); setSubmitting(false); return; }
        }

        const title = formValues.name?.trim() || formValues.ssid?.trim() || qrTypeList.find((item) => item.id === activeType)?.label || "QR Code";

        if (dynamicEnabled) {
          const { data: inserted, error: insertError } = await supabase.from("qr_codes").insert({ user_id: user.id, type: activeType, title, data, qr_url: "", is_dynamic: true, redirect_url: data }).select("id").single();
          if (insertError || !inserted) { setErrors({ _form: insertError?.message ?? "Failed to create dynamic QR" }); setSubmitting(false); return; }
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
          const dynamicData = `${baseUrl}/r/${inserted.id}`;
          const encoded = encodeURIComponent(dynamicData);
          const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}${colorParam}`;
          const proxyUrl = `/api/qr-image?url=${encodeURIComponent(generatedUrl)}`;
          await supabase.from("qr_codes").update({ qr_url: generatedUrl }).eq("id", inserted.id);
          setQrUrl(generatedUrl); setQrProxyUrl(proxyUrl); setImgLoaded(false); setImgError(false); setSavePromptVisible(false);
        } else {
          const encoded = encodeURIComponent(data);
          const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}${colorParam}`;
          const proxyUrl = `/api/qr-image?url=${encodeURIComponent(generatedUrl)}`;
          setQrUrl(generatedUrl); setQrProxyUrl(proxyUrl); setImgLoaded(false); setImgError(false);
          const { error: insertError } = await supabase.from("qr_codes").insert({ user_id: user.id, type: activeType, title, data, qr_url: generatedUrl });
          if (insertError) setErrors({ _form: insertError.message });
          else setSavePromptVisible(false);
        }
      } else {
        const encoded = encodeURIComponent(data);
        const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}${colorParam}`;
        const proxyUrl = `/api/qr-image?url=${encodeURIComponent(generatedUrl)}`;
        setQrUrl(generatedUrl); setQrProxyUrl(proxyUrl); setImgLoaded(false); setImgError(false);
        const unauthCount = getUnauthQrCount();
        if (unauthCount >= FREE_LIMIT) { setLimitReachedModal(true); setSubmitting(false); return; }
        incrementUnauthQrCount();
        setSavePromptVisible(true);
      }
    } catch {
      setErrors({ _form: g.errors.saveFailed });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSavePromptVisible(false);
    window.location.reload();
  };

  const downloadPng = async () => {
    if (!qrProxyUrl || !imgLoaded) return;
    const paid = profilePlan === "pro" || profilePlan === "business";
    const withWatermark = !currentUser || !paid;
    setDownloading(true);
    try {
      await downloadQrCanvas(qrProxyUrl, withWatermark, `quickqr-${activeType}-${Date.now()}.png`, frameLabel);
    } catch {
      setErrors({ _form: g.errors.downloadFailed });
    } finally {
      setDownloading(false);
    }
  };

  const inputClass = (key: string) =>
    `mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-[#1e1e1e] dark:text-gray-200 dark:placeholder-gray-500 ${
      errors[key] ? "border-red-500" : "border-gray-300 dark:border-white/10"
    }`;

  const fieldError = (key: string) =>
    errors[key] ? <p className="text-red-500 text-sm mt-1">{errors[key]}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-200">
      <nav className="bg-white dark:bg-[#111111] border-b dark:border-white/10 px-6 py-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600 hover:text-green-700 transition" title="Back to home">
          <i className="ri-qr-code-line text-2xl" aria-hidden />
          QuickQR
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
          <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 text-sm font-medium">
            <i className="ri-home-line text-lg" aria-hidden />
            {g.home}
          </Link>
          <button type="button" onClick={() => setShowHistory(!showHistory)} className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1">
            <i className="ri-time-line text-lg" />
            {g.viewHistory}
          </button>

          {currentUser ? (
            <button type="button" onClick={() => void handleLogout()} className="text-gray-600 dark:text-gray-400 hover:text-red-600 flex items-center gap-1">
              <i className="ri-logout-box-r-line text-lg" />
              {g.logout}
            </button>
          ) : (
            <button type="button" onClick={() => setAuthModal({ open: true, tab: "register" })} className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1">
              <i className="ri-user-add-line text-lg" />
              {g.register}
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="space-y-2">
          {qrTypeList.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleTypeChange(type.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeType === type.id
                  ? "bg-green-600 text-white font-semibold"
                  : "bg-white dark:bg-[#1a1a1a] border dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#141414] shadow dark:shadow-none border border-transparent dark:border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              {g.createTitle}: {qrTypeList.find((q) => q.id === activeType)?.label}
            </h2>

            {errors._form && <p className="text-red-500 text-sm mb-4">{errors._form}</p>}

            {activeType === "url" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.websiteUrl}</label>
                  <input type="url" autoComplete="url" value={formValues.url ?? ""} onChange={(e) => setField("url", e.target.value)} placeholder="https://example.com" className={inputClass("url")} />
                  {fieldError("url")}
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}

            {activeType === "restaurant" && (
              <div className="space-y-4">
                {/* Business PDF upload toggle */}
                {planLoaded && profilePlan === "business" && (
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => { setPdfMode(false); setPdfFile(null); setErrors({}); }}
                      className={`flex-1 py-2 text-sm font-medium transition ${!pdfMode ? "bg-green-600 text-white" : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400"}`}
                    >
                      {g.menuUrl}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPdfMode(true); setErrors({}); }}
                      className={`flex-1 py-2 text-sm font-medium transition ${pdfMode ? "bg-green-600 text-white" : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400"}`}
                    >
                      {t.menu.uploadPdfMenu}
                    </button>
                  </div>
                )}

                {pdfMode && profilePlan === "business" ? (
                  <form noValidate onSubmit={async (e) => {
                    e.preventDefault();
                    const name = formValues.restaurantName?.trim();
                    if (!name) { setErrors({ restaurantName: g.errors.nameRequired }); return; }
                    if (!pdfFile) { setErrors({ pdf: t.menu.selectPdf }); return; }
                    if (pdfFile.size > 10 * 1024 * 1024) { setErrors({ pdf: t.menu.fileTooLarge }); return; }
                    if (pdfFile.type !== "application/pdf") { setErrors({ pdf: t.menu.invalidType }); return; }
                    setErrors({});
                    setPdfUploading(true);
                    setSubmitting(true);
                    try {
                      const supabase = createClient();
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) { setErrors({ _form: g.errors.saveFailed }); return; }
                      const filePath = `${user.id}/${Date.now()}.pdf`;
                      const { error: uploadError } = await supabase.storage.from("menus").upload(filePath, pdfFile, { contentType: "application/pdf", upsert: false });
                      if (uploadError) { setErrors({ _form: t.menu.uploadFailed }); return; }
                      const { data: { publicUrl } } = supabase.storage.from("menus").getPublicUrl(filePath);
                      const { data: inserted, error: insertError } = await supabase.from("menus").insert({ user_id: user.id, name, pdf_url: publicUrl }).select("id").single();
                      if (insertError || !inserted) { setErrors({ _form: t.menu.uploadFailed }); return; }
                      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                      const menuUrl = `${baseUrl}/menu/${inserted.id as string}`;
                      const colorParam = `&color=${qrColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;
                      const encoded = encodeURIComponent(menuUrl);
                      const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}${colorParam}`;
                      const proxyUrl = `/api/qr-image?url=${encodeURIComponent(generatedUrl)}`;
                      await supabase.from("qr_codes").insert({ user_id: user.id, type: "restaurant", title: name, data: menuUrl, qr_url: generatedUrl, is_dynamic: false });
                      setQrUrl(generatedUrl); setQrProxyUrl(proxyUrl); setImgLoaded(false); setImgError(false); setSavePromptVisible(false);
                    } catch {
                      setErrors({ _form: t.menu.uploadFailed });
                    } finally {
                      setPdfUploading(false);
                      setSubmitting(false);
                    }
                  }} className="space-y-4">
                    <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                      <i className="ri-file-pdf-line mr-1" aria-hidden /> {t.menu.uploadPdfDesc}
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.menu.restaurantName}</label>
                      <input type="text" value={formValues.restaurantName ?? ""} onChange={(e) => setField("restaurantName", e.target.value)} placeholder={t.menu.restaurantNamePlaceholder} className={inputClass("restaurantName")} />
                      {errors.restaurantName && <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.menu.selectPdf}</label>
                      <input
                        type="file" accept="application/pdf"
                        onChange={(e) => { const f = e.target.files?.[0] ?? null; setPdfFile(f); setErrors({}); }}
                        className="mt-1 w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400"
                      />
                      {pdfFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.menu.pdfSelected} {pdfFile.name}</p>}
                      {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
                    </div>
                    <button type="submit" disabled={submitting || pdfUploading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold disabled:opacity-50">
                      {pdfUploading ? t.menu.uploading : g.generateQR}
                    </button>
                  </form>
                ) : (
                  <form noValidate onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.menuUrl}</label>
                      <input type="url" autoComplete="url" value={formValues.url ?? ""} onChange={(e) => setField("url", e.target.value)} placeholder="https://yourrestaurant.com/menu" className={inputClass("url")} />
                      {fieldError("url")}
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                      {submitting ? g.generating : g.generateQR}
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeType === "social" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{g.socialHint}</p>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{platform.label}</label>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                        <i className={`${platform.icon} text-lg`} aria-hidden />
                      </span>
                      <input
                        type="url" autoComplete="url" value={formValues[platform.key] ?? ""} onChange={(e) => setField(platform.key, e.target.value)}
                        placeholder={platform.placeholder}
                        className={`flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-[#1e1e1e] dark:text-gray-200 dark:placeholder-gray-500 ${errors[platform.key] ? "border-red-500" : "border-gray-300 dark:border-white/10"}`}
                      />
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold mt-2">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}

            {activeType === "location" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.businessName} <span className="text-gray-400 font-normal">{g.optional}</span></label>
                  <input type="text" autoComplete="organization" value={formValues.businessName ?? ""} onChange={(e) => setField("businessName", e.target.value)} placeholder="e.g. QuickQR Cafe" className={inputClass("businessName")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.address}</label>
                  <input type="text" autoComplete="street-address" value={formValues.address ?? ""} onChange={(e) => setField("address", e.target.value)} placeholder="e.g. 123 Main St, New York, NY" className={inputClass("address")} />
                  {fieldError("address")}
                </div>
                {(formValues.address ?? "").trim() && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-md px-3 py-2 break-all">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{g.generatedLink} </span>
                    {`https://maps.google.com/?q=${encodeURIComponent([formValues.businessName?.trim(), formValues.address?.trim()].filter(Boolean).join(", "))}`}
                  </p>
                )}
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <i className="ri-map-pin-line mr-1" aria-hidden /> {g.locationFrameHint}
                </p>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}

            {activeType === "vcard" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.fullName}</label>
                  <input type="text" autoComplete="name" value={formValues.name ?? ""} onChange={(e) => setField("name", e.target.value)} className={inputClass("name")} />
                  {fieldError("name")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.phone}</label>
                  <input type="tel" autoComplete="tel" value={formValues.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} className={inputClass("phone")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.email}</label>
                  <input type="email" autoComplete="email" value={formValues.email ?? ""} onChange={(e) => setField("email", e.target.value)} className={inputClass("email")} />
                  {fieldError("email")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.website}</label>
                  <input type="url" autoComplete="url" value={formValues.website ?? ""} onChange={(e) => setField("website", e.target.value)} placeholder="https://" className={inputClass("website")} />
                  {fieldError("website")}
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}

            {activeType === "email" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.to}</label>
                  <input type="email" autoComplete="email" value={formValues.to ?? ""} onChange={(e) => setField("to", e.target.value)} className={inputClass("to")} />
                  {fieldError("to")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.subject}</label>
                  <input type="text" value={formValues.subject ?? ""} onChange={(e) => setField("subject", e.target.value)} className={inputClass("subject")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.body}</label>
                  <textarea rows={4} value={formValues.body ?? ""} onChange={(e) => setField("body", e.target.value)} className={`${inputClass("body")} min-h-[100px]`} />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}

            {activeType === "wifi" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.networkName}</label>
                  <input type="text" autoComplete="off" value={formValues.ssid ?? ""} onChange={(e) => setField("ssid", e.target.value)} className={inputClass("ssid")} />
                  {fieldError("ssid")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.securityType}</label>
                  <select value={formValues.security ?? "WPA"} onChange={(e) => setField("security", e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-[#1e1e1e] dark:text-gray-200">
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WPA3">WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{g.noPassword}</option>
                  </select>
                </div>
                {(formValues.security ?? "WPA") !== "nopass" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{g.password}</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"} autoComplete="new-password"
                        value={formValues.password ?? ""} onChange={(e) => setField("password", e.target.value)}
                        className={`w-full border rounded-md px-4 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 transition" aria-label={showPassword ? g.hidePassword : g.showPassword}>
                        <i className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} aria-hidden />
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <i className="ri-wifi-line mr-1" aria-hidden /> {g.wifiFrameHint}
                </p>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                  {submitting ? g.generating : g.generateQR}
                </button>
              </form>
            )}
          </div>

          {planLoaded && (profilePlan === "pro" || profilePlan === "business") && (
            <div className="bg-white dark:bg-[#141414] shadow dark:shadow-none border border-transparent dark:border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{g.dynamicTitle}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{g.dynamicDesc}</p>
                </div>
                <button type="button" role="switch" aria-checked={isDynamic} onClick={() => setIsDynamic((v) => !v)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isDynamic ? "bg-green-600" : "bg-gray-200 dark:bg-white/20"}`}>
                  <span className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${isDynamic ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              {isDynamic && (
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mt-3">
                  <i className="ri-links-line mr-1" aria-hidden />
                  {g.dynamicHint}
                </p>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-[#141414] shadow dark:shadow-none border border-transparent dark:border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{g.customizeTitle}</h2>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{g.qrColor}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{qrColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{g.bgColor}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-300" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {qrUrl && (
            <div className="bg-white shadow rounded-lg p-6 text-center space-y-4">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{g.previewTitle}</h2>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {FRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrameLabel(opt.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                      frameLabel === opt.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border-gray-300 dark:border-white/10 hover:border-green-400"
                    }`}
                  >
                    {opt.label || g.frames.noFrame}
                  </button>
                ))}
              </div>
              <div className="inline-flex flex-col items-center border-2 border-green-500 rounded-2xl p-4">
                <div className="relative w-[300px] h-[300px]">
                  {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse text-gray-500 dark:text-gray-400 text-sm">
                      {g.loadingPreview}
                    </div>
                  )}
                  {imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg text-red-500 text-sm">
                      {g.failedLoad}
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrProxyUrl} alt="Generated QR code" width={300} height={300} className={imgLoaded ? "block" : "invisible"} onLoad={() => setImgLoaded(true)} onError={() => setImgError(true)} />
                </div>
                {imgLoaded && frameLabel && (
                  <div className="w-[300px] flex items-center justify-center font-bold text-white text-base" style={{ backgroundColor: "#16a34a", height: `${FRAME_H}px` }}>
                    {frameLabel}
                  </div>
                )}
                {imgLoaded && (!currentUser || !(profilePlan === "pro" || profilePlan === "business")) && (
                  <p className="text-xs text-gray-400 mt-2 tracking-wide">Made with QuickQR</p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button type="button" onClick={() => void downloadPng()} disabled={!imgLoaded || downloading} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {downloading ? g.downloading : g.downloadPng}
                </button>
                <button type="button" onClick={() => { setQrUrl(""); resetForm(); }} className="px-4 py-2 border dark:border-white/10 rounded-md text-gray-700 dark:text-gray-300 dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#242424]">
                  {g.createAnother}
                </button>
              </div>
              {!currentUser && savePromptVisible && (
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 flex flex-wrap items-center justify-center gap-3">
                  <span>{g.savePrompt}</span>
                  <button type="button" onClick={() => setAuthModal({ open: true, tab: "register" })} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm">
                    {g.createFreeAccount}
                  </button>
                </div>
              )}
            </div>
          )}

          {showHistory && (
            <div className="bg-white dark:bg-[#141414] shadow dark:shadow-none border border-transparent dark:border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{g.historyTitle}</h2>
              <p className="text-gray-500 dark:text-gray-400">{g.noHistory}</p>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={authModal.open} onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))} defaultTab={authModal.tab} />

      {limitReachedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#141414] border border-transparent dark:border-white/10 rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <i className="ri-alert-line text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {profilePlan === "pro" ? g.limitProTitle : g.limitFreeTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profilePlan === "pro" ? g.limitProDesc : g.limitFreeDesc}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {profilePlan === "pro" ? (
                  <><span className="font-semibold text-green-700">{g.businessPlanLabel}</span> {g.businessPlanFeature}</>
                ) : (
                  <><span className="font-semibold text-green-700">{g.proPlanLabel}</span> {g.proPlanFeature}</>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <button type="button" onClick={() => { router.push("/pricing"); setLimitReachedModal(false); }} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                {profilePlan === "pro" ? g.upgradeToBusiness : g.upgradeToProBtn}
              </button>
              <button type="button" onClick={() => setLimitReachedModal(false)} className="w-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg transition">
                {g.maybeLater}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
