"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function buildPayload(
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

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeType, setActiveType] = useState("restaurant");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState("");
  const [showHistory, setShowHistory] = useState(false);

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
  }, []);

  const handleTypeChange = (id: string) => {
    setActiveType(id);
    resetForm();
    syncQueryFromType(id);
  };

  const setField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = buildPayload(activeType, formValues);
    if (error) {
      setErrors({ _form: error });
      return;
    }
    setErrors({});
    const encoded = encodeURIComponent(data);
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`
    );
  };

  const downloadPng = async () => {
    if (!qrUrl) return;
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `quickqr-${activeType}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const inputClass = (key: string) =>
    `mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors[key] ? "border-red-500" : "border-gray-300"
    }`;

  const fieldError = (key: string) =>
    errors[key] ? <p className="text-red-500 text-sm mt-1">{errors[key]}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-xl font-bold text-green-600">
          <i className="ri-qr-code-line text-2xl" />
          QuickQR
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-600 hover:text-green-600 flex items-center gap-1"
          >
            <i className="ri-time-line text-lg" />
            View History
          </button>

          <button type="button" className="text-gray-600 hover:text-red-600 flex items-center gap-1">
            <i className="ri-logout-box-r-line text-lg" />
            Logout
          </button>
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
                >
                  Generate QR Code
                </button>
              </form>
            )}
          </div>

          {qrUrl && (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-lg font-bold mb-4">Your QR Code</h2>
              <div className="inline-block border-2 border-green-500 rounded-2xl p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="Generated QR code" className="w-[300px] h-[300px] mx-auto" />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={downloadPng}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
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
    </div>
  );
}
