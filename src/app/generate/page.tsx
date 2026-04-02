"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

async function renderQrOnCanvas(
  canvas: HTMLCanvasElement,
  qrApiUrl: string,
  withWatermark: boolean
): Promise<void> {
  const proxyUrl = `/api/qr-image?url=${encodeURIComponent(qrApiUrl)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("QR proxy failed");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No canvas context"));
          return;
        }
        const w = QR_PX;
        const h = withWatermark ? QR_PX + WATERMARK_H : QR_PX;
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, QR_PX, QR_PX);
        if (withWatermark) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, QR_PX, w, WATERMARK_H);
          ctx.fillStyle = "#9ca3af";
          ctx.font = "500 12px system-ui, Segoe UI, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("Made with QuickQR", w / 2, QR_PX + WATERMARK_H / 2);
        }
        resolve();
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profilePlan, setProfilePlan] = useState<"free" | "pro" | "business" | null>(null);
  const [planLoaded, setPlanLoaded] = useState(false);
  const [qrCanvasLoading, setQrCanvasLoading] = useState(false);
  const [qrCanvasReady, setQrCanvasReady] = useState(false);

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

  useEffect(() => {
    if (!qrUrl || !planLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paid = profilePlan === "pro" || profilePlan === "business";
    const withWatermark = !currentUser || !paid;

    let cancelled = false;
    setQrCanvasLoading(true);
    setQrCanvasReady(false);
    void renderQrOnCanvas(canvas, qrUrl, withWatermark)
      .then(() => {
        if (!cancelled) {
          setQrCanvasLoading(false);
          setQrCanvasReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrCanvasLoading(false);
          setQrCanvasReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [qrUrl, planLoaded, currentUser, profilePlan]);

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
    setQrCanvasReady(false);
    setQrCanvasLoading(false);
    const c = canvasRef.current;
    if (c) {
      c.width = 0;
      c.height = 0;
    }
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
    const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
    setQrUrl(generatedUrl);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user ?? null);

      if (user) {
        const { count, error: countError } = await supabase
          .from("qr_codes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) {
          setErrors({ _form: countError.message });
          return;
        }

        if ((count ?? 0) >= 5) {
          setErrors({ _form: "Free plan limit reached. Upgrade to create more QR codes." });
          return;
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


  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrCanvasReady || canvas.width === 0) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `quickqr-${activeType}-${Date.now()}.png`;
    a.click();
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

          {qrUrl && (
            <div className="bg-white shadow rounded-lg p-6 text-center space-y-4">
              <h2 className="text-lg font-bold mb-4">Your QR Code</h2>
              <div className="inline-block border-2 border-green-500 rounded-2xl p-4 relative min-h-[300px] min-w-[300px]">
                {qrCanvasLoading && (
                  <div
                    className="absolute inset-4 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse text-gray-500 text-sm"
                    aria-busy
                  >
                    Loading preview…
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className={`mx-auto max-w-full h-auto ${qrCanvasLoading ? "opacity-0" : "opacity-100"}`}
                  aria-label="Generated QR code"
                />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={downloadPng}
                  disabled={qrCanvasLoading || !qrCanvasReady}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PNG
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
    </div>
  );
}
