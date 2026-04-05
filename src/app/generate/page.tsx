"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "src/components/AuthModal";
import type { User } from "@supabase/supabase-js";
import { createClient } from "src/lib/supabase/client";

const qrTypes = [
  { id: "restaurant", label: "Restaurant Menu" },
  { id: "vcard", label: "vCard / Contact" },
  { id: "social", label: "Social Media" },
  { id: "location", label: "Google Maps" },
  { id: "email", label: "Email" },
  { id: "wifi", label: "Wi-Fi" },
];

const QUERY_TO_ID: Record<string, string> = {
  "restaurant-menu": "restaurant",
  restaurant: "restaurant",
  vcard: "vcard",
  "social-media": "social",
  social: "social",
  "google-maps": "location",
  maps: "location",
  location: "location",
  email: "email",
  wifi: "wifi",
};

const ID_TO_QUERY: Record<string, string> = {
  restaurant: "restaurant-menu",
  vcard: "vcard",
  social: "social-media",
  location: "google-maps",
  email: "email",
  wifi: "wifi",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidHttpUrl(value: string): boolean {
  const t = value.trim();
  if (!/^https?:\/\//i.test(t)) return false;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function buildQrData(
  activeType: string,
  values: Record<string, string>
): { data: string; error?: string } {
  switch (activeType) {
    case "restaurant":
    case "social":
    case "location": {
      const url = values.url?.trim() ?? "";
      if (!url) return { data: "", error: "URL is required" };
      if (!isValidHttpUrl(url)) return { data: "", error: "Enter a valid URL starting with http:// or https://" };
      return { data: url };
    }
    case "vcard": {
      const name = values.name?.trim() ?? "";
      const phone = values.phone?.trim() ?? "";
      const email = values.email?.trim() ?? "";
      const website = values.website?.trim() ?? "";
      if (!name) return { data: "", error: "Name is required" };
      if (email && !emailRegex.test(email)) return { data: "", error: "Enter a valid email" };
      if (website && !isValidHttpUrl(website)) return { data: "", error: "Website must start with http:// or https://" };
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        `TEL:${phone}`,
        `EMAIL:${email}`,
        `URL:${website}`,
        "END:VCARD",
      ];
      return { data: lines.join("\n") };
    }
    case "email": {
      const to = values.to?.trim() ?? "";
      const subject = values.subject ?? "";
      const body = values.body ?? "";
      if (!to) return { data: "", error: "Recipient email is required" };
      if (!emailRegex.test(to)) return { data: "", error: "Enter a valid email" };
      const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return { data: `mailto:${to}?${q}` };
    }
    case "wifi": {
      const ssid = values.ssid?.trim() ?? "";
      const password = values.password ?? "";
      const security = values.security ?? "WPA";
      if (!ssid) return { data: "", error: "Network name (SSID) is required" };
      if (security === "nopass") {
        return { data: `WIFI:T:nopass;S:${ssid};P:;;` };
      }
      return { data: `WIFI:T:${security};S:${ssid};P:${password};;` };
    }
    default:
      return { data: "", error: "Unknown type" };
  }
}

const QR_PX = 300;
const WATERMARK_H = 28;
const FRAME_H = 40;
const FREE_LIMIT = 5;

const FRAME_OPTIONS = [
  { value: "", label: "No Frame" },
  { value: "Beni Tara", label: "Beni Tara" },
  { value: "Menüye Bak", label: "Menüye Bak" },
  { value: "Bize Puan Ver", label: "Bize Puan Ver" },
  { value: "Wi-Fi için Tara", label: "Wi-Fi için Tara" },
];

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

async function downloadQrCanvas(
  proxyUrl: string,
  withWatermark: boolean,
  filename: string,
  frameLabel: string
): Promise<void> {
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
  const [activeType, setActiveType] = useState("restaurant");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savePromptVisible, setSavePromptVisible] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "register";
  }>({ open: false, tab: "register" });
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

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const applyUserAndPlan = async (user: User | null) => {
      setCurrentUser(user);
      if (!user) {
        setProfilePlan(null);
        setPlanLoaded(true);
        return;
      }
      setPlanLoaded(false);
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      if (!mounted) return;
      const p = data?.plan;
      if (p === "pro" || p === "business") setProfilePlan(p);
      else setProfilePlan("free");
      setPlanLoaded(true);
    };

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) void applyUserAndPlan(user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) void applyUserAndPlan(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  const syncQueryFromType = useCallback(
    (id: string) => {
      const q = ID_TO_QUERY[id] ?? "restaurant-menu";
      router.replace(`/generate?type=${q}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const raw = searchParams.get("type");
    if (!raw) return;
    const id = QUERY_TO_ID[raw.toLowerCase()];
    if (id) setActiveType(id);
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
  };

  const setField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = buildQrData(activeType, formValues);
    if (error) {
      setErrors({ _form: error });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const encoded = encodeURIComponent(data);
    const colorParam = `&color=${qrColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;
    const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}${colorParam}`;
    const proxyUrl = `/api/qr-image?url=${encodeURIComponent(generatedUrl)}`;
    setQrUrl(generatedUrl);
    setQrProxyUrl(proxyUrl);
    setImgLoaded(false);
    setImgError(false);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user ?? null);

      if (user) {
        const paid = profilePlan === "pro" || profilePlan === "business";

        // Check limit for free plan users only
        if (!paid) {
          const now = new Date();
          const { count, error: countError } = await supabase
            .from("qr_codes")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString());

          if (countError) {
            setErrors({ _form: countError.message });
            setSubmitting(false);
            return;
          }

          if ((count ?? 0) >= FREE_LIMIT) {
            setLimitReachedModal(true);
            setSubmitting(false);
            return;
          }
        }

        const title =
          formValues.name?.trim() ||
          formValues.ssid?.trim() ||
          qrTypes.find((item) => item.id === activeType)?.label ||
          "QR Code";

        const { error: insertError } = await supabase.from("qr_codes").insert({
          user_id: user.id,
          type: activeType,
          title,
          data,
          qr_url: generatedUrl,
        });
        if (insertError) {
          setErrors({ _form: insertError.message });
        } else {
          setSavePromptVisible(false);
        }
      } else {
        // Unauthenticated user: check localStorage limit
        const unauthCount = getUnauthQrCount();
        if (unauthCount >= FREE_LIMIT) {
          setLimitReachedModal(true);
          setSubmitting(false);
          return;
        }
        incrementUnauthQrCount();
        setSavePromptVisible(true);
      }
    } catch {
      setErrors({ _form: "QR created, but saving failed. Please try again." });
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
      await downloadQrCanvas(
        qrProxyUrl,
        withWatermark,
        `quickqr-${activeType}-${Date.now()}.png`,
        frameLabel
      );
    } catch {
      setErrors({ _form: "Download failed. Please try again." });
    } finally {
      setDownloading(false);
    }
  };

  const inputClass = (key: string) =>
    `mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors[key] ? "border-red-500" : "border-gray-300"
    }`;

  const fieldError = (key: string) =>
    errors[key] ? <p className="text-red-500 text-sm mt-1">{errors[key]}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-600 hover:text-green-700 transition"
          title="Back to home"
        >
          <i className="ri-qr-code-line text-2xl" aria-hidden />
          QuickQR
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 flex items-center gap-1 text-sm font-medium"
          >
            <i className="ri-home-line text-lg" aria-hidden />
            Home
          </Link>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-600 hover:text-green-600 flex items-center gap-1"
          >
            <i className="ri-time-line text-lg" />
            View History
          </button>

          {currentUser ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="text-gray-600 hover:text-red-600 flex items-center gap-1"
            >
              <i className="ri-logout-box-r-line text-lg" />
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModal({ open: true, tab: "register" })}
              className="text-gray-600 hover:text-green-600 flex items-center gap-1"
            >
              <i className="ri-user-add-line text-lg" />
              Register
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="space-y-2">
          {qrTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleTypeChange(type.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeType === type.id
                  ? "bg-green-600 text-white font-semibold"
                  : "bg-white border hover:bg-gray-50 text-gray-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">
              Create {qrTypes.find((q) => q.id === activeType)?.label} QR Code
            </h2>

            {errors._form && (
              <p className="text-red-500 text-sm mb-4">{errors._form}</p>
            )}

            {activeType === "restaurant" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Menu URL</label>
                  <input
                    type="url"
                    autoComplete="url"
                    value={formValues.url ?? ""}
                    onChange={(e) => setField("url", e.target.value)}
                    placeholder="https://yourrestaurant.com/menu"
                    className={inputClass("url")}
                  />
                  {fieldError("url")}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}

            {activeType === "social" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile or page URL</label>
                  <input
                    type="url"
                    autoComplete="url"
                    value={formValues.url ?? ""}
                    onChange={(e) => setField("url", e.target.value)}
                    placeholder="https://instagram.com/yourbrand"
                    className={inputClass("url")}
                  />
                  {fieldError("url")}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}

            {activeType === "location" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                  <input
                    type="url"
                    autoComplete="url"
                    value={formValues.url ?? ""}
                    onChange={(e) => setField("url", e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className={inputClass("url")}
                  />
                  {fieldError("url")}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}

            {activeType === "vcard" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={formValues.name ?? ""}
                    onChange={(e) => setField("name", e.target.value)}
                    className={inputClass("name")}
                  />
                  {fieldError("name")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={formValues.phone ?? ""}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={inputClass("phone")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={formValues.email ?? ""}
                    onChange={(e) => setField("email", e.target.value)}
                    className={inputClass("email")}
                  />
                  {fieldError("email")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    autoComplete="url"
                    value={formValues.website ?? ""}
                    onChange={(e) => setField("website", e.target.value)}
                    placeholder="https://"
                    className={inputClass("website")}
                  />
                  {fieldError("website")}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}

            {activeType === "email" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={formValues.to ?? ""}
                    onChange={(e) => setField("to", e.target.value)}
                    className={inputClass("to")}
                  />
                  {fieldError("to")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={formValues.subject ?? ""}
                    onChange={(e) => setField("subject", e.target.value)}
                    className={inputClass("subject")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Body</label>
                  <textarea
                    rows={4}
                    value={formValues.body ?? ""}
                    onChange={(e) => setField("body", e.target.value)}
                    className={`${inputClass("body")} min-h-[100px]`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}

            {activeType === "wifi" && (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Network name (SSID)</label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={formValues.ssid ?? ""}
                    onChange={(e) => setField("ssid", e.target.value)}
                    className={inputClass("ssid")}
                  />
                  {fieldError("ssid")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={formValues.password ?? ""}
                    onChange={(e) => setField("password", e.target.value)}
                    className={inputClass("password")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Security</label>
                  <select
                    value={formValues.security ?? "WPA"}
                    onChange={(e) => setField("security", e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (open network)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  {submitting ? "Generating..." : "Generate QR Code"}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Customize Colors</h2>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QR Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm text-gray-500 font-mono">{qrColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm text-gray-500 font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {qrUrl && (
            <div className="bg-white shadow rounded-lg p-6 text-center space-y-4">
              <h2 className="text-lg font-bold mb-4">Your QR Code</h2>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {FRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrameLabel(opt.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                      frameLabel === opt.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {opt.label || "No Frame"}
                  </button>
                ))}
              </div>
              <div className="inline-flex flex-col items-center border-2 border-green-500 rounded-2xl p-4">
                <div className="relative w-[300px] h-[300px]">
                  {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse text-gray-500 text-sm">
                      Loading preview…
                    </div>
                  )}
                  {imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg text-red-500 text-sm">
                      Failed to load QR. Check your connection.
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrProxyUrl}
                    alt="Generated QR code"
                    width={300}
                    height={300}
                    className={imgLoaded ? "block" : "invisible"}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                  />
                </div>
                {imgLoaded && frameLabel && (
                  <div
                    className="w-[300px] flex items-center justify-center font-bold text-white text-base"
                    style={{ backgroundColor: "#16a34a", height: `${FRAME_H}px` }}
                  >
                    {frameLabel}
                  </div>
                )}
                {imgLoaded && (!currentUser || !(profilePlan === "pro" || profilePlan === "business")) && (
                  <p className="text-xs text-gray-400 mt-2 tracking-wide">Made with QuickQR</p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => void downloadPng()}
                  disabled={!imgLoaded || downloading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? "Downloading…" : "Download PNG"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrUrl("");
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-md"
                >
                  Create Another
                </button>
              </div>
              {!currentUser && savePromptVisible && (
                <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-center gap-3">
                  <span>Sign up to save your QR codes and view scan analytics</span>
                  <button
                    type="button"
                    onClick={() => setAuthModal({ open: true, tab: "register" })}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    Create Free Account
                  </button>
                </div>
              )}
            </div>
          )}

          {showHistory && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">QR Code History</h2>
              <p className="text-gray-500">No history data yet.</p>
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
        defaultTab={authModal.tab}
      />

      {limitReachedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <i className="ri-alert-line text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You've reached your free limit
              </h2>
              <p className="text-gray-600">
                Upgrade to Pro for unlimited QR codes and advanced analytics.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">Pro Plan:</span> 100+ QR codes per month
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  router.push("/pricing");
                  setLimitReachedModal(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Upgrade to Pro
              </button>
              <button
                type="button"
                onClick={() => setLimitReachedModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
